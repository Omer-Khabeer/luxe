"use client";
import { CreditCard, Smartphone, Building, Euro, Shield } from "lucide-react";

interface PaymentMethodsProps {
  selectedMethod: "stripe" | "paypal" | "sofort" | "sepa";
  onMethodChange: (method: "stripe" | "paypal" | "sofort" | "sepa") => void;
}

const PaymentMethods = ({
  selectedMethod,
  onMethodChange,
}: PaymentMethodsProps) => {
  const methods = [
    {
      id: "stripe" as const,
      name: "Kreditkarte / Debitkarte",
      description: "Visa, Mastercard, American Express",
      icon: <CreditCard className="w-6 h-6" />,
      popular: true,
    },
    {
      id: "paypal" as const,
      name: "PayPal",
      description: "Bezahlen Sie sicher mit Ihrem PayPal-Konto",
      icon: <Smartphone className="w-6 h-6" />,
      popular: true,
    },
    {
      id: "sofort" as const,
      name: "Sofortüberweisung",
      description: "Direkte Banküberweisung",
      icon: <Building className="w-6 h-6" />,
      popular: false,
    },
    {
      id: "sepa" as const,
      name: "SEPA Lastschrift",
      description: "Abbuchung von Ihrem Bankkonto",
      icon: <Euro className="w-6 h-6" />,
      popular: false,
    },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <div
          key={method.id}
          onClick={() => onMethodChange(method.id)}
          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === method.id
              ? "border-amber-600 bg-amber-50"
              : "border-amber-200 bg-white hover:border-amber-400"
          }`}
        >
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              checked={selectedMethod === method.id}
              onChange={() => onMethodChange(method.id)}
              className="w-4 h-4 text-amber-600 border-amber-300 focus:ring-amber-500"
            />

            <div className="text-amber-600">{method.icon}</div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-amber-900">{method.name}</h3>
                {method.popular && (
                  <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                    Beliebt
                  </span>
                )}
              </div>
              <p className="text-sm text-amber-600">{method.description}</p>
            </div>
          </div>

          {/* Payment Icons */}
          {method.id === "stripe" && (
            <div className="flex items-center space-x-2 mt-3 ml-8">
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                VISA
              </div>
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                MC
              </div>
              <div className="bg-blue-700 text-white text-xs px-2 py-1 rounded">
                AMEX
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="bg-amber-50 p-4 rounded-lg mt-4">
        <div className="flex items-center space-x-2 text-amber-800">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-semibold">Sichere Zahlung</span>
        </div>
        <p className="text-xs text-amber-600 mt-1">
          Ihre Zahlungsdaten werden verschlüsselt übertragen und sicher
          verarbeitet.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;
