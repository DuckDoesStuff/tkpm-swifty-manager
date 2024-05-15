import ProductImage from "@/types/ProductImage";
import ShopInfo from "@/types/ShopInfo";

export type ProductInfo = {
  id: string;
  displayName: string;
  stock: number;
  sold: number;
  description: string;
  price: number;
  shop: ShopInfo;
  productImages: ProductImage[];
  createdAt: string;
};
