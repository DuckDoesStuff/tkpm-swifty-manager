"use client";
import FileChooser from "@/components/FormElements/FileChooser";
import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import { FaCheck } from "react-icons/fa";
import React, { useState } from "react";
import Loader from "@/components/common/Loader";
import { message, Result } from "antd";
import * as Yup from "yup";
import Button from "@/components/UI/Button";

const shopFormSchema = Yup.object().shape({
  name: Yup.string().required("Shop name is required").min(4),
  address: Yup.string().required("Shop address is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .length(10, "Phone number must be 10 digits"),
  description: Yup.string().required("Shop description is required"),
});

interface ShopFormProps {
  name: string;
  address: string;
  phone: string;
  description: string;
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

const createShopAPI = (shopForm: ShopFormProps) => {
  return fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/shop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shopForm),
    credentials: "include",
  });
};

export default function CreateShopForm() {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [shopForm, setShopForm] = useState<ShopFormProps>({
    name: "",
    address: "",
    phone: "",
    description: "",
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
              content: err.errors[0],
              type: "error",
            });
            setSuccess(false);
          });
      })
      .catch((err) => {
        message.open({
          key,
          content: err.errors[0],
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
        <FileChooser label={"Choose a logo for your shop"} multiple />

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
