'use client'
import {useParams} from "next/navigation";
import Link from "next/link";
import EditShopForm from "@/app/(authenticated)/dashboard/[id]/edit/EditShopForm";

export default function ProductInfo() {
  const params = useParams();


  return (
    <div className={"flex flex-col gap-5"}>
      <h1 className={"text-3xl font-bold text-black dark:text-white"}>Edit Shop Info</h1>
      <Link href={`/dashboard/${params.id}`} className={"text-primary font-bold underline"}>Go back</Link>
      <div
        className="rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark">
        <EditShopForm/>
      </div>
    </div>
  )
}