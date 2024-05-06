"use client";


import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import Button from "@/components/UI/Button";
import FileChooser from "@/components/FormElements/FileChooser";
import * as Yup from "yup";
import {useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {auth} from "@/js/firebase.config";

interface NewProductFormProps {
  name: string;
  stock: number;
  price: number;
  description: string;
  image: FileList | null | string;
}

const newProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required").min(4),
  stock: Yup.number().required("Stock count is required").min(1),
  price: Yup.number().required("Price is required").min(1),
  description: Yup.string().required("Product description is required"),
  image: Yup.mixed().required("Product image is required"),
});

const uploadCloudStorage = async (files: FileList, userId: string, shopId: string, productId: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, `shops/${userId}/${shopId}/products/${productId}`);
  const imageRef = ref(storageRef, "thumbnail.jpg");
  try {
    await getDownloadURL(imageRef);
    throw new Error("Image already exists");
  }
  catch (e) {
    console.log("Product image does not exist, continue")
  }

  await uploadBytes(imageRef, files[0]);
  const thumbnailUrl = await getDownloadURL(imageRef);

  for (let i = 1; i < files.length; i++) {
    const imageRef = ref(storageRef, files[i].name);
    await uploadBytes(imageRef, files[i]);
  }

  return {thumbnailUrl};
}

const createProductAPI = async (product: NewProductFormProps) => {

  const userId = auth.currentUser?.uid;
  if(product.image == null) throw new Error("Shop logo is required");
  if(userId == null) throw new Error("User not authenticated");


  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();

}

export default function NewProductForm() {
  const [product, setProduct] = useState<NewProductFormProps>({
    name: "",
    stock: 0,
    price: 0,
    description: "",
    image: null,
  });


  const handleCreateProduct = () => {
    newProductSchema.validate(product)
      .then(() => {
      // Upload image to storage

    }).catch((error) => {
      console.error(error);
    });
  }


  return (
    <form className={"flex flex-col mt-5 gap-5"}>
      <FormInput onChange={(e) => setProduct({...product, name:e.target.value})} label="Name" type="text" placeholder="Product Name" required/>

      <div className={"grid grid-cols-2 gap-10"}>
        <FormInput onChange={(e) => setProduct({...product, stock: Number(e.target.value)})} label="Stock" type="number" placeholder="Stock count" required/>
        <FormInput onChange={(e) => setProduct({...product, price: Number(e.target.value)})} label="Price" type="number" placeholder="Price each product" required/>
      </div>

      <FormTextArea onChange={(e) => setProduct({...product, description:e.target.value})} label="Description" placeholder="Product Description" required/>

      <FileChooser onChange={(e) => setProduct({...product, image:e.target.files})} label="Product Image" required multiple/>

      <div className={"self-center"}>
        <Button onClick={handleCreateProduct} label={"Create new product"}/>
      </div>
    </form>
  )
}