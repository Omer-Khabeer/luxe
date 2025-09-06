"use client";
import Image from "next/image";
import { useState } from "react";
import { imageUrl } from "@/lib/imageUrl";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: { current: string };
    image: any;
    sizes: Array<{
      size: string;
      price: number;
      stock: number;
    }>;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const sizes = product.sizes || []; // should always exist because of Sanity validation
  const currentSize = sizes[selectedSizeIndex];
  const isOutOfStock = (currentSize?.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !currentSize) return;

    addItem({
      id: product._id,
      name: product.name,
      price: currentSize.price,
      size: currentSize.size,
      image: product.image,
      slug: product.slug,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-amber-800 rounded-xl overflow-hidden text-white shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-64">
        {product.image ? (
          <Image
            src={imageUrl(product.image).url()}
            alt={product.name}
            fill
            className="object-cover"
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
          {product.name}
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
        {currentSize && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold">
              {currentSize.price.toFixed(2)} €
            </span>
            <span className="text-sm text-amber-200">inkl. MwSt.</span>
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 mb-2 flex items-center justify-center space-x-2 ${
            isOutOfStock
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : isAdded
                ? "bg-green-600 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl"
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

export default ProductCard;
