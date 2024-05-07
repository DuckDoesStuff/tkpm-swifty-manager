"use client";
import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import Button from "@/components/UI/Button";
import FileChooser from "@/components/FormElements/FileChooser";
import * as Yup from "yup";
import {useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {auth} from "@/js/firebase.config";
import {message} from "antd";
import {useParams} from "next/navigation";

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
const createProductAPI = async (product: NewProductFormProps, shopNameId: string) => {
  const userId = auth.currentUser?.uid;
  if(product.image == null) throw new Error("Shop logo is required");
  if(userId == null) throw new Error("User not authenticated");

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      displayName: product.name,
      stock: product.stock,
      price: product.price,
      description: product.description,
      shopNameId,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  const data = await response.json();
  const thumbnailUrl = await uploadCloudStorage(product.image as FileList, userId, shopNameId, data.id);
  console.log("thumbnailUrl", thumbnailUrl);
  await createProductImageAPI(data.id, thumbnailUrl);

  return data;
}

const uploadCloudStorage = async (files: FileList, userId: string, shopNameId: string, productId: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, `public/${userId}/${shopNameId}/products/${productId}`);

  const thumbnailUrl = [];
  for (let i = 0; i < files.length; i++) {
    const thumbnailRef = ref(storageRef, `thumbnail_${i + 1}.jpg`);
    await uploadBytes(thumbnailRef, files[i]);
    const url = await getDownloadURL(thumbnailRef);
    thumbnailUrl.push(url);
  }

  return thumbnailUrl;
}

const createProductImageAPI = async (productId: string, thumbnail: string[]) => {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product/thumbnail/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thumbnail),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error updating product image! status: ${response.status}`);
  }
}

export default function NewProductForm() {
  const [product, setProduct] = useState<NewProductFormProps>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null,
  });

  const params = useParams();

  const handleCreateProduct = () => {
    const key = "createProductMsg"
    message.open({
      key,
      content: "Creating Product...",
      type: "loading",
      duration: 0,
    });
    newProductSchema.validate(product)
      .then(() => {
        createProductAPI(product, params.id as string)
          .then((response) => {
            console.log(response)
            message.open({
              key,
              content: "Product created",
              type: "success",
              duration: 2,
            })
          })
          .catch((error) => {
            console.error(error);
            message.open({
              key,
              content: error.message,
              type: "error",
              duration: 2,
            });
          })
    }).catch((error) => {
      console.error(error);
      message.open({
        key,
        content: error.message,
        type: "error",
        duration: 2,
      });
    });
  }


  return (
    <div>
      <h1 className={"text-3xl font-bold text-black-2"}>Sell a new product</h1>
      <form className={"flex flex-col mt-5 gap-5"}>
        <FormInput onChange={(e) => setProduct({...product, name: e.target.value})} label="Name" type="text"
                   placeholder="Product Name" required/>

        <div className={"grid grid-cols-2 gap-10"}>
          <FormInput onChange={(e) => setProduct({...product, stock: Number(e.target.value)})} label="Stock"
                     type="number" placeholder="Stock count" required/>
          <FormInput onChange={(e) => setProduct({...product, price: Number(e.target.value)})} label="Price"
                     type="number" placeholder="Price each product" required/>
        </div>

        <FormTextArea onChange={(e) => setProduct({...product, description: e.target.value})} label="Description"
                      placeholder="Product Description" required/>

        <FileChooser onChange={(e) => setProduct({...product, image: e.target.files})} label="Product Image" required
                     multiple/>

        <div className={"self-center"}>
          <Button onClick={handleCreateProduct} label={"Create new product"}/>
        </div>
      </form>
    </div>
  )
}