// components/CategoriesSection.tsx
import { ShoppingBag } from "lucide-react";

interface Category {
  _id: string;
  title: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  return (
    <section className="py-12 container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center cursor-pointer"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {category.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
