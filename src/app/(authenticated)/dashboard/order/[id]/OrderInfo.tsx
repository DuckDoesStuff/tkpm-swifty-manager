'use client';
import Link from "next/link";
import FormInput from "@/components/FormElements/FormInput";
import FormTextArea from "@/components/FormElements/FormTextArea";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import OrderInfo from "@/types/OrderInfo";
import Loader from "@/components/common/Loader";
import 'react-multi-carousel/lib/styles.css';


export default function OrderInfo() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + `/order/${params.id}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

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

  if (loading) {
    return <Loader/>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className={"flex flex-col gap-5"}>
      {/*Product info*/}
      <h1 className={"text-2xl font-semibold text-black dark:text-white"}>Order info</h1>
      <Link href="#" className={"text-primary font-bold underline"} onClick={() => router.back()}>Go back</Link>
      <div
        className={"rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
        <div className={"grid grid-cols-2 gap-10"}>
          <div className={"flex flex-col gap-4"}>
            <FormInput label={"Display name"} disabled default={order.product.displayName}/>
            <FormInput type={"number"} label={"Price"} disabled value={order.product.price}/>
            <FormInput type={"number"} label={"Stock"} disabled value={order.product.stock}/>
            <FormTextArea label={"Description"} disabled value={order.product.description}/>
          </div>

          <Carousel
            autoPlay={false}
            showDots={true}
            renderButtonGroupOutside={false}
            ssr={true}
            responsive={responsive}>
            {order.product.productImages.map((image, index) => {
              return (
                <div key={index} className={"w-full"}>
                  <Image style={{width: "auto", height: "auto", objectPosition: "center", objectFit: "contain"}}
                         alt={order.product.displayName + `-${index}`} src={image.url} width={600} height={800}/>
                </div>
              )
            })}

          </Carousel>
        </div>
      </div>

      {/*Order info*/}
      <div
        className={"rounded-md border border-stroke bg-white p-9 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
        <div className={"grid grid-cols-2 gap-10 h-fit"}>
          {/*Order info*/}
          <div className={"flex flex-col gap-4"}>
            <h1 className={"text-xl font-semibold text-black dark:text-white"}>Order details</h1>
            <FormInput label={"Order ID"} disabled value={order.id}/>
            <FormInput label={"Ordered date"} disabled value={new Date(order.createdAt).toLocaleString()}/>
            <FormInput label={"Quantity"} disabled value={order.quantity}/>
            <FormInput label={"Total price"} disabled value={order.total}/>
            <FormInput label={"Status"} disabled value={order.status}/>

            {/*Action buttons*/}
            <div className={"flex justify-between gap-10 mt-3"}>
              <button disabled={order.status == "incart" || order.status == "completed"}
                      className={"bg-primary text-white rounded-md px-3 py-2 disabled:bg-neutral-500"}>Mark as shipping
              </button>
              <button disabled={order.status != "ordered"}
                      className={"bg-primary text-white rounded-md px-3 py-2 disabled:bg-neutral-500"}>Decline order
              </button>
              <button className={"bg-primary text-white rounded-md px-3 py-2"}>Contact customer</button>
            </div>
          </div>
          {/*Customer info*/}
          <div className={"flex flex-col gap-4"}>
            <h1 className={"text-xl font-semibold text-black dark:text-white"}>Customer details</h1>
            <FormInput label={"Name"} disabled value={order.customer.firstName + " " + order.customer.lastName}/>
            <FormInput label={"Address"} disabled value={order.customer.address ? order.customer.address : "Unknown"}/>
          </div>
        </div>
      </div>
    </div>
  )
}