import { useState, useEffect } from "react";
// import { NewProduct } from "@/types/types"; // เปิดใช้หากมี Type นี้

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const useNewProduct = () => {
  const [newProducts, setNewProducts] = useState<any[]>([]); // เปลี่ยน type ชั่วคราวเพื่อ debug
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. ลองเปลี่ยน populate ให้เจาะจงขึ้น (หรือใช้ * เหมือนเดิมก็ได้ถ้ามั่นใจ)
        // แนะนำให้ลองเช็คชื่อ field ว่าเป็น 'Image' หรือ 'image'
        const res = await fetch(`${API_URL}/api/new-products?populate=*`);
        
        if (!res.ok) throw new Error("Failed to fetch new products");
        
        const json = await res.json();
        
        // Debug: ดูโครงสร้างข้อมูลจริงที่ได้จาก Strapi v5
        console.log("Strapi Response:", json);

        const formattedData = (json.data || []).map((item: any) => {
            // Strapi v5 ไม่มี attributes แล้ว แต่โค้ดนี้เผื่อไว้ให้รองรับทั้ง v4/v5
            const data = item.attributes || item; 
            
            // --- จุดแก้ไขสำคัญสำหรับ v5 ---
            
            // 2. ตรวจสอบชื่อ Field (Image vs image)
            // Strapi มักส่งมาเป็น 'image' (ตัวเล็ก) ลองเช็คทั้งสองแบบ
            const imageField = data.Image || data.image;

            // 3. ดึง URL (v5 คืนค่าเป็น Object โดยตรง ไม่มี .data)
            let rawUrl = null;

            if (Array.isArray(imageField)) {
                // กรณี Multiple Media
                rawUrl = imageField[0]?.url || imageField[0]?.attributes?.url;
            } else if (imageField) {
                // กรณี Single Media (v5 มักเป็นแบบนี้)
                rawUrl = imageField.url || imageField.data?.attributes?.url || imageField.attributes?.url;
            }

            const fullImageUrl = rawUrl 
                ? (rawUrl.startsWith("http") ? rawUrl : `${API_URL}${rawUrl}`)
                : "/placeholder.png";

            // 4. จัดการ Relation
            const productField = data.product || data.Product; // เช็คตัวเล็ก/ตัวใหญ่
            const relationData = productField?.data || productField;

            return {
                id: item.id,
                documentId: item.documentId,
                title: data.title,
                description: data.description,
                imageUrl: fullImageUrl,
                relatedProduct: relationData ? {
                    id: relationData.id,
                    documentId: relationData.documentId,
                    ...relationData // Spread properties อื่นๆ
                } : null
            };
        });

        setNewProducts(formattedData);
      } catch (err) {
        console.error("Error fetching new products:", err);
        setError("Failed to load new products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { newProducts, isLoading, error };
};