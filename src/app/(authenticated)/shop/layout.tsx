import React, {Suspense} from "react";
import Loader from "@/components/common/Loader";
import {Metadata} from "next";

export const metadata: Metadata
  = {
  title: "Viewing shops",
  description: "Shop page for viewing shops",
};
export default function ShopLayout({children} : Readonly<{children : React.ReactNode}>) {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </div>
  )
}