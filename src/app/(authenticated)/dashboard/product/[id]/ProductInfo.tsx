"use client"
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {ProductInfo} from "@/types/productInfo";
import Loader from "@/components/common/Loader";
import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import Button from "@/components/UI/Button";
import Link from "next/link";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import FileChooser from "@/components/FormElements/FileChooser";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {auth} from "@/js/firebase.config";
import {message} from "antd";


const uploadCloudStorage = async (files: FileList, userId: string, shopNameId: string, productId: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, `public/${userId}/${shopNameId}/products/${productId}`);

  const uploadPromises = Array.from(files).map(async (file, i) => {
    const thumbnailRef = ref(storageRef, `thumbnail_${i + 1}.jpg`);
    await uploadBytes(thumbnailRef, file);
    return await getDownloadURL(thumbnailRef);
  });

  return await Promise.all(uploadPromises);
}

const createProductImageAPI = async (productId: string, thumbnail: string[]) => {

  const deleteResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product/thumbnail/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!deleteResponse.ok) {
    throw new Error(`Error deleting product image! status: ${deleteResponse.status}`);
  }

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


export default function ProductInfo() {
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const params = useParams<{ tag: string; id: string }>();
  const searchParams = useSearchParams();
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product/${params.id}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
        setEdit(searchParams.get("edit") === "true");
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  if (loading) {
    return <Loader/>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: {max: 4000, min: 3000},
      items: 1
    },
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 1
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 1
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1
    }
  };

  const handleSave = async () => {
    message.loading({
      content: 'Updating product...',
      key: 'update-product',
      duration: 0
    });
    if (images != null) {
      const authUser = auth.currentUser;
      if (authUser == null) {
        message.error({
          content: 'You need to login to update product',
          key: 'update-product',
        });
        return;
      }
      const userId = authUser.uid;
      const urls = await uploadCloudStorage(images, userId, product.shop.nameId, product.id);
      await createProductImageAPI(params.id, urls);
    }


    fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/product/${product.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json",},
      credentials: "include",
      body: JSON.stringify({
        displayName: product.displayName,
        price: product.price,
        stock: product.stock,
        description: product.description
      })
    }).then((response) => {
      if (!response.ok) {
        message.error({
          content: 'Failed to update product.',
          key: 'update-product',
        });
        throw new Error(`Error updating product! status: ${response.status}`);
      }
      message.success({
        content: 'Successfully updated product',
        key: 'update-product',
      });
      router.refresh();
      setEdit(false);
    })
  }

  return (
    <>
      <Link href="#" className={"text-primary font-bold underline"} onClick={() => router.back()}>Go back</Link>
      <div
        className={"rounded-md border border-stroke mt-5 bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
        <div className={"grid grid-cols-2 gap-10"}>
          <div className={"flex flex-col gap-4"}>
            <FormInput onChange={(e) => setProduct({...product, displayName: e.target.value})} label={"Display name"}
                       disabled={!edit} default={product.displayName}/>
            <FormInput onChange={(e) => setProduct({...product, price: Number(e.target.value)})} type={"number"}
                       label={"Price"} disabled={!edit} default={product.price}/>
            <FormInput onChange={(e) => setProduct({...product, stock: Number(e.target.value)})} type={"number"}
                       label={"Stock"} disabled={!edit} default={product.stock}/>
            <FormTextArea onChange={(e) => setProduct({...product, description: e.target.value})} label={"Description"}
                          disabled={!edit} default={product.description}/>


            {!edit && <Button label={"Edit"} onClick={() => setEdit(true)}/>}

            {edit && (
              <div className={"flex justify-around"}>
                <Button label={"Save"} onClick={handleSave}/>
                <Button label={"Cancel"} color={"danger"} onClick={() => setEdit(false)}/>
              </div>
            )}

            {edit && <FileChooser onChange={(e) => setImages(e.target.files)} multiple label={"Upload new pictures"}/>}
          </div>

          <Carousel
            autoPlay={false}
            showDots={true}
            renderButtonGroupOutside={false}
            ssr={true}
            responsive={responsive}>
            {product.productImages.map((image, index) => {
              return (
                <div key={index} className={"w-full"}>
                  <Image style={{width: 600, height: 800, objectPosition: "center", objectFit: "contain"}}
                         alt={product.displayName + `-${index}`} src={image.url} width={600} height={800}/>
                </div>
              )
            })}

          </Carousel>
        </div>
      </div>
    </>
  )
}
