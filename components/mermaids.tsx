"use client";
import React, { useState } from "react";

const AccessibleMermaidsWebsite = () => {
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accessible color palette
  const colors = {
    primary: "#00776B", // Dark teal for main brand identity
    secondary: "#B71C1C", // Dark red for secondary elements
    link: "#0056b3", // Accessible blue for links
    text: "#333333", // Dark gray for body text
    lightText: "#FFFFFF", // White text (on dark backgrounds)
    accent: "#E65100", // Orange for CTA and important elements
    background: "#F5F5F5", // Light gray background
    lightBackground: "#FFFFFF", // White background
    border: "#DDDDDD", // Light gray for borders
  };

  // Navigation items
  const navItems = [
    { name: "MERMAIDS OF NORWAY", href: "#", hasDropdown: true },
    { name: "OMEGA-3", href: "#", hasDropdown: true },
    { name: "ONLINE-SHOP", href: "#", hasDropdown: false },
    { name: "SERVICE", href: "#", hasDropdown: true },
    { name: "KONTAKT", href: "#", hasDropdown: false },
    { name: "ÜBER UNS", href: "#", hasDropdown: false },
  ];

  // Skip to content link (accessibility feature)
  const SkipToContent = () => (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-4 focus:bg-white focus:z-50 focus:text-black"
      style={{ color: colors.link }}
    >
      Skip to main content
    </a>
  );

  // Accessible navigation component
  const Navigation = () => (
    <nav
      aria-label="Main Navigation"
      style={{ backgroundColor: colors.secondary }}
      className="relative"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="#"
              className="flex items-center"
              aria-label="Mermaids of Norway Home"
            >
              <img
                src="/api/placeholder/120/40"
                alt="Mermaids of Norway Logo"
                className="h-10"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex space-x-6" role="menubar">
              {navItems.map((item, index) => (
                <li key={index} role="none">
                  <a
                    href={item.href}
                    className="block px-2 py-1 text-base font-medium hover:underline focus:underline focus:outline-none"
                    style={{ color: colors.lightText }}
                    role="menuitem"
                    aria-expanded={item.hasDropdown ? "false" : undefined}
                    aria-haspopup={item.hasDropdown ? "true" : undefined}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <span className="ml-1" aria-hidden="true">
                        ▼
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              style={{ color: colors.lightText }}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
        id="mobile-menu"
        role="menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium"
              style={{ color: colors.lightText }}
              role="menuitem"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );

  // Hero section
  const HeroSection = () => (
    <section
      className="py-12 px-4"
      style={{ backgroundColor: colors.lightBackground }}
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h1
            id="hero-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            Norwegisches Omega-3
          </h1>
          <p className="text-lg mb-6" style={{ color: colors.text }}>
            Mermaids of Norway ist ein naturreines Fischöl. Es wird in einer
            kleinen Manufaktur in Nordnorwegen ohne chemische Behandlung und
            Zusätze hergestellt.
          </p>
          <div>
            <a
              href="#more-info"
              className="inline-block font-medium text-lg hover:underline focus:underline focus:outline-none"
              style={{ color: colors.link, textDecoration: "underline" }}
              aria-label="Mehr Informationen über Mermaids of Norway"
            >
              » mehr Informationen
            </a>
          </div>
        </div>
        <div className="md:w-1/2 text-center">
          <img
            src="/api/placeholder/400/500"
            alt="Mermaids of Norway Omega-3 Fischöl Flasche"
            className="inline-block"
            width="400"
            height="500"
          />
          <div className="mt-4">
            <a
              href="#order"
              className="inline-block px-6 py-3 rounded-lg font-bold text-lg"
              style={{
                backgroundColor: colors.accent,
                color: colors.lightText,
              }}
              aria-label="Jetzt Mermaids of Norway Omega-3 bestellen"
            >
              JETZT BESTELLEN
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  // Application section
  const ApplicationSection = () => (
    <section
      className="py-12 px-4"
      style={{ backgroundColor: colors.background }}
      aria-labelledby="application-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          id="application-heading"
          className="text-2xl md:text-3xl font-bold mb-8 text-center"
          style={{ color: colors.primary }}
        >
          Anwendung
        </h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <img
              src="/api/placeholder/400/300"
              alt="Illustration der Anwendung von Omega-3 Öl"
              className="inline-block rounded-lg"
              width="400"
              height="300"
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-lg mb-6" style={{ color: colors.text }}>
              Nur ein Teelöffel Mermaids of Norway schützt das Herz, fördert die
              Sehkraft und ist Brainfood für das Gehirn. Analysenzertifikate
              belegen die Qualität und die Reinheit von Mermaids of Norway.
            </p>
            <div>
              <a
                href="#more-application"
                className="inline-block font-medium text-lg hover:underline focus:underline focus:outline-none"
                style={{ color: colors.link, textDecoration: "underline" }}
                aria-label="Mehr über die Anwendung von Mermaids of Norway erfahren"
              >
                » mehr über die Anwendung
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Premium quality section
  const PremiumQualitySection = () => (
    <section
      className="py-12 px-4"
      style={{ backgroundColor: colors.lightBackground }}
      aria-labelledby="quality-heading"
      id="main-content"
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          id="quality-heading"
          className="text-2xl md:text-3xl font-bold mb-8 text-center"
          style={{ color: colors.primary }}
        >
          Norwegisches Fischöl - Premium Qualität
        </h2>
        <div className="mb-8">
          <p
            className="text-lg mb-6 text-center"
            style={{ color: colors.text }}
          >
            Mermaids of Norway ist ein naturreines Fischöl. Es wird in Norwegen
            aus dem arktischen Kabeljau gewonnen. Die Herstellung erfolgt ohne
            chemische Behandlung und Zusätze. Mermaids of Norway Fischöl hat
            einen hohen Gehalt an Omega-3-Fettsäuren. Was unterscheidet Mermaids
            of Norway von anderen Fischölen?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Quality point 1 */}
          <div
            className="p-6 rounded-lg border"
            style={{ borderColor: colors.border }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              <span aria-hidden="true">💧</span> Die Qualität und Frische des
              Fisches
            </h3>
            <p style={{ color: colors.text }}>
              Wir verwenden nur frisch gefangenen arktischen Kabeljau höchster
              Qualität für unser Fischöl.
            </p>
          </div>

          {/* Quality point 2 */}
          <div
            className="p-6 rounded-lg border"
            style={{ borderColor: colors.border }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              <span aria-hidden="true">💧</span> Das Herstellungsverfahren und
              die Rückstandskontrollen
            </h3>
            <p style={{ color: colors.text }}>
              Unser Herstellungsprozess erfolgt ohne chemische Zusätze und wird
              regelmäßig strengen Kontrollen unterzogen.
            </p>
          </div>

          {/* Quality point 3 */}
          <div
            className="p-6 rounded-lg border"
            style={{ borderColor: colors.border }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              <span aria-hidden="true">💧</span> Ein niedriger Totox-Wert
              (Oxidationsgrad) von 5 und
            </h3>
            <p style={{ color: colors.text }}>
              Der niedrige Oxidationsgrad von 5 garantiert die Frische und
              Wirksamkeit unseres Omega-3 Öls.
            </p>
          </div>

          {/* Quality point 4 */}
          <div
            className="p-6 rounded-lg border"
            style={{ borderColor: colors.border }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              <span aria-hidden="true">💧</span> Hoher Gehalt an Omega-3
              Fettsäuren
            </h3>
            <p style={{ color: colors.text }}>
              Unser Fischöl enthält einen bis zu 10× höheren Gehalt an
              Omega-3-Fettsäuren als andere Omega-3-Produkte.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg" style={{ color: colors.text }}>
            garantieren die Premium Qualität des Fischöls Mermaid of Norway.
          </p>
        </div>
      </div>
    </section>
  );

  // Visual information section
  const VisualInfoSection = () => (
    <section
      className="py-12 px-4"
      style={{ backgroundColor: colors.background }}
      aria-label="Visuelle Informationen"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Image 1 */}
          <div className="text-center">
            <img
              src="/api/placeholder/250/250"
              alt="Norwegische Hafengebäude"
              className="inline-block rounded-full mb-4"
              width="250"
              height="250"
            />
            <p className="text-lg" style={{ color: colors.text }}>
              Traditionelle Herstellung in Nordnorwegen
            </p>
          </div>

          {/* Image 2 */}
          <div className="text-center">
            <div
              className="inline-block rounded-full mb-4 p-8"
              style={{
                backgroundColor: colors.primary,
                width: 250,
                height: 250,
              }}
            >
              <p className="text-center" style={{ color: colors.lightText }}>
                Mermaids of Norway Fischöl hat einen bis zu 10× höheren Gehalt
                an Omega-3-Fettsäuren als andere Omega-3-Produkte.
              </p>
            </div>
          </div>

          {/* Image 3 */}
          <div className="text-center">
            <img
              src="/api/placeholder/250/250"
              alt="Fischerboot vor norwegischem Fjord"
              className="inline-block rounded-full mb-4"
              width="250"
              height="250"
            />
            <p className="text-lg" style={{ color: colors.text }}>
              Nachhaltige Fischerei im arktischen Meer
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Footer
  const Footer = () => (
    <footer style={{ backgroundColor: colors.secondary }} className="py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: colors.lightText }}
            >
              Über uns
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Unsere Geschichte
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Qualitätsversprechen
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Nachhaltigkeit
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: colors.lightText }}
            >
              Produkte
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Omega-3 Fischöl
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Kapseln
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Geschenksets
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: colors.lightText }}
            >
              Kundenservice
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Kontakt
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Versand & Lieferung
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: colors.lightText }}
            >
              Rechtliches
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  Datenschutz
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:underline focus:outline-none"
                  style={{ color: colors.lightText }}
                >
                  AGB
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-600 text-center">
          <p style={{ color: colors.lightText }}>
            © {new Date().getFullYear()} Mermaids of Norway. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );

  // Accessibility toolbar
  const AccessibilityToolbar = () => {
    const [fontSize, setFontSize] = useState(100);

    const increaseFontSize = () =>
      setFontSize((prev) => Math.min(prev + 10, 150));
    const decreaseFontSize = () =>
      setFontSize((prev) => Math.max(prev - 10, 90));
    const resetFontSize = () => setFontSize(100);

    return (
      <div
        className="fixed right-4 top-20 bg-white p-3 rounded-lg shadow-lg z-50 border"
        style={{ borderColor: colors.border }}
        role="region"
        aria-label="Accessibility controls"
      >
        <div className="flex flex-col space-y-2">
          <button
            onClick={increaseFontSize}
            className="p-2 rounded"
            style={{ backgroundColor: colors.primary, color: colors.lightText }}
            aria-label="Increase font size"
          >
            A+
          </button>
          <button
            onClick={resetFontSize}
            className="p-2 rounded"
            style={{
              backgroundColor: colors.secondary,
              color: colors.lightText,
            }}
            aria-label="Reset font size"
          >
            A
          </button>
          <button
            onClick={decreaseFontSize}
            className="p-2 rounded"
            style={{ backgroundColor: colors.primary, color: colors.lightText }}
            aria-label="Decrease font size"
          >
            A-
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <SkipToContent />
      <AccessibilityToolbar />
      <Navigation />
      <main>
        <HeroSection />
        <ApplicationSection />
        <PremiumQualitySection />
        <VisualInfoSection />
      </main>
      <Footer />
    </div>
  );
};

export default AccessibleMermaidsWebsite;
