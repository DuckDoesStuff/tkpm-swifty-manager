import ShopInfo from "@/app/(authenticated)/dashboard/[id]/ShopInfo";
import ProductList from "@/app/(authenticated)/dashboard/[id]/ProductList";
import {Metadata} from "next";
import OrderList from "@/app/(authenticated)/dashboard/[id]/OrderList";


export const metadata: Metadata = {
  title: "Shop dashboard",
}

export default function ShopPage() {
 

  return (
    <div
      className="flex flex-col gap-5 pb-40">
      <ShopInfo/>
      <ProductList/>
      <OrderList/>
    </div>
  )
}