import axios from "axios";

// Support dynamic URL via query param or localStorage for easier mobile testing
const urlParams = new URLSearchParams(window.location.search);
const apiParam = urlParams.get("api");
if (apiParam) {
  localStorage.setItem("VITE_API_BASE_URL", apiParam);
  const apiDomain = apiParam.replace("/api/v1", "");
  localStorage.setItem("VITE_API_URL", apiDomain);
}

const savedApiUrl = localStorage.getItem("VITE_API_URL");
const VITE_API_URL =
  savedApiUrl ||
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (window.location.hostname.includes("vercel.app")
    ? "https://sambaden-api.loca.lt"
    : `${window.location.protocol}//${window.location.hostname}:8000`);

// Tạo instance dành riêng cho portal với auth header
export const portalClient = axios.create({
  baseURL: VITE_API_URL,
  timeout: 1200,
});

// Middleware tự động đính kèm token của Đại lý nếu có
portalClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("portal_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Bypass-Tunnel-Reminder"] = "true";
  return config;
});

export interface PortalDealerProfile {
  id: string;
  code: string;
  name: string;
  tier: string;
  region: string;
  address?: string;
  contact_name?: string;
  phone?: string;
  credit_limit: number;
  payment_term_days: number;
  status: string;
  balance: number;
}

/** Định nghĩa cục bộ, không import từ src/lib/api.ts để tránh phụ thuộc 2 chiều
 * giữa portalApi.ts (portal) và api.ts (public) — api.ts sẽ import type
 * PortalProduct từ đây, chiều ngược lại thì không. */
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface PortalProductImage {
  id: string;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface PortalProductSeo {
  title: string;
  description?: string;
  robots: string;
}

export interface PortalProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: Category;
  image_url?: string;
  images: PortalProductImage[];
  description?: string;
  unit: string;
  base_price: number;
  dealer_price: number;
  discount_percent: number;
  in_stock: boolean;
  seo: PortalProductSeo;
  json_ld: object[];
}

/** Danh mục gợi ý cho dropdown trong form admin — copy tay từ MOCK_PRODUCTS
 * (src/lib/api.ts), không import runtime để tránh kéo theo toàn bộ mock data
 * (mô tả HTML dài) vào bundle của portal. */
export const PRODUCT_CATEGORIES: Category[] = [
  { id: "c-1", name: "Sâm Chế Biến Sâu", slug: "che-bien-sau" },
  { id: "c-2", name: "Rượu Dược Liệu", slug: "ruou-duoc-lieu" },
  { id: "c-3", name: "Trà Dược Liệu", slug: "tra-duoc-lieu" },
  { id: "c-4", name: "Sâm Tươi & Khô", slug: "sam-tuoi-kho" },
  { id: "c-5", name: "Ẩm Thực Sâm", slug: "am-thuc-sam" },
];

const PRODUCTS_STORAGE_KEY = "custom_mock_products";

