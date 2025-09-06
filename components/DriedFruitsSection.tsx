import Link from "next/link";
import Image from "next/image";

const DriedFruitsSection = () => {
  return (
    <section className="py-20 bg-amber-900">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-200 text-sm uppercase mb-4">
              Knusprige Trockenfrüchte, die Herzen erobern
            </p>
            <h2 className="text-4xl font-bold text-white mb-6">
              Trockenfrüchte
            </h2>
            <p className="text-amber-100 text-lg leading-relaxed mb-8">
              Erleben Sie den unwiderstehlichen Charme unserer handverlesenen
              Trockenfrüchte, die nicht nur köstlich sind, sondern auch Ihre
              Sinne verzaubern. Jede Frucht wurde sorgfältig getrocknet, um ihre
              natürliche Süße und Knusprigkeit zu bewahren. Von Mangos bis zu
              delikaten Weintrauben – unsere Trockenfrüchte sind ein Fest für
              Ihre Geschmacksknospen. Entdecken Sie eine Welt voller Aromen,
              verpackt in jeder kleinen Köstlichkeit. Die perfekte Balance aus
              Genuss und Gesundheit erwartet Sie in jeder Packung. Tauchen Sie
              ein und lassen Sie sich von der fruchtigen Magie überraschen.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Jetzt Kaufen
            </Link>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg overflow-hidden">
              {/* Placeholder for dried fruits image */}
              <div className="w-full h-full flex items-center justify-center text-6xl">
                <Image
                  src="/trocknetefruechte.jpg"
                  alt="shop-hero"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriedFruitsSection;
