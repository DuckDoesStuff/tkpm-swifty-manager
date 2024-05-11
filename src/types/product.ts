import ProductImage from "@/types/ProductImage";

export type Product = {
  id: number;
  displayName: string;
  stock: number;
  sold: number;
  description: string;
  price: number;
  productImages: ProductImage[];
  createdAt: string;
};
