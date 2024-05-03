import React, {Suspense} from "react";
import Loader from "@/components/common/Loader";


export default function ShopLayout({children} : Readonly<{children : React.ReactNode}>) {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </div>
  )
}