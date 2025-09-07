"use client";
import React, { useState } from "react";
import { Product } from "@/sanity.types";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Check } from "lucide-react";

interface ProductsViewProps {
  products: Product[];
}

// Extend Product to include sizes safely
interface ProductWithSizes extends Product {
  sizes?: {
    size: string;
    price: number;
    stock?: number;
  }[];
}

const NutProductCard = ({ product }: { product: ProductWithSizes }) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  // Default sizes (if Sanity has no sizes set)
  const defaultSizes = [
    { size: "250 gr", price: 9.99, stock: 10 },
    { size: "500 gr", price: 15.99, stock: 10 },
    { size: "1 kg", price: 20.99, stock: 10 },
  ];

  // Prefer Sanity sizes if available
  const sizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;

  const currentSize = sizes[selectedSizeIndex];
  const isOutOfStock = (currentSize?.stock ?? 1) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    // helper (put at top of the file or a utils file)
    const toCartSlug = (slug: { current?: string } | undefined) => ({
      current: typeof slug?.current === "string" ? slug.current : "",
    });
    addItem({
      id: product._id!,
      name: product.name || "Product",
      price: currentSize.price,
      size: currentSize.size,
      image: product.image,
      slug: toCartSlug(product.slug),
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-amber-800 rounded-xl overflow-hidden text-white shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        {product.image ? (
          <Image
            src={imageUrl(product.image).url()}
            alt={product.name || "Product Image"}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-amber-700 flex items-center justify-center text-6xl">
            🥜
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold mb-4 min-h-[3.5rem] line-clamp-2">
          {product.name || "Product Name"}
        </h3>

        {/* Size Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sizes.map((size, index) => (
            <button
              key={index}
              onClick={() => setSelectedSizeIndex(index)}
              className={`px-3 py-1 rounded-full text-sm border-2 transition-all ${
                selectedSizeIndex === index
                  ? "bg-amber-600 border-amber-600 text-white"
                  : "border-amber-600 text-amber-200 hover:bg-amber-700 hover:text-white"
              }`}
            >
              {size.size}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold">
            {currentSize.price.toFixed(2)} €
          </span>
          <span className="text-sm text-amber-200">inkl. MwSt.</span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold py-3 rounded-lg transition-all mb-2 flex items-center justify-center space-x-2 ${
            isOutOfStock
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : isAdded
                ? "bg-green-600 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              <span>Hinzugefügt!</span>
            </>
          ) : isOutOfStock ? (
            <span>Nicht verfügbar</span>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>In den Warenkorb</span>
            </>
          )}
        </button>

        <p className="text-xs text-amber-200 text-center">
          zzgl. Versandkosten
        </p>
      </div>
    </div>
  );
};

const ProductsView = ({ products }: ProductsViewProps) => {
  return (
    <div className="mx-auto px-4 py-12">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <NutProductCard key={product._id || index} product={product} />
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
