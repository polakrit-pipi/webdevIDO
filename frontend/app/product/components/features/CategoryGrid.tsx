import Image from "next/image";
import { Category } from "@/types/types";
import { getImageUrl } from "@/hooks/useProduct";

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (catName: string | null) => void;
}

export default function CategoryGrid({ categories, selectedCategory, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-b pb-10">
      {categories.map((cat) => {
          let catImgObj: any = cat.categoryPic;
          if (Array.isArray(catImgObj)) catImgObj = catImgObj[0];
          const isSelected = selectedCategory === cat.categoryName;
          
          return (
            <div key={cat.id} onClick={() => onSelect(isSelected ? null : cat.categoryName)} 
                  className={`flex flex-col items-center cursor-pointer group transition-opacity ${selectedCategory && !isSelected ? 'opacity-50' : 'opacity-100'}`}>
              <div className={`w-full aspect-3/4 bg-gray-100 mb-3 overflow-hidden relative rounded-sm border-2 transition-all duration-300 ${isSelected ? 'border-black shadow-md' : 'border-gray-200 group-hover:border-gray-400 group-hover:shadow-sm'}`}>
                  {catImgObj?.url ? <Image src={getImageUrl(catImgObj.url)} alt={cat.categoryName} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center h-full text-gray-400 text-xs bg-gray-200">No Image</div>}
              </div>
              <span className={`text-sm font-medium uppercase ${isSelected ? 'text-black font-bold underline' : 'text-gray-600'}`}>{cat.categoryName}</span>
            </div>
          );
      })}
    </div>
  );
}