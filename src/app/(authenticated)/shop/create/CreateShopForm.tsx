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
  address: Yup.string().required("Shop address is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .length(10, "Phone number must be 10 digits"),
  description: Yup.string().required("Shop description is required"),
  logo: Yup.mixed().required("Shop logo is required"),
});

interface ShopFormProps {
  name: string;
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
  if(shopForm.logo == null) throw new Error("Shop logo is required");
  if(userId == null) throw new Error("User not authenticated");

  try {
    const result = await uploadCloudStorage(shopForm.logo as File, userId, shopForm.name.toLowerCase().replace(/ /g, "_"));
    shopForm.logo = result.downloadUrl;
  } catch (error) {
    throw new Error("Failed to upload image to cloud storage");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/shop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shopForm),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const uploadCloudStorage = async (file: File , userId: string | undefined, shopId: string) => {
  // Rename file before uploading
  const cloudStorage = getStorage();
  const storageRef = ref(cloudStorage);
  const destinationRef =
  ref(storageRef, `public/${userId}/${shopId}/logo.jpg`);

  // Check if file already exist
  try {
    await getDownloadURL(destinationRef);
    throw new Error("File already exist");
  } catch (error) {
    console.log("File does not exist, uploading...");
  }

  const snapshot = await uploadBytes(destinationRef, file);
  return {downloadUrl: await getDownloadURL(snapshot.ref), destinationRef};
}

export default function CreateShopForm() {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [shopForm, setShopForm] = useState<ShopFormProps>({
    name: "",
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
            onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
            label={"Shop name"}
            placeholder={"Name"}
            required
          />
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
