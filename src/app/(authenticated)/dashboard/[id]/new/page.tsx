import NewProductForm from "@/app/(authenticated)/dashboard/[id]/new/NewProductForm";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "New Product",
  description: "Create a new product",
}
export default function NewProductPage() {
  return (
    <div>
      <NewProductForm/>
    </div>
  )
}