"use client";
import Link from "next/link";
import { Truck, Star, CheckCircle } from "lucide-react";

const ServiceFeatures = () => {
  return (
    <section className="bg-amber-900">
      <div className="border-t border-amber-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold light text-white">
                  Schnelle Lieferung
                </h3>
                <p className="text-amber-200 text-sm">
                  Erhalte deine Bestellung schnell und zuverlässig an deine
                  Haustür geliefert.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white">Hohe Qualität</h4>
                <p className="text-amber-200 text-sm">
                  Wir bieten nur Produkte von höchster Qualität, um deine
                  Zufriedenheit zu gewährleisten.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white">Zufriedenheitsgarantie</h4>
                <p className="text-amber-200 text-sm">
                  Unsere Produkte kommen mit einer 100% Zufriedenheits-garantie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;
