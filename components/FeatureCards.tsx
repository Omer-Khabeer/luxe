import { Trophy, Leaf, Heart } from "lucide-react";
import Link from "next/link";
const FeatureCards = () => {
  const features = [
    {
      icon: <Trophy className="w-12 h-12 text-amber-500" />,
      title: "Gourmet-Qualität",
      description:
        "Unsere Nüsse werden sorgfältig ausgewählt und bieten Gourmet-Qualität für anspruchsvolle Gaumen.",
    },
    {
      icon: <Leaf className="w-12 h-12 text-amber-500" />,
      title: "Frische Garantie",
      description:
        "Jede Nuss ist frisch geröstet und behält ihren vollen Geschmack sowie ihre knusprige Konsistenz.",
    },
    {
      icon: <Heart className="w-12 h-12 text-amber-500" />,
      title: "Gesunde Snackoption",
      description:
        "Nüsse sind reich an Nährstoffen, Proteinen und gesunden Fetten, was sie zu einer idealen, nahrhaften Snackoption macht.",
    },
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-amber-900 mb-4">
          Nussgenuss in Perfektion
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-amber-800 text-white rounded-xl p-8 text-center"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-amber-100 leading-relaxed">
                {feature.description}
              </p>
              {/* <Link href="/shop">
                <button className="mt-6 border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white px-6 py-2 rounded-lg transition-colors">
                  Mehr Erfahren
                </button>
              </Link> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
