import Image from "next/image";
import ProductGallery from "../../../components/productGallery"
import ProductAction from "../../../components/productAction"
import Link from "next/link";
import ProductDescription from "../../../components/productDescription";

interface StrapiImage {
    url: string;
    alternativeText?: string;
    name: string;
}

interface Variant {
    id: number;
    sku: string;
    color: string | null; 
    size: string | null;
    stockqty: number;
    pricing: number;
    salePricing?: number;
    Image?: StrapiImage[]; 
}

interface CleanedProduct {
    documentId: string;
    name: string;
    category: string;
    description: any;
    basePrice: number;
    colors: string[];
    sizes: string[];
    images: string[];
    variants: Variant[]; 
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {

const { slug } = await params;

    // Server-side: use internal Docker URL; client-side: use public URL
    const INTERNAL_API = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const PUBLIC_API = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    
    let product: CleanedProduct | null = null;

    try {
        // 1. Fetch data with a timeout/error check
        const response = await fetch(
            `${INTERNAL_API}/api/products/${slug}?populate[variants][populate]=Image`,
            { next: { revalidate: 60 } }
        );

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data;

        // 2. Validate essential data structure 
        if (!data || !data.variants || data.variants.length === 0) {
            throw new Error("Product data or variants missing");
        }

        // 3. Map the data safely to your object
        product = {
            documentId: data.documentId,
            name: data.ProductName || "Untitled Product", // attribute: ProductName 
            category: data.Category || "Uncategorized", // attribute: Category 
            description: data.description || [], // attribute: description (json) 
            basePrice: data.variants[0]?.pricing || 0, // component: elements.product-variants -> pricing 
            
            colors: Array.from(new Set(data.variants.map((v: Variant) => v.color))).filter(Boolean) as string[],
            sizes: Array.from(new Set(data.variants.map((v: Variant) => v.size))).filter(Boolean) as string[],
            
            images: Array.from(new Set(
                data.variants
                    .flatMap((v: Variant) => v.Image || []) // Media: Image (multiple: true) 
                    .map((img: StrapiImage) => img.url.startsWith('http') ? img.url : `${PUBLIC_API}${img.url}`)
            )) as string[],
            variants: data.variants
        };

    } catch (error) {
        // Log the error for debugging
        console.error("Failed to load product page:", error);
        // 'product' remains null, triggering the fallback UI below
    }

    // --- GRACEFUL FALLBACK UI ---
    if (!product) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <h2 className="text-xl font-semibold">ขออภัย ไม่พบข้อมูลสินค้า</h2>
            {/* Use Link component instead of <a> for internal navigation */}
            <Link 
            href="/" 
            className="text-[#5F4B8B] hover:underline"
            >
            กลับไปที่หน้าหลัก
            </Link>
        </div>
        );
    }

    return (
    <>
        <div className="mt-[7vw] flex justify-between mx-[10vw] mb-[5vw]">
            <div className="flex flex-col w-full flex-1 pt-[3vw] border-r border-gray-200">
                <div className="flex border-b pb-[3vw] border-gray-200">
                    <ProductGallery images={product.images}/>
                </div>
                <div className="text-[#716F71] mt-[1vw]">
                    <ProductDescription description={product.description} />
                </div>
            </div>
            <ProductAction product={product}/>
        </div>
    </>
    );
}

