import { Product } from "@/sanity.types";
import Link from "next/link";

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;
//   const isOnSale = product.salePrice != null && product.salePrice < product.price;
  return (
  <Link href={`/product/${product.slug.current}`
    className={`group flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ease-in-out` ${isOutOfStock ? "opacity-50" : ""}}
  }

  Product
  </Link> 
)
}

export default ProductThumb;
