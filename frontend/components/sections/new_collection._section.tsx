'use client';
import { useInView } from "@/lib/hooks/useInView";
import NewProductCard from "../ui/newProduct_card";
import { useNewProduct } from "@/hooks/useNewProduct";

export default function New_collection_section() {
    const { ref, isVisible } = useInView();
    // เพิ่มการรับค่า error มาจัดการด้วย (Optional)
    const { newProducts, isLoading, error } = useNewProduct();

    if (error) return <div className="text-red-500">Error loading products</div>;

    return (
        <div className={`w-full h-fit flex justify-between mb-[5vw] ${isVisible ? 'fade-section-visible' : ''}`} ref={ref}>
            {isLoading ? (
                    // แนะนำให้ใส่ Skeleton Loader สวยๆ แทน Text ธรรมดาในอนาคต
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-2 gap-[2vw] w-full">
                        {newProducts.slice(0, 2).map((product) => {
                            return (
                                <NewProductCard
                                    key={product.id} // ใช้ id หรือ documentId ตามที่ hook ส่งมา
                                    name={product.title}
                                    description={product.description}
                                    // --- แก้ไขตรงนี้ ---
                                    // ใช้ product.imageUrl ตรงๆ เพราะ Hook จัดการ http://... ให้แล้ว
                                    imageUrl={product.imageUrl} 
                                />
                            );
                        })}
                    </div>
                )}
        </div>
    );
}