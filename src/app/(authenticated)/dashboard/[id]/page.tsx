import NewProductForm from "@/app/(authenticated)/dashboard/[id]/NewProductForm";
import ShopInfo from "@/app/(authenticated)/dashboard/[id]/ShopInfo";
import ProductList from "@/app/(authenticated)/dashboard/[id]/ProductList";


export default function ShopPage() {
 

  return (
    <div
      className="flex flex-col gap-5">
      <ShopInfo/>
      <ProductList/>
      <NewProductForm />
    </div>
  )
}