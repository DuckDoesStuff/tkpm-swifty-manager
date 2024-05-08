import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, {Suspense} from "react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import Loader from "@/components/common/Loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
      <Suspense fallback={<Loader />}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthContextProvider>{children}</AuthContextProvider>
        </div>
      </Suspense>
      </body>
    </html>
  );
}
