'use client';
import ProductCard from "../ui/product_card";
import { useInView } from "@/lib/hooks/useInView";
import { useProduct } from "@/hooks/useProduct";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Recommend_section() {
    const { ref, isVisible } = useInView();
    const { recommended, isLoading, isSaleParam } = useProduct();
    const { t } = useLanguage();

    return (
        <section className={`w-full flex mt-[5vw] justify-center fade-section ${isVisible ? 'fade-section-visible' : ''}`} ref={ref}>
            <div className='text-center w-full max-w-7xl mx-auto px-4 pb-16'>
                <h2 className="text-[2.5vw] md:text-3xl font-bold mb-[3vw]">{t("section.recommend")}</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recommended.slice(0, 4).map((item: any) => {
                            const data = item.attributes || item; 
                            const variant = data.variants?.[0];
                            const regularPrice = variant?.pricing ?? 0;
                            const salePrice = variant?.salePricing ?? 0;
                            const finalPrice = (salePrice > 0 && salePrice < regularPrice) ? salePrice : regularPrice;
                            const imgPath = variant?.Image?.[0]?.url || variant?.image?.[0]?.url;
                            const fullImageUrl = imgPath ? `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${imgPath}` : '/placeholder.png';
                            return (
                                <ProductCard key={item.documentId || item.id} name={data.ProductName} price={finalPrice} imageUrl={fullImageUrl} />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}