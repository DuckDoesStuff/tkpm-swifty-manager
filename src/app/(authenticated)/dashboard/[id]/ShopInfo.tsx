"use client"
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import Loader from "@/components/common/Loader";
import Image from "next/image";
import Link from "next/link";
import CardDataStats from "@/components/CardDataStats";
import {FaEye} from "react-icons/fa";
import {FiPercent} from "react-icons/fi";
import {MdOutlineAttachMoney} from "react-icons/md";
import {BsCart2} from "react-icons/bs";
import ShopInfo from "@/types/ShopInfo";


export default function ShopInfo() {
  const params = useParams<{ tag: string; id: string }>();
  const router = useRouter();
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(loading) {
      fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/shop/" + params.id, {
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
          setShopInfo(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  if (loading) return <Loader/>

  if (!shopInfo) return <p>Shop not found</p>

  return (
    <div className={"flex flex-col gap-5"}>
      <h1 className={"text-3xl font-bold text-black dark:text-white mb-5"}>Shop Info</h1>
      <div className={"flex justify-between mb-5"}>
        <Link href="/shop/view" className={"text-primary font-bold underline"}>Go back</Link>
        <Link href={`${params.id}/edit`} className={"text-primary font-bold underline"}>Edit shop</Link>
      </div>

      <div
        className={"flex justify-between rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
        <div className={"flex flex-col justify-between text-black text-md font-medium dark:text-white"}>
          <p>Name: {shopInfo.displayName}</p>
          <p>Description: {shopInfo.description}</p>
          <p>Address: {shopInfo.address}</p>
          <p>Phone: {shopInfo.phone}</p>
        </div>
        <Image className={"rounded-3xl"} width={120} height={120} priority src={shopInfo.logo}
               alt={`${shopInfo.nameId}-shop-logo`}/>
      </div>

      <div className={"grid lg:grid-cols-4 sm:grid-cols-2 gap-10"}>
        <CardDataStats title="Total sold" total={shopInfo.sold.toString()} rate="" levelUp>
          <BsCart2 size={25} color={"green"}/>
        </CardDataStats>
        <CardDataStats title="Total revenue" total={`$${shopInfo.revenue.toString()}`} rate="" levelUp>
          <MdOutlineAttachMoney size={25} color={"green"}/>
        </CardDataStats>
        <CardDataStats title="Total views" total="No data" rate="">
          <FaEye size={20}/>
        </CardDataStats>
        <CardDataStats title="Average rating" total="No data" rate="">
          <FiPercent size={20}/>
        </CardDataStats>
      </div>

    </div>
  )
}

