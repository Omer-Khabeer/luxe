"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";

interface OrderDetails {
  sessionId: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
}

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError("Keine Sitzungs-ID gefunden");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/order-details?session_id=${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Bestelldetails");
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Fehler beim Laden der Bestelldetails");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-900">Lade Bestelldetails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link
            href="/shop"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Zurück zum Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            Vielen Dank für Ihre Bestellung!
          </h1>

          <p className="text-gray-600 mb-8">
            Ihre Zahlung wurde erfolgreich verarbeitet. Sie erhalten in Kürze
            eine Bestätigungs-E-Mail.
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-amber-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-amber-900 mb-4">
                Bestelldetails
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bestellnummer:</span>
                  <span className="font-medium text-gray-900">
                    {orderDetails.sessionId.slice(-12).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">E-Mail:</span>
                  <span className="font-medium text-gray-900">
                    {orderDetails.customerEmail}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Gesamtbetrag:</span>
                  <span className="font-bold text-amber-900">
                    {(orderDetails.totalAmount / 100).toFixed(2)}{" "}
                    {orderDetails.currency.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">
                    {orderDetails.paymentStatus === "paid"
                      ? "Bezahlt"
                      : "Ausstehend"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">
                Bestätigung per E-Mail
              </h3>
              <p className="text-sm text-blue-700">
                Eine detaillierte Bestellbestätigung wurde an Ihre
                E-Mail-Adresse gesendet.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 mb-1">Versand</h3>
              <p className="text-sm text-green-700">
                Ihre Bestellung wird innerhalb von 1-2 Werktagen versendet.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Weiter einkaufen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Meine Bestellungen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
