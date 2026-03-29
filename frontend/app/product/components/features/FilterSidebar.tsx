import { useState } from "react";
import { Category } from "@/types/types";
import { SIZES } from "@/hooks/useProduct";
import { useLanguage } from "@/app/context/LanguageContext";

interface FilterSidebarProps {
  categories: Category[];
  availableColors: string[];
  colorMap: any;
  store: any; 
}

export default function FilterSidebar({ categories, availableColors, colorMap, store }: FilterSidebarProps) {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<any>({ sort: true, category: true, color: true, size: true, price: true });
  const toggleSection = (section: string) => setOpenSections((prev: any) => ({ ...prev, [section]: !prev[section] }));
  const toggleSet = (current: string[], value: string) => current.includes(value) ? current.filter(x => x !== value) : [...current, value];

  const sortOptions = [
    { label: t("sort.recommended"), value: "recommended" },
    { label: t("sort.priceAsc"), value: "price_asc" },
    { label: t("sort.priceDesc"), value: "price_desc" },
    { label: t("sort.nameAsc"), value: "name_asc" }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4 h-fit lg:sticky lg:top-24 select-none">
      <SidebarSection title={t("filter.sortBy")} section="sort" openSections={openSections} toggleSection={toggleSection}>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-black">
              <input type="radio" name="sort" value={option.value} checked={store.sortBy === option.value} onChange={(e) => store.setSortBy(e.target.value)} className="accent-black" />
              {option.label}
            </label>
          ))}
        </div>
      </SidebarSection>
      <SidebarSection title={t("filter.category")} section="category" openSections={openSections} toggleSection={toggleSection}>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className={`cursor-pointer hover:text-black ${store.selectedCategory === null ? 'font-bold text-black' : ''}`} onClick={() => store.setSelectedCategory(null)}>{t("filter.all")}</li>
          {categories.map((cat) => (
            <li key={cat.id} className={`cursor-pointer hover:text-black ${store.selectedCategory === cat.categoryName ? 'font-bold text-black' : ''}`} onClick={() => store.setSelectedCategory(cat.categoryName)}>{cat.categoryName}</li>
          ))}
        </ul>
      </SidebarSection>
      <SidebarSection title={t("filter.color")} section="color" openSections={openSections} toggleSection={toggleSection}>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((colorName) => {
             const isSelected = store.selectedColors.includes(colorName);
             return (
               <div key={colorName} onClick={() => store.setSelectedColors(toggleSet(store.selectedColors, colorName))} className={`w-6 h-6 rounded-full border cursor-pointer flex items-center justify-center transition-all ${isSelected ? 'ring-2 ring-black ring-offset-2 border-transparent' : 'border-gray-300 hover:border-gray-500'}`} style={{ backgroundColor: colorName }} title={colorName}>
                 {isSelected && <span className={`text-[10px] ${['White','ขาว','Cream','ครีม','Yellow','เหลือง'].includes(colorName) ? 'text-black' : 'text-white'}`}>✓</span>}
               </div>
             )
          })}
        </div>
      </SidebarSection>
      <SidebarSection title={t("filter.size")} section="size" openSections={openSections} toggleSection={toggleSection}>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button key={size} onClick={() => store.setSelectedSizes(toggleSet(store.selectedSizes, size))} className={`border px-3 py-1 text-xs transition-colors ${store.selectedSizes.includes(size) ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black text-gray-600'}`}>{size}</button>
          ))}
        </div>
      </SidebarSection>
      <SidebarSection title={t("filter.price")} section="price" openSections={openSections} toggleSection={toggleSection}>
        <div className="flex justify-between text-xs text-gray-500 mb-2"><span>0 ฿</span><span>{store.priceRange.toLocaleString()} ฿</span></div>
        <input type="range" min="0" max="10000" step="100" value={store.priceRange} onChange={(e) => store.setPriceRange(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
      </SidebarSection>
    </aside>
  );
}

const SidebarSection = ({ title, section, openSections, toggleSection, children }: any) => (
  <div className="border-b pb-2">
    <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleSection(section)}>
      <h3 className="font-bold text-sm uppercase">{title}</h3>
      <span className="text-gray-400 text-lg">{openSections[section] ? '-' : '+'}</span>
    </div>
    {openSections[section] && <div className="pl-1 pb-1 animate-fadeIn">{children}</div>}
  </div>
);