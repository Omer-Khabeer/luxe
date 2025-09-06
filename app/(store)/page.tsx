// // "use client";
// import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
// import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
// import Hero from "@/components/Hero";
// import FeaturedProducts from "@/components/FeaturedProducts";
// import NewsletterSection from "@/components/NewsletterSection";
// import BlackFridayBanner from "@/components/BlackFridayBanner";
// import CategoriesQuickAccess from "@/components/CategoriesQuickAccess";
// import Footer from "@/components/Footer";
// import CompanyLogoSlider from "@/components/CompanyLogoSlider";
// // import DigitalBusinessCard from "@/components/DigitalBusinessCard";
// // import DigitalCardPreview from "@/components/DigitalCardPreview";
// // import DigitalCardCreator from "@/components/DigitalCardCreator";
// // import DigitalCardEditor from "@/components/DigitalCardEditor";
// import Faq from "@/components/Faq";
// import FeatureCards from "./FeatureCards";
// import ServiceFeatures from "@/components/ServiceFeatures";
// import ProductCard from "@/components/ProductCard";
// import ProductGrid from "@/components/ProductGrid";
// import ProductsGrid from "@/components/ProductsGrid";
// import DriedFruitsSection from "@/components/DriedFruitsSection";
// import NutsSection from "../../components/NutsSection";

// export default async function Home() {
//   const products = await getAllProducts();
//   const categories = await getAllCategories();

//   return (
//     <main className="min-h-screen bg-gray-50">
//       {/* <FlexgoldConfigurator /> */}
//       {/* Uncomment sections as needed */}
//       {/* <BlackFridayBanner /> */}
//       <Hero />
//       <ServiceFeatures />
//       <FeatureCards />
//       <NutsSection />
//       <DriedFruitsSection />
//       {/* {FeaturedProducts() && <ProductGrid title="Unsere Auswahl" />} */}
//       {/* {bestOffers && <ProductGrid title="Beste Angebote" />} */}
//       {/* <DigitalBusinessCard /> */}
//       {/* <DigitalCardEditor /> */}
//       {/* <DigitalCardCreator /> */}

//       {/* <CategoriesQuickAccess categories={categories} /> */}

//       {/* <FeaturedProducts products={products} categories={categories} /> */}
//       {/* <Faq /> */}

//       {/* <NewsletterSection /> */}
//       <Footer />
//     </main>
//   );
// }

// Updated Homepage with ProductsGrid
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterSection from "@/components/NewsletterSection";
import BlackFridayBanner from "@/components/BlackFridayBanner";
import CategoriesQuickAccess from "@/components/CategoriesQuickAccess";
import Footer from "@/components/Footer";
// import CompanyLogoSlider from "@/components/CompanyLogoSlider";
import Faq from "@/components/Faq";
// import InvestmentPlanSelector from "@/components/InvestmentPlanSelector";
// import DatenschutzHeroV2 from "@/components/datenschutzberater";
// import AccessibleMermaidsWebsite from "@/components/mermaids";
// import FlexgoldConfigurator from "@/components/FlexgoldConfigurator";
// import JobsPortal from "@/components/JobsPortal";
import FeatureCards from "../../components/FeatureCards";
import ServiceFeatures from "@/components/ServiceFeatures";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import ProductsGrid from "@/components/ProductsGrid";
import DriedFruitsSection from "@/components/DriedFruitsSection";
import NutsSection from "@/components/NutsSection";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  // Filter products for different sections
  const featuredProducts =
    products?.filter((product: any) => product.featured) || [];
  const bestOffers =
    products?.filter((product: any) => product.bestOffer) || [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* <BlackFridayBanner /> */}
      <Hero />
      <ServiceFeatures />
      <FeatureCards />
      {/* <CategoriesQuickAccess categories={categories} /> */}
      <FeaturedProducts products={products} categories={categories} />
      <NutsSection />
      <DriedFruitsSection />
      {/* <Faq /> */}
      {/* <NewsletterSection /> */}
      <Footer />
    </main>
  );
}
