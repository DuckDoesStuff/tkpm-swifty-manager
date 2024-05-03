"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import Loader from "@/components/common/Loader";

const NoShop = () => (
  <h1>
    You currently don't have any shops, create one{" "}
    <Link href="/shop/create">
      <b>here</b>
    </Link>
  </h1>
);

interface ShopCardProps {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
}

const ShopCard = ({ id, name, description, address, phone } : ShopCardProps) => (
  <Link href={`${id}`} className="transition-all duration-200 hover:bg-opacity-60 hover:dark:bg-boxdark-2 rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark">
    <h1>Name: {name}</h1>
    <p>ID: {id}</p>
    <p>Description: {description}</p>
    <p>Address: {address}</p>
    <p>Phone: {phone}</p>
  </Link>
);

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

  if(loading) {
    return (
      <Loader />
    );
  }

  if(shops.length <= 0) {
    return (
      <div>
        <NoShop />
      </div>
    );
  }

  return (
    <div className={"flex flex-col gap-6"}>
      {shops.map((shop) => (
        <ShopCard key={shop.name} {...shop} />
      ))}
    </div>
  );
}
