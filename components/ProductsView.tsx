"use client";
import React from "react";
import { Product } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Link from "next/link";

interface ProductsViewProps {
  products: Product[];
}

const NFCCard = ({ product }: { product: Product }) => {
  const renderDescription = (description: any) => {
    if (typeof description === "string") return description;
    if (Array.isArray(description)) {
      return description.map((block, index) => {
        if (block._type === "block") {
          return block.children?.map((child: any, childIndex: number) => (
            <span key={`${index}-${childIndex}`}>{child.text}</span>
          ));
        }
        return null;
      });
    }
    return "";
  };

  return (
    <Link href={`/product/${product.slug?.current}`} className="block h-full">
      <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center h-full group hover:shadow-xl transition-all duration-300">
        <div className="w-64 h-40 relative rounded-2xl mb-6 overflow-hidden">
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name || "Product Image"}
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <div className="mb-4">
          <div className="text-2xl font-bold">${product.price}</div>
          <div className="text-gray-500 text-sm">+ shipping</div>
        </div>
        <div className="text-gray-600 text-center mb-6 flex-grow">
          {renderDescription(product.description)}
        </div>

        <Button
          variant="outline"
          className="text-purple-600 border-2 border-purple-600 rounded-full px-6 py-2 hover:bg-purple-700 hover:text-white transition-colors mt-auto"
        >
          Customize your card
        </Button>
      </div>
    </Link>
  );
};

const ProductsView = ({ products }: ProductsViewProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <NFCCard key={product._id || index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
