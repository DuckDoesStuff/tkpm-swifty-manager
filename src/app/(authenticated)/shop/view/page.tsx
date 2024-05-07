"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import Loader from "@/components/common/Loader";
import Image from "next/image";
import {useRouter} from "next/navigation";

const NoShop = () => (
  <h1>
    You currently don't have any shops, create one{" "}
    <Link href="/shop/create">
      <b>here</b>
    </Link>
  </h1>
);

interface ShopCardProps {
  nameId: string;
  displayName: string;
  description: string;
  address: string;
  phone: string;
  logo: string;
}

interface ShopCardProps {
  handleOnClick?: void
}

const ShopCard = ({
                    displayName,
                    nameId,
                    description,
                    address,
                    phone,
                    logo,
                  }: ShopCardProps) => {
  const router = useRouter();
  return (

    <Link href={`/shop/${nameId}`}
          className="flex justify-between transition-all duration-200 hover:bg-opacity-60 hover:dark:bg-boxdark-2 rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div>
        <h1>Name: {displayName}</h1>
        <p>ID: {nameId}</p>
        <p>Description: {description}</p>
        <p>Address: {address}</p>
        <p>Phone: {phone}</p>
      </div>
      <Image className={"rounded-3xl"} width={120} height={120} priority src={logo} alt={`${nameId}-shop-logo`}/>
  </Link>
  )
}

export default function Shop() {
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<[ShopCardProps] | []>([]);

  useEffect(() => {
    let ignore = false;
    // Fetch shops
    fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/shop",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      .then(async (res) => {
        const response = await res.json();
        if (ignore) return;
        setShops(response);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      ignore = true;
    }

  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (shops.length <= 0) {
    return (
      <div>
        <NoShop/>
      </div>
    );
  }

  return (
    <div className={"flex flex-col gap-6"}>
      {shops.map((shop) => (
        <ShopCard key={shop.nameId} {...shop} />
      ))}
    </div>
  );
}
