'use client';
import ProductCard from "@/app/product/components/features/ProductCard";
import { useInView } from "@/lib/hooks/useInView";
import { useProduct } from "@/hooks/useProduct";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Recommend_section() {
    const { ref, isVisible } = useInView();
    const { products, recommended, isLoading, wishlistItems, toggleWishlist } = useProduct();
    const { t } = useLanguage();

    // Show recommended products if any exist, otherwise show all products
    const displayProducts = recommended.length > 0 ? recommended : products;
    const sectionTitle = recommended.length > 0 ? t("section.recommend") : "Our Products";

    return (
        <section className={`w-full flex mt-[5vw] justify-center fade-section ${isVisible ? 'fade-section-visible' : ''}`} ref={ref}>
            <div className='text-center w-full max-w-7xl mx-auto px-4 pb-16'>
                <h2 className="text-[2.5vw] md:text-3xl font-bold mb-[3vw]">{sectionTitle}</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : displayProducts.length === 0 ? (
                    <p className="text-gray-400 text-lg">No products yet. Add some from the admin panel.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {displayProducts.slice(0, 8).map((item: any) => {
                            const isWishlisted = wishlistItems.some(
                                w => w.product?.documentId === item.documentId
                            );
                            return (
                                <ProductCard 
                                    key={item.documentId || item.id} 
                                    product={item} 
                                    isWishlisted={isWishlisted} 
                                    onToggleWishlist={toggleWishlist} 
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}