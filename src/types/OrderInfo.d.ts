import {ProductInfo} from "@/types/productInfo";
import ShopInfo from "@/types/ShopInfo";
import CustomerInfo from "@/types/CustomerInfo";


export default interface OrderInfo {
  id: string;
  quantity: number;
  product: ProductInfo;
  status: string;
  total: number;
  shop: ShopInfo;
  customer: CustomerInfo;
  createdAt: string;
}