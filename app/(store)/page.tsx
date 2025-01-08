import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import Image from "next/image";
import ProductsView from "@/components/ProductsView";
import BlackFridayBanner from "@/components/BlackFridayBanner";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <main className="min-h-screen bg-gray-50">
      <BlackFridayBanner />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-red-500 via-rose-400 to-rose-200 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
<<<<<<< HEAD
            src="/hero.jpg" // Replace with your shopping cart image path
=======
            src="/hero.webp" // Replace with your shopping cart image path
>>>>>>> stable-x
            alt="Background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Amazing Products for Your Lifestyle
              </h1>
              <p className="text-lg lg:text-xl text-blue-100">
                Shop our curated collection of premium products at unbeatable
                prices.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" variant="secondary" className="gap-2">
                  Shop Now <ShoppingBag className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-800 gap-2"
                >
                  View Categories <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            {/* Removed the right column since we're using background image */}
          </div>
        </div>

        {/* Decorative wave shape */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50">
          <svg
            className="absolute bottom-0 w-full h-16 text-gray-50"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
            fill="currentColor"
          >
            <path d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 0.400012 1200 10 1320 15.3L1440 20V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z" />
          </svg>
        </div>
      </section>

      {/* Categories Quick Access */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                {/* You can add category icons here */}
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {category.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Main Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Explore our handpicked selection of premium products, carefully
              chosen for quality and value.
            </p>
          </div>
          <ProductsView products={products} categories={categories} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
