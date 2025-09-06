"use client";
import { useState } from "react";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price?: number;
    sizes?: Array<{
      size: string;
      price: number;
      stock: number;
    }>;
    image?: any;
    slug?: { current: string };
    stock?: number;
  };
  isOutOfStock: boolean;
}

const AddToCartButton = ({ product, isOutOfStock }: AddToCartButtonProps) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  // Handle both old structure (single price) and new structure (sizes array)
  const sizes = product.sizes?.length
    ? product.sizes
    : [
        {
          size: "Standard",
          price: product.price || 0,
          stock: product.stock || 0,
        },
      ];

  const currentSize = sizes[selectedSizeIndex];
  const currentIsOutOfStock = isOutOfStock || currentSize.stock <= 0;

  const handleAddToCart = () => {
    if (currentIsOutOfStock) return;

    const cartItem = {
      id: product._id,
      name: product.name,
      price: currentSize.price,
      size: currentSize.size,
      image: product.image,
      slug: product.slug,
    };

    // Add items based on selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (currentSize.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="space-y-4">
      {/* Size Selection - only show if multiple sizes */}
      {sizes.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-amber-900 mb-3">
            Größe auswählen:
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSizeIndex(index);
                  setQuantity(1);
                }}
                className={`px-3 py-2 rounded-lg border-2 font-medium transition-all text-sm ${
                  selectedSizeIndex === index
                    ? "border-amber-600 bg-amber-600 text-white"
                    : "border-amber-300 bg-white text-amber-600 hover:border-amber-500"
                } ${size.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={size.stock <= 0}
              >
                <div>
                  <div>{size.size}</div>
                  <div className="text-xs">{size.price.toFixed(2)} €</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Price Display */}
      <div className="text-3xl font-bold text-amber-900">
        {currentSize.price.toFixed(2)} €
        {quantity > 1 && (
          <span className="text-lg text-amber-600 ml-2">
            (Gesamt: {(currentSize.price * quantity).toFixed(2)} €)
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      {!currentIsOutOfStock && (
        <div>
          <h3 className="text-lg font-semibold text-amber-900 mb-3">Menge:</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-amber-300 rounded-lg bg-white">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
              >
                <Minus className="w-4 h-4 text-amber-600" />
              </button>
              <span className="px-4 py-2 text-amber-900 font-semibold min-w-[50px] text-center border-x border-amber-300">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= (currentSize.stock || 99)}
                className="p-2 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
              >
                <Plus className="w-4 h-4 text-amber-600" />
              </button>
            </div>
            {currentSize.stock && (
              <div className="text-sm text-amber-600">
                {currentSize.stock} verfügbar
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={currentIsOutOfStock}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-semibold rounded-lg transition-all ${
          currentIsOutOfStock
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : isAdded
              ? "bg-green-600 text-white"
              : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        {isAdded ? (
          <>
            <Check size={24} />
            In den Warenkorb hinzugefügt!
          </>
        ) : currentIsOutOfStock ? (
          <>Nicht verfügbar</>
        ) : (
          <>
            <ShoppingCart size={24} />
            In den Warenkorb ({quantity} Stück)
          </>
        )}
      </button>

      {!currentIsOutOfStock && (
        <button className="w-full px-6 py-4 text-lg font-semibold rounded-lg border-2 border-amber-600 text-amber-600 hover:bg-amber-50 transition-colors">
          Jetzt kaufen
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
