// ==========================================
// 1. Product & Variants (สินค้าและตัวเลือก)
// ==========================================
export interface ProductImage {
  url: string;
}

export interface Variant {
  id: number;
  sku: string;
  color: string;
  size: string;
  pricing: number;
  salePricing?: number;
  stockqty?: number;
  Image?: ProductImage[];
}

export interface Product {
  id: number;
  documentId: string;
  ProductName: string;
  Category?: string; // รวมจากอันแรก
  description?: string;
  slug?: string;
  recomended: boolean;
  variants?: Variant[];
  cat_pro?: Category;
}

export interface NewProduct {
  id: number;
  documentId: string;
  Image: ProductImage;
  title: string;
  description: string;
  product: Product;
}

// ==========================================
// 2. Cart System (ตะกร้าสินค้า)
// ==========================================
export interface CartItem {
  id: number;
  sku: string;
  quantity: number;
  // เพิ่ม field จากอันแรกเผื่อไว้ใช้
  price_at_added?: number; 
  added_at?: string;
  product?: Product;
}

export interface Cart {
  id: number;
  documentId: string;
  items: CartItem[];
}

// สำหรับตอนส่งข้อมูลไป update ตะกร้า (ถ้าจำเป็นต้องใช้ type นี้)
export interface CartItemPayload {
  sku: string;
  quantity: number;
  price_at_added: number;
  product: number | string;
  added_at: string;
}

// ==========================================
// 3. Wishlist & Transactions (รายการโปรด & คำสั่งซื้อ)
// ==========================================
export interface WishlistItem {
  id: number;
  documentId: string;
  added_at: string;
  publishedAt?: string | null;
  product?: Product;
}

export interface Transaction {
  id: number;
  documentId: string;
  createdAt: string;
  publishedAt?: string | null;
  order_status: string;
  total_summary: number;
  tracking_info?: string;
}

// ==========================================
// 4. User Profile (ข้อมูลผู้ใช้ - รวมทุกอย่างที่นี่)
// ==========================================
export interface UserAddress {
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
}

export interface UserProfile {
  // --- ข้อมูลพื้นฐาน ---
  id: number;
  username: string;
  email: string;
  
  // --- ข้อมูลส่วนตัว (อาจจะยังไม่ได้กรอก ใส่ ? ไว้) ---
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: UserAddress;

  // --- ความสัมพันธ์ (Relations) ---
  cart?: Cart;
  wishlists?: WishlistItem[];
  transactions?: Transaction[];
}

// ==========================================
// 4. Category
// ==========================================
export interface CategoryImage{
  url: string;
}
export interface Category {
  id: number;
  documentId: string;
  categoryName: string;
  type?: string;
  categoryPic?: CategoryImage[];
}