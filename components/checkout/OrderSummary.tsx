import Image from "next/image";
import { Package, Shield } from "lucide-react";
import { imageUrl } from "@/lib/imageUrl";
import type { CartItem } from "@/hooks/useCart";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  total,
}: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
        <Package className="w-5 h-5 mr-2" />
        Ihre Bestellung
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-amber-200 flex-shrink-0">
              {item.image ? (
                <Image
                  src={imageUrl(item.image).url()}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">
                  🥜
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-amber-900 text-sm line-clamp-1">
                {item.name}
              </h3>
              <p className="text-amber-600 text-xs">{item.size}</p>
              <p className="text-amber-600 text-xs">Menge: {item.quantity}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-amber-900">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-amber-200 pt-4 space-y-2">
        <div className="flex justify-between text-amber-600">
          <span>Zwischensumme:</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>

        <div className="flex justify-between text-amber-600">
          <span>Versandkosten:</span>
          <span>
            {shipping === 0 ? "Kostenlos" : `${shipping.toFixed(2)} €`}
          </span>
        </div>

        <div className="flex justify-between text-lg font-bold text-amber-900 border-t border-amber-200 pt-2">
          <span>Gesamt:</span>
          <span>{total.toFixed(2)} €</span>
        </div>

        <p className="text-xs text-amber-600 text-center">inkl. MwSt.</p>
      </div>

      {/* Trust Signals */}
      <div className="mt-6 p-3 bg-amber-50 rounded-lg">
        <div className="flex items-center justify-center space-x-4 text-xs text-amber-600">
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>SSL-Verschlüsselt</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>Schneller Versand</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
