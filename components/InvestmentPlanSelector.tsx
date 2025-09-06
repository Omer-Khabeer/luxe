"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  Check,
  BarChart2,
  DollarSign,
  Shield,
} from "lucide-react";

const InvestmentPlanSelector = () => {
  const [activePlan, setActivePlan] = useState("gold");

  const plans = [
    {
      id: "gold",
      name: "Goldsparplan",
      color: "#c5ae79",
      description:
        "Wenn Sie sich für einen reinen Goldsparplan entscheiden, wird Ihr gesamter monatlicher Sparbetrag in Gold investiert.",
      benefits: [
        "Erwerb eines Bruchteils eines mehrwertsteuerfreien 1 kg-Goldbarrens",
        "Großbarren sind deutlich kostengünstiger als Kleinbarren",
        "Bis zu 16% mehr Gold für Ihr Geld",
        "Monatliche Investition ohne Mindestbetrag",
      ],
      comparison: {
        solit: "1,94 Gramm Gold",
        direct: "1,73 Gramm Gold",
        difference: "12%",
      },
    },
    {
      id: "silver",
      name: "Silbersparplan",
      color: "#b8b8b8",
      description:
        "Sie möchten Ihre gesamte monatliche Sparrate in Silber investieren? Auch das ist mit dem SOLIT Sparplan kein Problem.",
      benefits: [
        "Erwerb eines Anteils eines 5 kg bzw. 15 kg-Silberbarren",
        "Deutlich kosteneffizienter als Direktkauf von Kleinbarren",
        "Bis zu 33% mehr Silber für Ihr Geld",
        "Inklusive Ersparnis der Mehrwertsteuer durch das intelligente Lagerkonzept",
      ],
      comparison: {
        solit: "149 Gramm Silber",
        direct: "110 Gramm Silber",
        difference: "35%",
      },
    },
    {
      id: "mixed",
      name: "Gemischter Sparplan",
      color: "#a79a87",
      description:
        "Natürlich ist auch die Aufteilung Ihrer Sparplanrate auf die Edelmetalle Gold und Silber möglich. Hierbei entscheiden Sie selbst und ganz individuell, welcher Anteil auf welches der beiden Edelmetalle entfallen soll.",
      benefits: [
        "Individuell anpassbare Verteilung auf verschiedene Edelmetalle",
        "Risikominimierung durch breite Streuung",
        "Flexibilität bei der Gewichtung Ihrer Anteile",
        "Alle Kostenvorteile der Einzelpläne bleiben bestehen",
      ],
      comparison: {
        solit: "1,94g Gold und 149g Silber",
        direct: "1,73g Gold und 110g Silber",
        difference: "12-35%",
      },
    },
  ];

  const activeMetalData = plans.find((plan) => plan.id === activePlan);

  return (
    <div className="w-full bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sie haben die Wahl
          </h2>
          <p className="text-xl text-gray-300">
            Goldsparplan, Silbersparplan oder gemischter Edelmetallsparplan?
          </p>
        </div>

        {/* Metal Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setActivePlan(plan.id)}
              className={`px-6 py-3 rounded-lg transition duration-300 ${
                activePlan === plan.id
                  ? "bg-gray-800 text-white font-medium shadow-md"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              style={{
                borderTop:
                  activePlan === plan.id ? `3px solid ${plan.color}` : "",
              }}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column - Plan Details */}
          <div
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            style={{ borderTop: `4px solid ${activeMetalData.color}` }}
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gray-700">
                  <BarChart2
                    style={{ color: activeMetalData.color }}
                    size={24}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  SOLIT {activeMetalData.name}
                </h3>
              </div>

              <p className="text-gray-300 mb-8">
                {activeMetalData.description}
              </p>

              <div className="space-y-4 mb-8">
                {activeMetalData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 p-1 rounded-full bg-gray-700">
                      <Check
                        style={{ color: activeMetalData.color }}
                        size={14}
                      />
                    </div>
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>

              <div
                className="p-4 rounded-lg bg-gray-700 mb-8 border-l-4"
                style={{ borderLeftColor: activeMetalData.color }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-gray-300">
                    <span className="block font-medium">Rendite-Vorteil</span>
                    <span className="text-sm">Im Vergleich zum Direktkauf</span>
                  </div>
                  <div
                    className="text-4xl font-bold"
                    style={{ color: activeMetalData.color }}
                  >
                    +{activeMetalData.comparison.difference}
                  </div>
                </div>
              </div>

              <button
                className="w-full py-4 px-6 transition font-medium flex items-center justify-center gap-2 rounded-lg text-gray-900"
                style={{ backgroundColor: activeMetalData.color }}
              >
                <span>JETZT UNVERBINDLICH ANFRAGEN</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column - Comparison */}
          <div
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            style={{ borderTop: `4px solid ${activeMetalData.color}` }}
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gray-700">
                  <DollarSign
                    style={{ color: activeMetalData.color }}
                    size={24}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Renditevorteil durch Cost-Average Effekt
                </h3>
              </div>

              <div className="mb-8">
                <div className="relative pt-8 pb-12">
                  {/* SOLIT Bar */}
                  <div className="flex items-center mb-12">
                    <div className="w-1/3 text-right pr-4">
                      <span className="text-sm text-gray-400">
                        SOLIT-Sparplan
                      </span>
                      <div className="text-xl font-medium text-white">
                        {activeMetalData.comparison.solit}
                      </div>
                    </div>
                    <div className="w-2/3">
                      <div
                        className="h-16 rounded-r-lg"
                        style={{ backgroundColor: activeMetalData.color }}
                      ></div>
                    </div>
                  </div>

                  {/* Direct Purchase Bar */}
                  <div className="flex items-center">
                    <div className="w-1/3 text-right pr-4">
                      <span className="text-sm text-gray-400">
                        Direkterwerb
                      </span>
                      <div className="text-xl font-medium text-white">
                        {activeMetalData.comparison.direct}
                      </div>
                    </div>
                    <div className="w-2/3">
                      <div className="h-16 rounded-r-lg bg-gray-600"></div>
                    </div>
                  </div>

                  {/* Percentage Label */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div
                      className="text-4xl font-bold"
                      style={{ color: activeMetalData.color }}
                    >
                      {activeMetalData.comparison.difference} mehr
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-2">
                  Quelle: Eigene Berechnung anhand von Verkaufspreisen bekannter
                  Edelmetallhändler im Internet - Stand: Februar 2022
                </p>
              </div>

              <div
                className="bg-gray-700 p-6 rounded-lg mb-8 border-l-4"
                style={{ borderLeftColor: activeMetalData.color }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-1 p-1 rounded-full bg-gray-600">
                    <Shield
                      size={14}
                      style={{ color: activeMetalData.color }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Sicherheit & Flexibilität
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Ihre Edelmetalle werden in Hochsicherheitstresoren in
                      Deutschland oder der Schweiz gelagert. Sie haben jederzeit
                      die Möglichkeit zur physischen Auslieferung.
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-4 px-6 transition font-medium flex items-center justify-center gap-2 rounded-lg text-gray-900"
                style={{ backgroundColor: activeMetalData.color }}
              >
                <span>JETZT UNVERBINDLICH ANFRAGEN</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlanSelector;
