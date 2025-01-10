// "use client";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterSection from "@/components/NewsletterSection";
import BlackFridayBanner from "@/components/BlackFridayBanner";
import CategoriesQuickAccess from "@/components/CategoriesQuickAccess";
import Footer from "@/components/Footer";
import CompanyLogoSlider from "@/components/CompanyLogoSlider";
import DigitalBusinessCard from "@/components/DigitalBusinessCard";
import DigitalCardPreview from "@/components/DigitalCardPreview";
import DigitalCardCreator from "@/components/DigitalCardCreator";
import DigitalCardEditor from "@/components/DigitalCardEditor";
import Faq from "@/components/Faq";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Uncomment sections as needed */}
      {/* <BlackFridayBanner /> */}
      <Hero />
      <CompanyLogoSlider />
      {/* <DigitalBusinessCard /> */}
      <DigitalCardEditor />
      <DigitalCardCreator />

      {/* <CategoriesQuickAccess categories={categories} /> */}

      <FeaturedProducts products={products} categories={categories} />
      {/* <Faq /> */}

      {/* <NewsletterSection /> */}
      <Footer />
    </main>
  );
}
