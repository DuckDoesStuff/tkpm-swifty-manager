"use client"
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Product} from "@/types/product";
import Loader from "@/components/common/Loader";
import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import Button from "@/components/UI/Button";
import Link from "next/link";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';

export default function ProductInfo() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const params = useParams<{ tag: string; id: string }>();

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

  const handleSave = () => {
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
        throw new Error(`Error updating product! status: ${response.status}`);
      }
      console.log(response);
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
