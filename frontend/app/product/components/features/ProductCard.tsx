import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/types"; 
import { getImageUrl, getProductVariantImage } from "@/hooks/useProduct"; 
import { HeartIconOutline, HeartIconSolid } from "@/app/product/components/ui/icons";
import { useCurrency } from "@/app/context/CurrencyContext";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, p: Product) => void; // Fixed: Better type than 'any'
}

export default function ProductCard({ product, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  // 1. FIX: Safely handle if variants is undefined
  const variants = product.variants || []; 
  const mainVariant = variants[0];
  
  let imageObj = getProductVariantImage(mainVariant);
  
  // 2. FIX: Now safely checks length on the guaranteed array
  if (!imageObj && variants.length > 1) {
    const fallbackVariant = variants.find(v => getProductVariantImage(v));
    if (fallbackVariant) imageObj = getProductVariantImage(fallbackVariant);
  }

  const imgUrl = getImageUrl(imageObj?.url);
  const price = mainVariant?.pricing || 0;
  const salePrice = mainVariant?.salePricing || 0;
  const isSale = salePrice > 0 && salePrice < price;

  return (
    <Link href={`/product/${product.documentId}`} className="group block relative">
      {/* 3. FIX: Tailwind arbitrary value syntax for aspect ratio */}
      <div className="relative aspect-3/4 bg-gray-100 mb-4 overflow-hidden">
        {isSale && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] px-2 py-1 font-bold z-10">SALE</div>
        )}
        <button 
          onClick={(e) => onToggleWishlist(e, product)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all z-20 hover:scale-110"
        >
          {isWishlisted ? <HeartIconSolid /> : <HeartIconOutline />}
        </button>

        {imageObj?.url ? (
          <Image src={imgUrl} alt={product.ProductName} fill unoptimized className="object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-xs bg-gray-50 border border-gray-100">NO IMAGE</div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-normal text-gray-900 truncate">{product.ProductName}</h3>
        <div className="mt-1 text-sm flex items-center gap-2">
          {isSale ? (
            <>
              <span className="font-bold text-red-600">{formatPrice(salePrice)}</span>
              <span className="text-gray-400 line-through text-xs">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}