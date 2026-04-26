"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { getColors } from "../app/context/ColorContext";
import { useLanguage } from "@/app/context/LanguageContext";

interface ProductActionProps {
    product: {
        documentId: string;
        name: string;
        basePrice: number;
        colors: string[];
        sizes: string[];
        category: string;
        variants: any[];
    };
}

export default function ProductAction({ product }: ProductActionProps) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [colors, setColors] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        async function fetchData() {
        const result = await getColors();
        setColors(result);
        }
        fetchData();
    }, []);

    
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        setSelectedColor(firstVariant.color);
        setSelectedSize(firstVariant.size);
        }
    }, [product.variants]);

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        
        const firstAvailableSizeForColor = product.variants.find(
        (v) => v.color === color
        )?.size;

        setSelectedSize(firstAvailableSizeForColor || null);
    };

    const activeVariant = useMemo(() => {
        if (!selectedColor || !selectedSize) return null;
        return product.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
        );
    }, [selectedColor, selectedSize, product.variants]);

    const isSizeDisabled = (size: string) => {
        if (!selectedColor) return false;
        return !product.variants.some((v) => v.color === selectedColor && v.size === size);
    };

    
    const displayPrice = activeVariant ? activeVariant.pricing : product.basePrice;
    const displaySalePrice = activeVariant?.salePricing || 0;
    const isSale = displaySalePrice > 0 && displaySalePrice < displayPrice;
    
    const handleIncrement = () => setQuantity((p) => p + 1);
    const handleDecrement = () => setQuantity((p) => (p > 1 ? p - 1 : 1));
    const handleWishlist = async () => {
        const token = localStorage.getItem("token"); 

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const response = await fetch("http://localhost:1337/api/wishlists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    data: {
                        product: product.documentId, 
                    },
                }),
            });

            if (response.ok) {
                alert("Added to wishlist!");
            } else {
                const errorData = await response.json();
                console.error("Wishlist error:", errorData);
                alert("Error: " + (errorData.error.message || "Please try again"));
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Cannot connect to server");
        }
    };
