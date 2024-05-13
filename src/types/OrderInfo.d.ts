import {ProductInfo} from "@/types/productInfo";
import ShopInfo from "@/types/ShopInfo";


export default interface OrderInfo {
  id: string;
  quantity: number;
  product: ProductInfo;
  total: number;
  shop: ShopInfo;
}