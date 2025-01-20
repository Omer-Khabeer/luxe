"use client";
import React, { useState } from "react";
import { Product } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Link from "next/link";
import { QrCode } from "lucide-react";

interface ProductsViewProps {
  products: Product[];
}

const NFCCard = ({ product }: { product: Product }) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
        {/* Card Image Container with Perspective */}
        <div
          className="relative mb-6 w-64 h-40 [perspective:1000px]"
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          {/* Inner container that flips */}
          <div
            className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full [backface-visibility:hidden]">
              {product.image && (
                <Image
                  src={imageUrl(product.image).url()}
                  alt={product.name || "Product Image Front"}
                  fill
                  className="object-cover rounded-br-[2.5rem] rounded-tl-[2.5rem] rounded-tr-[5px] rounded-bl-[5px]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-br-[2.5rem] rounded-tl-[2.5rem] rounded-tr-[5px] rounded-bl-[5px] flex flex-col items-center justify-between p-4">
                {/* QR Code Section */}

                <Image
                  src="/qrcode.jpg"
                  alt="QR Code"
                  fill
                  className="object-cover rounded-br-[2.5rem] rounded-tl-[2.5rem] rounded-tr-[5px] rounded-bl-[5px]"
                />

                {/* Bottom Text */}
                <div className="text-white/80 text-xs text-center">
                  Scan to connect
                </div>
              </div>
            </div>
          </div>
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
