import Link from "next/link";
import Image from "next/image";

const NutsSection = () => {
  return (
    <section className="py-20 bg-amber-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="w-full h-96 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg overflow-hidden">
              {/* Placeholder for nuts in jar image */}
              <div className="w-full h-full flex items-center justify-center text-6xl">
                <Image
                  src="/issnuss-hero.jpg"
                  alt="shop-hero"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-amber-200 text-sm uppercase mb-4">
              Die Kunst des Nussvergnügens!
            </p>
            <h2 className="text-4xl font-bold text-white mb-6">
              Knackige Nüsse
            </h2>
            <p className="text-amber-100 text-lg leading-relaxed mb-8">
              Tauche ein in eine Welt der Geschmacksexplosionen mit unseren
              handverlesenen Nüssen. Von knusprigen Walnüssen bis hin zu
              cremigen Cashews – entdecke die verlockende Vielfalt, die deine
              Sinne verzaubert. Unsere Nüsse sind mehr als nur Snacks; sie sind
              eine Reise zu den köstlichsten Aromen der Natur. Frisch geröstet,
              sorgfältig ausgewählt und bereit, deinen Gaumen zu verwöhnen. Gönn
              dir den puren Genuss und erlebe Nüsse auf eine ganz neue,
              unwiderstehliche Art!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Jetzt Kaufen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutsSection;
