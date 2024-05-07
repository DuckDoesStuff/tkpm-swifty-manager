import NewProductForm from "@/app/(authenticated)/shop/[id]/NewProductForm";
import ShopInfo from "@/app/(authenticated)/shop/[id]/ShopInfo";


export default function ShopPage() {
 

  return (
    <div
      className="flex flex-col gap-5 rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark">
      <ShopInfo/>
      <NewProductForm />
    </div>
  )
}