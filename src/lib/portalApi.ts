import axios from "axios";

// TODO(migrate-to-backend): toàn bộ portalApi hiện chạy dựa trên: (1) gọi backend
// thật nếu có (VITE_API_URL), và (2) khi backend không phản hồi, PortalLogin.tsx
// dùng fallback offline SHA256 (VITE_OFFLINE_ADMIN_EMAIL / VITE_OFFLINE_ADMIN_PASSWORD_SHA256
// trong .env.local) để cho phép admin duy nhất đăng nhập tạm thời. Khi có backend
// thật, cần: (a) xoá fallback offline trong PortalLogin.tsx, (b) chuyển việc kiểm tra
// mật khẩu admin sang một Vercel Serverless Function (vd. /api/admin-login) giữ
// credential check hoàn toàn phía server, không expose hash ra client bundle nữa,
// (c) thay saveProducts()/getProducts() và các hàm đọc/ghi localStorage khác trong
// file này bằng gọi API CRUD thật, xoá localStorage["custom_mock_products"].

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
  timeout: 3000,
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

export interface PortalProduct {
  id: string;
  sku: string;
  name: string;
  image_url?: string;
  description?: string;
  unit: string;
  base_price: number;
  dealer_price: number;
  discount_percent: number;
  in_stock: boolean;
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
    const saved = localStorage.getItem("custom_mock_products");
    if (saved) {
      try {
        return JSON.parse(saved) as PortalProduct[];
      } catch {}
    }
    return [
      { id: "p-bot-sam", sku: "SBD-BOT-100", name: "Bột Sâm Bà Đen Nguyên Chất (100g)", image_url: "/images/products/bot-sam.jpg", unit: "Hũ", base_price: 350000, dealer_price: 280000, discount_percent: 20, in_stock: true },
      { id: "p-ruou-dvt", sku: "SBD-RDVT-750", name: "Rượu Sâm Đương Quy Tây Ninh (750ml)", image_url: "/images/products/ruou-dvt.png", unit: "Chai", base_price: 850000, dealer_price: 680000, discount_percent: 20, in_stock: true },
      { id: "p-ruou-tv", sku: "SBD-RTV-750", name: "Rượu Sâm Bà Đen Thượng Hạng (750ml)", image_url: "/images/products/ruou-tv.png", unit: "Chai", base_price: 1200000, dealer_price: 960000, discount_percent: 20, in_stock: true },
      { id: "p-tra-sam", sku: "SBD-TRA-25", name: "Trà Sâm Bà Đen Túi Lọc (Hộp 25 túi)", image_url: "/images/products/tra-sam.jpg", unit: "Hộp", base_price: 180000, dealer_price: 144000, discount_percent: 20, in_stock: true },
      { id: "p-binh-ruou", sku: "SBD-BR-3L", name: "Bình Rượu Sâm Bà Đen Nguyên Củ (3L)", image_url: "/images/products/binh-ruou.png", unit: "Bình", base_price: 2500000, dealer_price: 2000000, discount_percent: 20, in_stock: true },
      { id: "p-cao-sam", sku: "SBD-CAO-200", name: "Cao Sâm Bà Đen Cô Đặc (200g)", image_url: "/images/products/cao-sam.png", unit: "Hũ", base_price: 650000, dealer_price: 520000, discount_percent: 20, in_stock: true },
      { id: "p-sam-say", sku: "SBD-SAY-250", name: "Sâm Bà Đen Sấy Khô Nguyên Củ (250g)", image_url: "/images/products/sam-say.png", unit: "Hộp", base_price: 950000, dealer_price: 760000, discount_percent: 20, in_stock: true },
      { id: "p-set-lau-2", sku: "SBD-LAU-TH", name: "Set Lẩu Sâm Bà Đen Thượng Hạng (4-6 người)", image_url: "/images/products/set-lau-2.png", unit: "Set", base_price: 450000, dealer_price: 360000, discount_percent: 20, in_stock: true },
      { id: "p-set-lau", sku: "SBD-LAU-GD", name: "Set Lẩu Sâm Bà Đen Gia Đình (2-4 người)", image_url: "/images/products/set-lau.png", unit: "Set", base_price: 290000, dealer_price: 232000, discount_percent: 20, in_stock: true },
      { id: "p-tra-hoa-sam", sku: "SBD-THS-80", name: "Trà Hoa Sâm Bà Đen (80g)", image_url: "/images/products/tra-hoa-sam.png", unit: "Hũ", base_price: 220000, dealer_price: 176000, discount_percent: 20, in_stock: true }
    ];
  },

  saveProducts: (products: PortalProduct[]) => {
    localStorage.setItem("custom_mock_products", JSON.stringify(products));
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
