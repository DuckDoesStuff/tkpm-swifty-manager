"use client"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Loader from "@/components/common/Loader";
import Image from "next/image";


interface ShopInfoProps {
  nameId: string;
  displayName: string;
  description: string;
  address: string;
  phone: string;
  logo: string;
  createdAt: string;
}

export default function ShopInfo() {
  const params = useParams<{ tag: string; id: string }>();
  const [shopInfo, setShopInfo] = useState<ShopInfoProps | null>(null);
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
    <div className={"flex justify-between rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark"}>
      <div>
        <p>Shop Info</p>
        <p>Name: {shopInfo.displayName}</p>
        <p>Description: {shopInfo.description}</p>
        <p>Address: {shopInfo.address}</p>
        <p>Phone: {shopInfo.phone}</p>
      </div>
      <Image className={"rounded-3xl"} width={120} height={120} priority src={shopInfo.logo}
             alt={`${shopInfo.nameId}-shop-logo`}/>
    </div>
  )
}

