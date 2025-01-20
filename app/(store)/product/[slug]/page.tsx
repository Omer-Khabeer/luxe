import React from "react";
import { imageUrl } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { Heart, Share2, ShoppingCart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock !== null && (product.stock ?? 0) <= 0;
  const isLowStock =
    product.stock !== null &&
    (product.stock ?? 0) <= 5 &&
    (product.stock ?? 0) > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image Section */}
        <div className="space-y-6">
          <div
            className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ${isOutOfStock ? "opacity-50" : ""}`}
          >
            {product.image && (
              <Image
                src={imageUrl(product.image).url()}
                alt={product.name ?? "Product Image"}
                fill
                className="object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <span className="text-white font-bold text-xl px-6 py-3 bg-red-500 rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share2 size={20} />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart size={20} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="text-2xl font-semibold text-gray-900">
              ${product.price?.toFixed(2)}
            </div>
          </div>

          {isLowStock && (
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Only {product.stock} units left in stock
              </AlertDescription>
            </Alert>
          )}

          <div className="prose max-w-none">
            {Array.isArray(product.description) && (
              <PortableText value={product.description} />
            )}
          </div>

          <div className="space-y-4 pt-6 border-t">
            <button
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold rounded-full transition-colors from-purple-600 to-purple-800
                ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-br from-purple-600 to-purple-800 text-white hover:bg-purple-700"
                }`}
            >
              <ShoppingCart size={24} />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            {!isOutOfStock && (
              <button className="w-full px-6 py-4 text-lg font-semibold rounded-full border-2 border-purple-600 text-purple-600 hover:bg-blue-50 transition-colors">
                Buy Now
              </button>
            )}
          </div>

          {/* Additional Product Information */}
          <div className="space-y-4 pt-6 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                {/* <p className="text-gray-500">SKU</p>
                <p className="font-medium">{product.sku || "N/A"}</p> */}
              </div>
              <div className="space-y-1">
                {/* <p className="text-gray-500">Category</p> */}
                {/* <p className="font-medium">{product.category || "N/A"}</p> */}
              </div>
              <div className="space-y-1">
                {/* <p className="text-gray-500">Stock</p> */}
                {/* <p className="font-medium">{product.stock || "N/A"}</p> */}
              </div>
              <div className="space-y-1">
                {/* <p className="text-gray-500">Shipping</p>
                <p className="font-medium">Free Shipping</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
