"use client";
import FileChooser from "@/components/FormElements/FileChooser";
import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import {FaCheck} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {message, Result} from "antd";
import * as Yup from "yup";
import Button from "@/components/UI/Button";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {auth} from "@/js/firebase.config";
import {useParams} from "next/navigation";
import ShopInfo from "@/types/ShopInfo";

const shopFormSchema = Yup.object().shape({
  nameId: Yup.string().required("Shop name is required").min(4),
  displayName: Yup.string().required("Display name is required").min(4),
  address: Yup.string().required("Shop address is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .length(10, "Phone number must be 10 digits"),
  description: Yup.string().required("Shop description is required"),
});

const SuccessResponse = () => {
  return (
    <Result
      status="success"
      title="Your shop has been created!"
      extra={[
        <Button
          icon={<FaCheck size={25}/>}
          href={"#"}
          label={"Go view your shop"}
        />,
      ]}
    />
  );
};

interface FailedResponseProps {
  setSuccess: () => void;
}

const FailedResponse = ({setSuccess}: FailedResponseProps) => {
  return (
    <Result
      status="error"
      title="Failed to create shop"
      extra={[
        <Button
          icon={<FaCheck size={25}/>}
          onClick={setSuccess}
          label={"Try again"}
        />,
      ]}
    />
  );
};

const updateInfoAPI = async (shopForm: ShopInfo) => {
  const userId = auth.currentUser?.uid;
  if (userId == null) throw new Error("User not authenticated");
  console.log(shopForm.nameId);
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/shop/${shopForm.nameId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      displayName: shopForm.displayName,
      address: shopForm.address,
      phone: shopForm.phone,
      description: shopForm.description,
      logo: shopForm.logo,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const uploadCloudStorage = async (file: File, userId: string | undefined, shopId: string) => {
  // Rename file before uploading
  const cloudStorage = getStorage();
  const storageRef = ref(cloudStorage);
  const destinationRef =
    ref(storageRef, `public/${userId}/${shopId}/logo.jpg`);


  const snapshot = await uploadBytes(destinationRef, file);
  if (!snapshot) {
    throw new Error("Failed to upload file");
  }
  return await getDownloadURL(snapshot.ref);
}

export default function EditShopForm() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [shopForm, setShopForm] = useState<ShopInfo | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const params = useParams();

  useEffect(() => {
    if (loading) {
      fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/shop/" + params.id + '?loadProduct=false', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setShopForm(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  if (!shopForm) {
    return <p>Shop not found</p>;
  }

  const handleCreateShop = () => {
    const key = "updatable";
    message.open({
      key,
      content: "Updating shop...",
      type: "loading",
      duration: 0,
    });

    shopFormSchema
      .validate(shopForm)
      .then(async () => {
        if (image != null) {
          shopForm.logo = await uploadCloudStorage(image, auth.currentUser?.uid, shopForm.nameId);
        }

        await updateInfoAPI(shopForm);

        message.open({
          key,
          content: "Successfully updated shop!",
          type: "success",
        });
      })
      .catch((err) => {
        message.open({
          key,
          content: err.message,
          type: "error",
        });
      });
  };

  if (success == true) return <SuccessResponse/>;
  else if (success == false)
    return <FailedResponse setSuccess={() => setSuccess(null)}/>;

  return (
    <div>
      <form className={"flex flex-col gap-9"}>
        <div className={"grid grid-cols-3 gap-9"}>
          <FormInput
            label={"Display name"}
            placeholder={"Display name for your shop"}
            onChange={(e) =>
              setShopForm({...shopForm, displayName: e.target.value})
            }
            default={shopForm?.displayName}
            required/>
          <FormInput
            onChange={(e) =>
              setShopForm({...shopForm, address: e.target.value})
            }
            default={shopForm?.address}
            label={"Shop address"}
            placeholder={"Address"}
            required
          />
          <FormInput
            onChange={(e) =>
              setShopForm({...shopForm, phone: e.target.value})
            }
            default={shopForm?.phone}
            label={"Phone number"}
            placeholder={"Phone"}
            type={"tel"}
            required
          />
        </div>
        <FormInput
          label={"Shop name"}
          disabled
          default={shopForm?.nameId}
          required
        />
        <FormTextArea
          onChange={(e) =>
            setShopForm({...shopForm, description: e.target.value})
          }
          default={shopForm?.description}
          label={"Shop description"}
          placeholder={"Description"}
          required
        />
        <FileChooser
          onChange={(e) => setImage(e.target.files?.[0] as File)}
          label={"Choose a logo for your shop"}/>

        <div className={"self-center"}>
          <Button
            onClick={handleCreateShop}
            icon={<FaCheck/>}
            label={"Save info"}
          />
        </div>
      </form>
    </div>
  );
}
