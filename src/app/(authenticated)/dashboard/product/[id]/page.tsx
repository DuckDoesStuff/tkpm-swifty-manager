import ProductInfo from "@/app/(authenticated)/dashboard/product/[id]/ProductInfo";
import {Metadata} from "next";


export const metadata: Metadata = {
  title: "Product Detail",
}

export default function ProductDetail() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black dark:text-white mb-5">Product Detail</h1>
      <ProductInfo/>
    </div>
  )
}