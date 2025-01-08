import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
<<<<<<< HEAD
=======
import { imageUrl } from "@/lib/imageUrl";
>>>>>>> stable-x

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;
  const isOnSale =
    product.salePrice != null && product.salePrice < (product.price ?? 0);
  const discount = isOnSale
    ? Math.round(
        (((product.price ?? 0) - product.salePrice!) / (product.price ?? 1)) *
          100
      )
    : 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {product.image && (
          <Image
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            src={imageUrl(product.image).url()}
            alt={product.name || "Product Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
          {!isOutOfStock && (
            <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
              <ShoppingBag className="w-4 h-4 text-gray-700" />
            </button>
          )}
        </div>

        {/* Sale Tag */}
        {isOnSale && (
          <div className="absolute top-3 left-3">
            <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              {discount}% OFF
            </div>
          </div>
        )}

        {/* Stock Status */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-medium text-gray-900 group-hover:text-gray-700 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
<<<<<<< HEAD
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
=======
          <div className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description.map((block, i) => (
              <p key={i}>
                {"children" in block &&
                  block.children?.map((child) => child.text).join(" ")}
              </p>
            ))}
          </div>
>>>>>>> stable-x
        )}

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {isOnSale && (
            <span className="text-red-600 font-medium">
              ${product.salePrice?.toFixed(2)}
            </span>
          )}
          <span
            className={
              isOnSale
                ? "text-sm text-gray-400 line-through"
                : "text-gray-900 font-medium"
            }
          >
            ${product.price?.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductThumb;
