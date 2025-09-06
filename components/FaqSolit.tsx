"use client";
import React from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

const NestedFAQ = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const faqData = [
    {
      id: 1,
      title: "Fragen zur Edelmetallanlage",
      questions: [
        {
          id: "1-1",
          question: "Warum ist es sinnvoll in Edelmetalle zu investieren?",
          answer:
            "Edelmetalle gelten als wertstabile Anlage, besonders in Zeiten wirtschaftlicher Unsicherheit. Sie bieten Schutz vor Inflation, dienen der Portfoliodiversifikation und haben einen intrinsischen Wert unabhängig von Finanzmärkten.",
        },
        {
          id: "1-2",
          question:
            "Was sind die speziellen Vorteile des SOLIT Edelmetalldepots – gerade auch im Vergleich zum Kauf von Edelmetallen am Bankschalter?",
          answer:
            "Das SOLIT Edelmetalldepot bietet im Vergleich zum Bankschalter günstigere Konditionen, höhere Flexibilität bei der Auswahl der Edelmetalle und professionelle Lagerung. Zudem ermöglicht es einen einfachen Zugang zu einem breiteren Spektrum an Edelmetallen.",
        },
        {
          id: "1-3",
          question:
            "Wie hoch ist der Einkaufsvorteil des SOLIT Edelmetalldepots gegenüber dem direkten Kauf von Edelmetallen bei einer Bank oder einem Edelmetallhändler?",
          answer:
            "Der Einkaufsvorteil liegt typischerweise bei 3-5% gegenüber Banken und 1-3% gegenüber vielen Edelmetallhändlern, abhängig vom aktuellen Markt und der gewählten Edelmetallart.",
        },
      ],
    },
    {
      id: 2,
      title: "Fragen zum SOLIT Edelmetalldepot",
      questions: [
        {
          id: "2-1",
          question:
            "Ist die Aufteilung in Gold, Silber, Platin und Palladium möglich?",
          answer:
            "Ja, beim SOLIT Edelmetalldepot können Sie Ihre Anlage flexibel auf verschiedene Edelmetalle aufteilen. Sie haben die Möglichkeit, in Gold, Silber, Platin und Palladium zu investieren und die Gewichtung individuell anzupassen.",
        },
        {
          id: "2-2",
          question:
            "Kann der Edelmetallkauf auch in monatlichen Raten geleistet werden?",
          answer:
            "Ja, das SOLIT Edelmetalldepot bietet die Möglichkeit, in monatlichen Raten zu investieren. Dies ermöglicht einen flexiblen Vermögensaufbau in Edelmetalle ohne große Einmalbeträge.",
        },
        {
          id: "2-3",
          question:
            "In welchem Zeitraum muss die Zahlung für den Edelmetallkauf geleistet werden?",
          answer:
            "Die Zahlung sollte in der Regel innerhalb von 7 Werktagen nach Auftragserteilung erfolgen. Bei Ratenzahlungen wird ein individueller Zahlungsplan festgelegt.",
        },
        {
          id: "2-4",
          question:
            "Wie kann ich das SOLIT Edelmetalldepot wieder auflösen/kündigen? Wie funktioniert die Auslieferung der Edelmetalle und mit welchen Kosten ist diese verbunden?",
          answer:
            "Die Kündigung erfolgt schriftlich ohne Mindestlaufzeit. Die Auslieferung physischer Edelmetalle ist jederzeit möglich. Dabei fallen Kosten für Verpackung, Versicherung und Versand an, typischerweise zwischen 0,5% und 1% des Materialwerts, mindestens jedoch 50€.",
        },
        {
          id: "2-5",
          question: "Welche Kontrollorgane gibt es beim SOLIT Edelmetalldepot?",
          answer:
            "Das SOLIT Edelmetalldepot unterliegt der Kontrolle durch unabhängige Wirtschaftsprüfer, die Treuhandgesellschaft sowie regelmäßige Inventuren durch externe Prüfer.",
        },
        {
          id: "2-6",
          question:
            "Wer ist die unabhängige Treuhandgesellschaft und welche Leistungen erbringt sie?",
          answer:
            "Die unabhängige Treuhandgesellschaft überwacht die ordnungsgemäße Einlagerung aller Edelmetalle, führt regelmäßige Kontrollen durch und stellt sicher, dass die Eigentumsrechte der Kunden jederzeit gewahrt bleiben.",
        },
        {
          id: "2-7",
          question:
            "Besteht bei dem SOLIT Edelmetalldepot eine Mindesthaltedauer?",
          answer:
            "Nein, beim SOLIT Edelmetalldepot gibt es keine Mindesthaltedauer. Sie können Ihre Edelmetalle jederzeit verkaufen oder sich physisch ausliefern lassen.",
        },
        {
          id: "2-8",
          question:
            "Welche Kosten fallen im Zusammenhang mit meinem SOLIT Edelmetalldepot an?",
          answer:
            "Die Kosten umfassen einmalige Kaufgebühren zwischen 1,5% und 3,5% je nach Edelmetall sowie jährliche Lagergebühren von ca. 0,8% bis 1,2% des Depotwerts. Detaillierte Informationen finden Sie in der aktuellen Preisliste.",
        },
        {
          id: "2-9",
          question:
            "Besteht eine Erlaubnispflicht der Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)?",
          answer:
            "Der Erwerb von physischen Edelmetallen über das SOLIT Edelmetalldepot ist kein erlaubnispflichtiges Geschäft im Sinne des Kreditwesengesetzes (KWG) oder des Wertpapierhandelsgesetzes (WpHG) und unterliegt daher nicht der direkten BaFin-Aufsicht.",
        },
      ],
    },
    {
      id: 3,
      title: "Fragen zur Abwicklung",
      questions: [
        {
          id: "3-1",
          question: "Wie erfolgt die Bestellung und Abwicklung?",
          answer:
            "Die Bestellung erfolgt über ein einfaches Antragsformular online oder in Papierform. Nach Eingang Ihrer Zahlung wird Ihr Investment gemäß Ihren Vorgaben in physische Edelmetalle umgesetzt und eingelagert. Sie erhalten eine Bestätigung und können Ihr Depot jederzeit online einsehen.",
        },
        {
          id: "3-2",
          question: "Welche Zahlungsmöglichkeiten gibt es?",
          answer:
            "Sie können per Banküberweisung, SEPA-Lastschrift oder bei regelmäßigen Investments per Dauerauftrag zahlen. Kreditkartenzahlungen sind derzeit nicht möglich.",
        },
      ],
    },
    {
      id: 4,
      title: "Fragen zum Thema Steuern",
      questions: [
        {
          id: "4-1",
          question: "Wie werden Edelmetalle steuerlich behandelt?",
          answer:
            "Gewinne aus dem Verkauf von physischen Edelmetallen unterliegen nach einer Haltefrist von einem Jahr nicht mehr der Einkommensteuer. Es gilt der persönliche Steuersatz, nicht die Abgeltungssteuer. Gold ist zudem mehrwertsteuerfrei, während bei anderen Edelmetallen Mehrwertsteuer anfallen kann.",
        },
        {
          id: "4-2",
          question:
            "Muss ich meine Edelmetalle im Depot beim Finanzamt angeben?",
          answer:
            "Ja, Edelmetalle sind als Vermögenswerte in Ihrer Steuererklärung anzugeben. Die steuerliche Behandlung richtet sich nach den oben genannten Regeln.",
        },
      ],
    },
    {
      id: 5,
      title: "Fragen zum Thema Lagerung",
      questions: [
        {
          id: "5-1",
          question: "Wo werden meine Edelmetalle gelagert?",
          answer:
            "Ihre Edelmetalle werden in Hochsicherheitstresoren bei führenden Edelmetalllageristen in Deutschland oder der Schweiz gelagert. Die genauen Standorte werden aus Sicherheitsgründen nicht öffentlich kommuniziert.",
        },
        {
          id: "5-2",
          question: "Wie ist mein Eigentum geschützt?",
          answer:
            "Ihr Edelmetallbestand wird als Sondervermögen geführt und ist somit vor einer möglichen Insolvenz des Anbieters geschützt. Zusätzlich sind alle eingelagerten Metalle umfassend versichert und durch die unabhängige Treuhandgesellschaft kontrolliert.",
        },
        {
          id: "5-3",
          question: "Kann ich meine Edelmetalle besichtigen?",
          answer:
            "Ja, nach vorheriger Terminvereinbarung und unter Beachtung der Sicherheitsvorschriften ist eine Besichtigung Ihres Edelmetallbestands möglich. Hierfür fallen gegebenenfalls Gebühren an.",
        },
      ],
    },
  ];

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-100 p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-amber-700">
          FAQ Kategorien
        </h2>
        <div className="space-y-2">
          {faqData.map((section, index) => (
            <button
              key={section.id}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                activeSection === index
                  ? "bg-amber-100 text-amber-800 font-medium border-l-4 border-amber-500"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection(index)}
            >
              <div className="flex items-center">
                <ChevronRight
                  size={18}
                  className={`mr-2 ${activeSection === index ? "text-amber-600" : "text-gray-400"}`}
                />
                <span>{section.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right content area */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-6 max-h-screen overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-amber-800 mb-6">
            {faqData[activeSection].title}
          </h1>

          <div className="space-y-4">
            {faqData[activeSection].questions.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className={`w-full p-4 text-left flex justify-between items-center ${
                    expandedQuestions[item.id] ? "bg-amber-50" : "bg-white"
                  }`}
                  onClick={() => toggleQuestion(item.id)}
                >
                  <span className="font-medium text-gray-800 flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-3 text-sm">
                      Q
                    </span>
                    {item.question}
                  </span>
                  {expandedQuestions[item.id] ? (
                    <ChevronUp
                      size={20}
                      className="text-amber-600 flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={20}
                      className="text-gray-400 flex-shrink-0"
                    />
                  )}
                </button>

                {expandedQuestions[item.id] && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center mr-3 text-sm">
                        A
                      </span>
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NestedFAQ;
