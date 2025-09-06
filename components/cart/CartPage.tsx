"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { imageUrl } from "@/lib/imageUrl";

const CartPage = () => {
  const { state, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (
    id: string,
    size: string,
    newQuantity: number
  ) => {
    if (newQuantity === 0) {
      removeItem(id, size);
    } else {
      updateQuantity(id, size, newQuantity);
    }
  };

  const shippingCost = state.total > 50 ? 0 : 4.99;
  const finalTotal = state.total + shippingCost;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link
            href="/shop"
            className="flex items-center text-amber-600 hover:text-amber-800 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Zurück zum Shop
          </Link>
          <h1 className="text-3xl font-bold text-amber-900">
            Warenkorb ({state.itemCount} Artikel)
          </h1>
        </div>

        {state.items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-amber-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              Ihr Warenkorb ist leer
            </h2>
            <p className="text-amber-600 mb-8">
              Entdecken Sie unsere köstlichen Nüsse und Trockenfrüchte
            </p>
            <Link
              href="/shop"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Jetzt Einkaufen
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-amber-900 mb-6">
                  Ihre Artikel
                </h2>

                <div className="space-y-6">
                  {state.items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex items-center space-x-4 pb-6 border-b border-amber-100 last:border-b-0"
                    >
                      <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-amber-200 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={imageUrl(item.image).url()}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🥜
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-900 text-lg mb-1">
                          {item.name}
                        </h3>
                        <p className="text-amber-600 mb-2">
                          Größe: {item.size}
                        </p>
                        <p className="text-amber-800 font-bold text-lg">
                          {item.price.toFixed(2)} € pro Stück
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <Minus className="w-5 h-5 text-amber-600" />
                        </button>

                        <span className="w-12 text-center font-bold text-amber-900 text-lg">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <Plus className="w-5 h-5 text-amber-600" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-amber-900 text-lg">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-red-600 hover:text-red-800 transition-colors mt-1 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Entfernen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-amber-900 mb-6">
                  Bestellübersicht
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-amber-600">Zwischensumme:</span>
                    <span className="font-semibold text-amber-900">
                      {state.total.toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-amber-600">Versandkosten:</span>
                    <span className="font-semibold text-amber-900">
                      {shippingCost === 0
                        ? "Kostenlos"
                        : `${shippingCost.toFixed(2)} €`}
                    </span>
                  </div>

                  {state.total < 50 && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                      Noch {(50 - state.total).toFixed(2)} € für kostenlosen
                      Versand!
                    </p>
                  )}

                  <hr className="border-amber-200" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-amber-900">Gesamt:</span>
                    <span className="text-amber-900">
                      {finalTotal.toFixed(2)} €
                    </span>
                  </div>

                  <p className="text-xs text-amber-600">inkl. MwSt.</p>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center text-lg mb-3"
                >
                  Zur Kasse
                </Link>

                <Link
                  href="/shop"
                  className="block w-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Weiter Einkaufen
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
