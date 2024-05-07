"use client";
import FileChooser from "@/components/FormElements/FileChooser";
import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import {FaCheck} from "react-icons/fa";
import React, {useState} from "react";
import {message, Result} from "antd";
import * as Yup from "yup";
import Button from "@/components/UI/Button";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {auth} from "@/js/firebase.config";

const shopFormSchema = Yup.object().shape({
  name: Yup.string().required("Shop name is required").min(4),
  displayName: Yup.string().required("Display name is required").min(4),
  address: Yup.string().required("Shop address is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .length(10, "Phone number must be 10 digits"),
  description: Yup.string().required("Shop description is required"),
  logo: Yup.mixed().required("Shop logo is required"),
});

interface ShopFormProps {
  name: string;
  displayName: string;
  address: string;
  phone: string;
  description: string;
  logo: File | null | string;
}

const SuccessResponse = () => {
  return (
    <Result
      status="success"
      title="Your shop has been created!"
      extra={[
        <Button
          icon={<FaCheck size={25} />}
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

const FailedResponse = ({ setSuccess }: FailedResponseProps) => {
  return (
    <Result
      status="error"
      title="Failed to create shop"
      extra={[
        <Button
          icon={<FaCheck size={25} />}
          onClick={setSuccess}
          label={"Try again"}
        />,
      ]}
    />
  );
};

const createShopAPI = async (shopForm: ShopFormProps) => {
  const userId = auth.currentUser?.uid;
  if(userId == null) throw new Error("User not authenticated");

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/shop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nameId: shopForm.name,
      displayName: shopForm.displayName,
      address: shopForm.address,
      phone: shopForm.phone,
      description: shopForm.description,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  console.log("Shop created uploading file")

  shopForm.logo = await uploadCloudStorage(shopForm.logo as File, userId, shopForm.name);

  console.log("File uploaded updating shop")
  await updateShopAPI(shopForm.name, shopForm.logo as string);
  console.log("Shop updated")

};

const uploadCloudStorage = async (file: File , userId: string | undefined, shopId: string) => {
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

const updateShopAPI = async (shopId: string, logo: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/shop/${shopId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({logo}),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

}

export default function CreateShopForm() {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [shopForm, setShopForm] = useState<ShopFormProps>({
    name: "",
    displayName: "",
    address: "",
    phone: "",
    description: "",
    logo: null,
  });

  const handleCreateShop = () => {
    const key = "updatable";
    message.open({
      key,
      content: "Creating shop...",
      type: "loading",
      duration: 0,
    });

    shopFormSchema
      .validate(shopForm)
      .then(() => {
        createShopAPI(shopForm)
          .then(() => {
            message.open({
              key,
              content: "Successfully created shop!",
              type: "success",
            });
            setSuccess(true);
          })
          .catch((err) => {
            message.open({
              key,
              content: err,
              type: "error",
            });
            setSuccess(false);
          });
      })
      .catch((err) => {
        message.open({
          key,
          content: err,
          type: "error",
        });
      });
  };

  if (success == true) return <SuccessResponse />;
  else if (success == false)
    return <FailedResponse setSuccess={() => setSuccess(null)} />;

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
            required/>
          <FormInput
            onChange={(e) =>
              setShopForm({ ...shopForm, address: e.target.value })
            }
            label={"Shop address"}
            placeholder={"Address"}
            required
          />
          <FormInput
            onChange={(e) =>
              setShopForm({ ...shopForm, phone: e.target.value })
            }
            label={"Phone number"}
            placeholder={"Phone"}
            type={"tel"}
            required
          />
        </div>
        <FormInput
          onChange={(e) => setShopForm({...shopForm, name: e.target.value})}
          label={"Shop name"}
          placeholder={"Should be unique, can't be changed, no spaces or special characters"}
          required
        />
        <FormTextArea
          onChange={(e) =>
            setShopForm({ ...shopForm, description: e.target.value })
          }
          label={"Shop description"}
          placeholder={"Description"}
          required
        />
        <FileChooser
          onChange={(e) => setShopForm({ ...shopForm, logo: e.target.files ? e.target.files[0] : null})}
          label={"Choose a logo for your shop"} required />

        <div className={"self-center"}>
          <Button
            onClick={handleCreateShop}
            icon={<FaCheck />}
            label={"Create new shop"}
          />
        </div>
      </form>
    </div>
  );
}
