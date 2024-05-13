import {Metadata} from "next";
import OrderInfo from "@/app/(authenticated)/dashboard/order/[id]/OrderInfo";


export const metadata: Metadata = {
  title: "Order detail",
}

export default function OrderPage() {
  return (
    <div>
      <OrderInfo/>
    </div>
  )
}