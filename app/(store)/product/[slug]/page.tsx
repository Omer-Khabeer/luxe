import React from "react";
import { imageUrl } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { Heart, Share2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddToCartButton from "@/components/AddToCartButton";

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
                  Nicht verfügbar
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share2 size={20} />
              <span>Teilen</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart size={20} />
              <span>Merken</span>
            </button>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-amber-900">
              {product.name}
            </h1>
          </div>

          {isLowStock && (
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nur noch {product.stock} Stück auf Lager
              </AlertDescription>
            </Alert>
          )}

          <div className="prose max-w-none">
            {Array.isArray(product.description) && (
              <PortableText value={product.description} />
            )}
          </div>

          <AddToCartButton
            product={{
              ...product,
              name: product.name ?? "Unnamed Product",
              slug: { current: product.slug?.current ?? "" },
            }}
            isOutOfStock={isOutOfStock}
          />

          {/* Additional Product Information */}
          <div className="space-y-4 pt-6 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-amber-600">Versand</p>
                <p className="font-medium">Kostenloser Versand ab 50€</p>
              </div>
              <div className="space-y-1">
                <p className="text-amber-600">Qualität</p>
                <p className="font-medium">Premium Qualität</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
