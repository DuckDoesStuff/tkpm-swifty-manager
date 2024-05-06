import NewProductForm from "@/app/(authenticated)/shop/[id]/NewProductForm";

interface ShopPageProps {
  params: {
    id: string;
  }
}

export default function ShopPage({params} : ShopPageProps) {
 

  return (
    <div className="rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark">
      <p>Shop Page for shop ID: {params.id}</p>
      <NewProductForm />
    </div>
  )
}