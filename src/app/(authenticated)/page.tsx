import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swifty Merchant",
  description: "Merchant site for Swifty",
};

export default function Home() {
  return (
    <div>
      <ECommerce />
    </div>
  );
}
