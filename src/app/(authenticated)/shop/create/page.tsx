import CreateShopForm from "@/app/(authenticated)/shop/create/CreateShopForm";
import { Metadata } from "next";
import {Suspense} from "react";
import Loader from "@/components/common/Loader";

export const metadata: Metadata = {
  title: "Create Shop",
};

export default function CreateShop() {
  return (
    <div className="rounded-md border border-stroke bg-white p-5 drop-shadow-lg dark:border-strokedark dark:bg-boxdark">
      <Suspense fallback={<Loader />}>
        <CreateShopForm />
      </Suspense>
    </div>
  );
}