const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = "http://localhost:1337";

    if (!token) {
        alert("Please login first");
        return;
    }

    if (!activeVariant) {
        alert("Please select color and size");
        return;
    }

    try {
        const query = new URLSearchParams();
        query.append("populate[cart][populate][items][populate]", "product"); 

        const userRes = await fetch(`${apiUrl}/api/users/me?${query.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        
        if (!userRes.ok) throw new Error("Failed to fetch user profile");
        const userData = await userRes.json();

        const cartDocumentId = userData.cart?.documentId;
        const existingItems = userData.cart?.items || [];
        
        let itemFound = false;
        const sanitizedItems = existingItems.map((item: any) => {
            let productId;
            if (item.product && typeof item.product === 'object') {
                productId = item.product.documentId || item.product.id;
            } else {
                productId = item.product;
            }

            if (item.sku === activeVariant.sku) {
                itemFound = true;
                return {
                    sku: item.sku,
                    quantity: item.quantity + quantity,
                    price_at_added: displayPrice,
                    product: productId, 
                    added_at: item.added_at
                };
            }

            return {
                sku: item.sku,
                quantity: item.quantity,
                price_at_added: item.price_at_added,
                product: productId, 
                added_at: item.added_at
            };
        });

        const nextItems = itemFound 
            ? sanitizedItems 
            : [...sanitizedItems, {
                sku: activeVariant.sku,
                quantity: quantity,
                price_at_added: displayPrice,
                product: product.documentId,
                added_at: new Date().toISOString(),
            }];

        const endpoint = cartDocumentId ? `${apiUrl}/api/carts/${cartDocumentId}` : `${apiUrl}/api/carts`;
        const method = cartDocumentId ? "PUT" : "POST";
        
        const body = cartDocumentId 
            ? { data: { items: nextItems } }
            : { 
                data: { 
                    user: userData.id, 
                    items: nextItems, 
                    publishedAt: new Date().toISOString() 
                } 
            };

        const res = await fetch(endpoint, {
            method,
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            alert(itemFound ? "Cart updated!" : "Added to cart!");
        } else {
            const errorData = await res.json();
            alert(`Error: ${errorData.error?.message || "Unknown Error"}`);
        }

    } catch (error) {
        console.error("Add to cart error:", error);
        alert("Cannot connect to server");
    }
};
    return (
        <div className="w-[30vw] pl-[3vw] py-[3vw]">
            <div className=" w-[50vw] ">
                <p className="text-[2vw]">{product.name}</p>
                <p className="text-[1vw] text-[#716F71]">{t("detail.productCode")}: ABC-DEF-GHI</p>
                <div className="flex items-baseline gap-3">
                    {isSale ? (
                        <>
                            <p className="text-[2vw] text-red-600 py-[1.5vw]">
                                {displaySalePrice.toLocaleString()} {t("detail.baht")}
                            </p>
                            <p className="text-[1vw] text-[#716F71] line-through">
                                {displayPrice.toLocaleString()} {t("detail.baht")}
                            </p>
                        </>
                    ) : (
                        <p className="text-[2vw] text-[#5F4B8B] py-[1.5vw]">
                            {displayPrice.toLocaleString()} {t("detail.baht")}
                        </p>
                    )}
                </div>
                
                <p className="text-[1vw] text-[#716F71] ">{t("detail.selectColor")}: {selectedColor}</p>
                <div className="flex gap-2">
                    {product.colors.map((color) => {
                        const hexCode = colors ? colors[color] : "#cccccc";
                        return(
                           <div
                            key={color}
                            onClick={() => handleColorChange(color)}
                            style={{ backgroundColor: hexCode }}
                            className={`w-[2.5vw] h-[2.5vw] relative  border rounded-full cursor-pointer transition-all ${
                            selectedColor === color ? "ring-2 ring-[#5F4B8B] scale-110" : "opacity-70 hover:opacity-100"
                            }`}
                        >
                        </div> 
                        )
                })}
                </div>
                <div className="mt-6">
                <p className="text-[1vw] font-medium mb-2">{t("detail.size")}: {selectedSize || t("detail.notSelected")}</p>
                <div className="flex gap-2">
                    {product.sizes.map((size) => {
                    const disabled = isSizeDisabled(size);
                    return (
                        <button
                        key={size}
                        disabled={disabled}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm transition-all ${
                            selectedSize === size
                            ? "bg-[#5F4B8B] text-white border-[#5F4B8B]"
                            : disabled
                            ? "opacity-20 cursor-not-allowed bg-gray-100"
                            : "hover:border-[#5F4B8B]"
                        }`}
                        >
                        {size}
                        </button>
                    );
                    })}
                </div>
                </div>
                <p className="text-[1vw] text-[#716F71] mt-[2vw]">{t("detail.quantity")} </p>
                <div className="flex select-none">
                    <div className="flex items-center justify-center w-[2vw] h-[2vw] border cursor-pointer " onClick={handleDecrement}>
                    -
                    </div>
                    <div className="flex items-center justify-center w-[2vw] h-[2vw] border">
                    {quantity}
                    </div>
                    <div className="flex items-center justify-center w-[2vw] h-[2vw] border cursor-pointer" onClick={handleIncrement}>
                    +
                    </div>
                </div>
            </div>
            <p className="flex items-center justify-center text-[1vw] mt-[2vw] text-white bg-[#5F4B8B] w-full h-[3vw] cursor-pointer select-none" onClick={handleAddToCart}>
                {t("detail.addToCart")}
            </p>
            <p className="flex items-center justify-center text-[1vw] bg-white mt-[1vw] w-full h-[3vw] border cursor-pointer select-none" onClick={handleWishlist} >
                {t("detail.addToWishlist")}
            </p>
        </div>
    );
}