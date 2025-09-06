"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import OrderSummary from "./OrderSummary";
import PaymentMethods from "./PaymentMethods";
import { getStripe } from "@/lib/stripe";

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  deliveryInstructions: string;
  paymentMethod: "stripe" | "paypal" | "sofort" | "sepa";
  agreeToTerms: boolean;
  newsletter: boolean;
}

const CheckoutPage = () => {
  const { state } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Deutschland",
    phone: "",
    deliveryInstructions: "",
    paymentMethod: "stripe",
    agreeToTerms: false,
    newsletter: false,
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = state.total > 50 ? 0 : 4.99;
  const finalTotal = state.total + shippingCost;

  const handleInputChange = (
    field: keyof CheckoutFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "E-Mail ist erforderlich";
      if (!formData.firstName) newErrors.firstName = "Vorname ist erforderlich";
      if (!formData.lastName) newErrors.lastName = "Nachname ist erforderlich";
      if (!formData.address) newErrors.address = "Adresse ist erforderlich";
      if (!formData.city) newErrors.city = "Stadt ist erforderlich";
      if (!formData.postalCode)
        newErrors.postalCode = "Postleitzahl ist erforderlich";

      // Email validation
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Gültige E-Mail-Adresse erforderlich";
      }

      // German postal code validation
      if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = "Gültige deutsche Postleitzahl erforderlich";
      }
    }

    if (step === 2) {
      if (!formData.agreeToTerms)
        newErrors.agreeToTerms = "Sie müssen den AGB zustimmen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    setIsProcessing(true);

    try {
      if (formData.paymentMethod === "stripe") {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: state.items,
            customerInfo: formData,
            cartTotal: state.total,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const { sessionId } = await response.json();

        const stripe = await getStripe();
        if (!stripe) {
          throw new Error("Stripe failed to load");
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Stripe error:", error);
          alert("Payment failed. Please try again.");
        }
      } else {
        // Other payment methods - simulate success for now
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = "/order-success";
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            Ihr Warenkorb ist leer
          </h2>
          <Link
            href="/shop"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Jetzt Einkaufen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/cart"
            className="flex items-center text-amber-600 hover:text-amber-800 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Zurück zum Warenkorb
          </Link>
          <h1 className="text-3xl font-bold text-amber-900">Kasse</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1
                  ? "bg-amber-600 text-white"
                  : "bg-amber-200 text-amber-600"
              }`}
            >
              {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : "1"}
            </div>
            <div
              className={`h-1 w-16 ${currentStep > 1 ? "bg-amber-600" : "bg-amber-200"}`}
            />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2
                  ? "bg-amber-600 text-white"
                  : "bg-amber-200 text-amber-600"
              }`}
            >
              {currentStep > 2 ? <CheckCircle className="w-6 h-6" /> : "2"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
                  <Truck className="w-6 h-6 mr-2" />
                  Lieferadresse
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      E-Mail Adresse *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.email ? "border-red-500" : "border-amber-300"
                      }`}
                      placeholder="ihre.email@beispiel.de"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Vorname *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.firstName ? "border-red-500" : "border-amber-300"
                      }`}
                      placeholder="Max"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.lastName ? "border-red-500" : "border-amber-300"
                      }`}
                      placeholder="Mustermann"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.address ? "border-red-500" : "border-amber-300"
                      }`}
                      placeholder="Musterstraße 123"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Postleitzahl *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-amber-300"
                      }`}
                      placeholder="12345"
                      maxLength={5}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Stadt *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.city ? "border-red-500" : "border-amber-300"
                      }`}
                      placeholder="Musterstadt"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Telefon (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="+49 123 456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Land
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Deutschland">Deutschland</option>
                      <option value="Österreich">Österreich</option>
                      <option value="Schweiz">Schweiz</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-amber-900 mb-1">
                      Lieferhinweise (optional)
                    </label>
                    <textarea
                      value={formData.deliveryInstructions}
                      onChange={(e) =>
                        handleInputChange(
                          "deliveryInstructions",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                      placeholder="Z.B. Paket beim Nachbarn abgeben..."
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    Weiter zur Zahlung
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    Zahlungsmethode
                  </h2>

                  <PaymentMethods
                    selectedMethod={formData.paymentMethod}
                    onMethodChange={(method) =>
                      handleInputChange("paymentMethod", method)
                    }
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Bestätigung
                  </h3>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                          handleInputChange("agreeToTerms", e.target.checked)
                        }
                        className="mt-1 w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-amber-900">
                        Ich stimme den{" "}
                        <Link
                          href="/terms"
                          className="text-amber-600 hover:text-amber-800 underline"
                        >
                          Allgemeinen Geschäftsbedingungen
                        </Link>{" "}
                        und der{" "}
                        <Link
                          href="/privacy"
                          className="text-amber-600 hover:text-amber-800 underline"
                        >
                          Datenschutzerklärung
                        </Link>{" "}
                        zu. *
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-sm">
                        {errors.agreeToTerms}
                      </p>
                    )}

                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.newsletter}
                        onChange={(e) =>
                          handleInputChange("newsletter", e.target.checked)
                        }
                        className="mt-1 w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-amber-900">
                        Ich möchte den Newsletter erhalten und über Angebote und
                        Neuigkeiten informiert werden.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Zurück
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Wird bearbeitet...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Jetzt kaufen - {finalTotal.toFixed(2)} €</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={state.items}
              subtotal={state.total}
              shipping={shippingCost}
              total={finalTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