function slugify(text: string): string {
  const noDiacritics = text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return noDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Sinh slug duy nhất từ tên sản phẩm, tự thêm hậu tố -2/-3... nếu trùng với
 * sản phẩm khác đã có (bỏ qua chính sản phẩm đang sửa qua excludeId). */
export function generateUniqueProductSlug(
  name: string,
  existing: PortalProduct[],
  excludeId?: string,
): string {
  const base = slugify(name) || "san-pham";
  const others = existing.filter((p) => p.id !== excludeId);
  let candidate = base;
  let n = 2;
  while (others.some((p) => p.slug === candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

/** Bỏ thẻ HTML và cắt ngắn — dùng cho short_desc (public list) và seo.description. */
export function stripHtml(html: string, maxLen = 160): string {
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text.length > maxLen ? `${text.slice(0, maxLen).trim()}…` : text;
}

const DEFAULT_PORTAL_PRODUCTS: PortalProduct[] = [
  { id: "p-bot-sam", sku: "SBD-BOT-100", name: "Bột Sâm Bà Đen Nguyên Chất (100g)", slug: "bot-sam-ba-den", category: PRODUCT_CATEGORIES[0], image_url: "/images/products/bot-sam.jpg", images: [{ id: "img-p-bot-sam", image_url: "/images/products/bot-sam.jpg", alt_text: "Bột Sâm Bà Đen Nguyên Chất", is_primary: true, sort_order: 1 }], unit: "Hũ", base_price: 350000, dealer_price: 280000, discount_percent: 20, in_stock: true, seo: { title: "Bột Sâm Bà Đen Nguyên Chất — Sâm Bố Chính Tây Ninh", robots: "index,follow" }, json_ld: [] },
  { id: "p-ruou-dvt", sku: "SBD-RDVT-750", name: "Rượu Sâm Đương Quy Tây Ninh (750ml)", slug: "ruou-sam-duong-quy", category: PRODUCT_CATEGORIES[1], image_url: "/images/products/ruou-dvt.png", images: [{ id: "img-p-ruou-dvt", image_url: "/images/products/ruou-dvt.png", alt_text: "Rượu Sâm Đương Quy", is_primary: true, sort_order: 1 }], unit: "Chai", base_price: 850000, dealer_price: 680000, discount_percent: 20, in_stock: true, seo: { title: "Rượu Sâm Đương Quy Tây Ninh", robots: "index,follow" }, json_ld: [] },
  { id: "p-ruou-tv", sku: "SBD-RTV-750", name: "Rượu Sâm Bà Đen Thượng Hạng (750ml)", slug: "ruou-sam-ba-den-thuong-hang", category: PRODUCT_CATEGORIES[1], image_url: "/images/products/ruou-tv.png", images: [{ id: "img-p-ruou-tv", image_url: "/images/products/ruou-tv.png", alt_text: "Rượu Sâm Thượng Hạng", is_primary: true, sort_order: 1 }], unit: "Chai", base_price: 1200000, dealer_price: 960000, discount_percent: 20, in_stock: true, seo: { title: "Rượu Sâm Bà Đen Thượng Hạng (Samtani Tiến Vua)", robots: "index,follow" }, json_ld: [] },
  { id: "p-tra-sam", sku: "SBD-TRA-25", name: "Trà Sâm Bà Đen Túi Lọc (Hộp 25 túi)", slug: "tra-sam-ba-den", category: PRODUCT_CATEGORIES[2], image_url: "/images/products/tra-sam.jpg", images: [{ id: "img-p-tra-sam", image_url: "/images/products/tra-sam.jpg", alt_text: "Trà Sâm Bà Đen Túi Lọc", is_primary: true, sort_order: 1 }], unit: "Hộp", base_price: 180000, dealer_price: 144000, discount_percent: 20, in_stock: true, seo: { title: "Trà Sâm Bà Đen Túi Lọc", robots: "index,follow" }, json_ld: [] },
  { id: "p-binh-ruou", sku: "SBD-BR-3L", name: "Bình Rượu Sâm Bà Đen Nguyên Củ (3L)", slug: "binh-ruou-sam-nguyen-cu", category: PRODUCT_CATEGORIES[1], image_url: "/images/products/binh-ruou.png", images: [{ id: "img-p-binh-ruou", image_url: "/images/products/binh-ruou.png", alt_text: "Bình Rượu Sâm Nguyên Củ", is_primary: true, sort_order: 1 }], unit: "Bình", base_price: 2500000, dealer_price: 2000000, discount_percent: 20, in_stock: true, seo: { title: "Bình Rượu Sâm Bà Đen Nguyên Củ", robots: "index,follow" }, json_ld: [] },
  { id: "p-cao-sam", sku: "SBD-CAO-200", name: "Cao Sâm Bà Đen Cô Đặc (200g)", slug: "cao-sam-ba-den", category: PRODUCT_CATEGORIES[0], image_url: "/images/products/cao-sam.png", images: [{ id: "img-p-cao-sam", image_url: "/images/products/cao-sam.png", alt_text: "Cao Sâm Bà Đen Cô Đặc", is_primary: true, sort_order: 1 }], unit: "Hũ", base_price: 650000, dealer_price: 520000, discount_percent: 20, in_stock: true, seo: { title: "Cao Sâm Bà Đen Cô Đặc", robots: "index,follow" }, json_ld: [] },
  { id: "p-sam-say", sku: "SBD-SAY-250", name: "Sâm Bà Đen Sấy Khô Nguyên Củ (250g)", slug: "sam-say-kho-nguyen-cu", category: PRODUCT_CATEGORIES[3], image_url: "/images/products/sam-say.png", images: [{ id: "img-p-sam-say", image_url: "/images/products/sam-say.png", alt_text: "Sâm Bà Đen Sấy Khô", is_primary: true, sort_order: 1 }], unit: "Hộp", base_price: 950000, dealer_price: 760000, discount_percent: 20, in_stock: true, seo: { title: "Sâm Bà Đen Sấy Khô Nguyên Củ", robots: "index,follow" }, json_ld: [] },
  { id: "p-set-lau-2", sku: "SBD-LAU-TH", name: "Set Lẩu Sâm Bà Đen Thượng Hạng (4-6 người)", slug: "set-lau-sam-thuong-hang", category: PRODUCT_CATEGORIES[4], image_url: "/images/products/set-lau-2.png", images: [{ id: "img-p-set-lau-2", image_url: "/images/products/set-lau-2.png", alt_text: "Set Lẩu Sâm Thượng Hạng", is_primary: true, sort_order: 1 }], unit: "Set", base_price: 450000, dealer_price: 360000, discount_percent: 20, in_stock: true, seo: { title: "Set Lẩu Sâm Bà Đen Thượng Hạng", robots: "index,follow" }, json_ld: [] },
  { id: "p-set-lau", sku: "SBD-LAU-GD", name: "Set Lẩu Sâm Bà Đen Gia Đình (2-4 người)", slug: "set-lau-sam-gia-dinh", category: PRODUCT_CATEGORIES[4], image_url: "/images/products/set-lau.png", images: [{ id: "img-p-set-lau", image_url: "/images/products/set-lau.png", alt_text: "Set Lẩu Sâm Gia Đình", is_primary: true, sort_order: 1 }], unit: "Set", base_price: 290000, dealer_price: 232000, discount_percent: 20, in_stock: true, seo: { title: "Set Lẩu Sâm Bà Đen Gia Đình", robots: "index,follow" }, json_ld: [] },
  { id: "p-tra-hoa-sam", sku: "SBD-THS-80", name: "Trà Hoa Sâm Bà Đen (80g)", slug: "tra-hoa-sam-ba-den", category: PRODUCT_CATEGORIES[2], image_url: "/images/products/tra-hoa-sam.png", images: [{ id: "img-p-tra-hoa-sam", image_url: "/images/products/tra-hoa-sam.png", alt_text: "Trà Hoa Sâm Bà Đen", is_primary: true, sort_order: 1 }], unit: "Hũ", base_price: 220000, dealer_price: 176000, discount_percent: 20, in_stock: true, seo: { title: "Trà Hoa Sâm Bà Đen (Tứ Vị)", robots: "index,follow" }, json_ld: [] },
];

function getStoredProducts(): PortalProduct[] {
  const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_PORTAL_PRODUCTS;
}

function saveStoredProducts(products: PortalProduct[]): void {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export const portalApi = {
  // Authentication (dùng chung API đăng nhập)
  login: async (email: string, password: string) => {
    // Note: Dùng formData vì FastAPI OAuth2 mặc định nhận form data
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    const res = await portalClient.post("/api/v1/auth/login", formData);
    return res.data.data;
  },
  
  // Profile
  getProfile: async () => {
    const res = await portalClient.get("/api/v1/portal/me");
    return res.data.data as PortalDealerProfile;
  },

  // Products
  getProducts: async () => {
    try {
      const res = await portalClient.get("/api/v1/portal/products");
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data as PortalProduct[];
      }
    } catch {
      // Fallback
    }
    return getStoredProducts();
  },

  createProduct: async (product: PortalProduct): Promise<PortalProduct[]> => {
    const updated = [product, ...getStoredProducts()];
    saveStoredProducts(updated);
    return updated;
  },

  updateProduct: async (product: PortalProduct): Promise<PortalProduct[]> => {
    const updated = getStoredProducts().map((p) => (p.id === product.id ? product : p));
    saveStoredProducts(updated);
    return updated;
  },

  deleteProduct: async (id: string): Promise<PortalProduct[]> => {
    const updated = getStoredProducts().filter((p) => p.id !== id);
    saveStoredProducts(updated);
    return updated;
  },

  // Orders
  createOrder: async (items: {product_id: string, quantity: number}[], shipping_address?: string, note?: string) => {
    const payload = { items, shipping_address, note };
    const res = await portalClient.post("/api/v1/portal/orders", payload);
    return res.data.data;
  },

  getOrders: async () => {
    const res = await portalClient.get("/api/v1/portal/orders");
    return res.data.data;
  },

  exportOrders: async (format: "excel" | "pdf") => {
    const res = await portalClient.get(`/api/v1/portal/orders/export?format=${format}`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Don_hang_SBD.${format === "excel" ? "xlsx" : "pdf"}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  getLedgers: async () => {
    const res = await portalClient.get("/api/v1/portal/ledger");
    return res.data.data;
  },

  exportLedger: async (format: "excel" | "pdf") => {
    const res = await portalClient.get(`/api/v1/portal/ledger/export?format=${format}`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `So_cai_SBD.${format === "excel" ? "xlsx" : "pdf"}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  createPaymentUrl: async (amount: number) => {
    const res = await portalClient.post("/api/v1/portal/payments/vnpay_url", { amount });
    return res.data.data.payment_url;
  },

  verifyPayment: async (params: Record<string, string>) => {
    const res = await portalClient.get("/api/v1/portal/payments/vnpay_return", { params });
    return res.data.data;
  }
};
