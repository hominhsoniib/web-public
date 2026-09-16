import axios from "axios";

// Support dynamic URL via query param or localStorage for easier mobile testing
const urlParams = new URLSearchParams(window.location.search);
const apiParam = urlParams.get("api");
if (apiParam) {
  localStorage.setItem("VITE_API_BASE_URL", apiParam);
}

const savedBaseUrl = localStorage.getItem("VITE_API_BASE_URL");

const BASE_URL =
  savedBaseUrl ||
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (window.location.hostname.includes("vercel.app")
    ? "https://sambaden-api.loca.lt/api/v1"
    : `${window.location.protocol}//${window.location.hostname}:8000/api/v1`);

export const api = axios.create({ baseURL: BASE_URL });

// Gắn Bypass-Tunnel-Reminder header để tránh trang cảnh báo của localtunnel
api.interceptors.request.use((config) => {
  config.headers["Bypass-Tunnel-Reminder"] = "true";
  return config;
});

export interface ApiResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
  error: { code: string; message: string } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  status: string;
  category: Category;
  published_at?: string | null;
  view_count: number;
}

export interface SeoMeta {
  title: string;
  description?: string | null;
  keywords?: string | null;
  canonical_url?: string | null;
  robots: string;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
}

export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  category: Category;
  author_name: string;
  tags: Tag[];
  published_at?: string | null;
  disclaimer?: string | null;
  seo: SeoMeta;
  json_ld: object[];
  related: PostListItem[];
}

export const blog = {
  async list(category?: string, page = 1) {
    const r = await api.get<ApiResponse<PostListItem[]>>("/public/posts", {
      params: { "danh-muc": category, page },
    });
    return { items: r.data.data ?? [], meta: r.data.meta };
  },
  async detail(slug: string) {
    const r = await api.get<ApiResponse<PostDetail>>(`/public/posts/${slug}`);
    return r.data.data;
  },
};

export function fmtDate(iso?: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ---- Product (M6) ----
export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order: number;
}
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  short_desc?: string | null;
  reference_price?: number | string | null;
  unit?: string | null;
  status: string;
  category: Category;
  primary_image?: string | null;
}
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  short_desc?: string | null;
  description?: string | null;
  reference_price?: number | string | null;
  unit?: string | null;
  usage_info?: string | null;
  disclaimer?: string | null;
  status?: string;
  category: Category;
  images: ProductImage[];
  seo: SeoMeta;
  json_ld: object[];
  related: ProductListItem[];
}

export const MOCK_PRODUCTS: ProductDetail[] = [
  {
    id: "p-bot-sam",
    name: "Bột Sâm Bà Đen Nguyên Chất",
    slug: "bot-sam-ba-den",
    short_desc: "Bột Sâm Bố Chính 100% nguyên chất từ Núi Bà Đen, mịn màng, giàu saponin.",
    description: "<p>Bột Sâm Bà Đen được sấy lạnh vi khí hậu và nghiền siêu mịn. Thích hợp pha nước ấm uống hàng ngày, làm mặt nạ dưỡng da hoặc chế biến cùng thức ăn bổ dưỡng.</p>",
    reference_price: 350000,
    unit: "Hũ 100g",
    usage_info: "Hòa 3-5g bột sâm với 150ml nước ấm 70°C, thêm mật ong tùy thích.",
    disclaimer: "Sản phẩm này là thực phẩm bổ sung, không phải là thuốc.",
    status: "published",
    category: { id: "c-1", name: "Sâm Chế Biến Sâu", slug: "che-bien-sau" },
    images: [
      { id: "img-1", image_url: "/images/products/bot-sam.jpg", alt_text: "Bột Sâm Bà Đen", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Bột Sâm Bà Đen Nguyên Chất — Sâm Bố Chính Tây Ninh", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-ruou-dvt",
    name: "Rượu Sâm Đương Quy Tây Ninh",
    slug: "ruou-sam-duong-quy",
    short_desc: "Rượu sâm Bố Chính ngâm cùng Đương Quy Tây Ninh, bổ khí huyết, kiện tỳ vị.",
    description: "<p>Sự kết hợp hoàn hảo giữa củ Sâm Bố Chính Núi Bà Đen và Đương Quy trồng tự nhiên. Rượu có hương thơm thảo mộc đặc trưng, vị ngọt nhẹ dễ uống.</p>",
    reference_price: 850000,
    unit: "Chai 750ml",
    usage_info: "Uống 1-2 ly nhỏ (20-30ml) trong hoặc sau bữa ăn.",
    disclaimer: "Không dùng cho trẻ em và phụ nữ mang thai.",
    status: "published",
    category: { id: "c-2", name: "Rượu Dược Liệu", slug: "ruou-duoc-lieu" },
    images: [
      { id: "img-2", image_url: "/images/products/ruou-dvt.png", alt_text: "Rượu Sâm Đương Quy", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Rượu Sâm Đương Quy Tây Ninh", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-ruou-tv",
    name: "Rượu Sâm Bà Đen Thượng Hạng",
    slug: "ruou-sam-ba-den-thuong-hang",
    short_desc: "Rượu Sâm Bà Đen ủ lâu năm thơm nồng, đại bổ thể lực.",
    description: "<p>Dòng rượu sâm cao cấp được ngâm ủ tối thiểu 12 tháng với củ sâm đạt từ 3 năm tuổi trở lên. Thích hợp làm quà biếu sang trọng.</p>",
    reference_price: 1200000,
    unit: "Chai 750ml",
    usage_info: "Dùng 30ml mỗi ngày vào buổi tối để giúp lưu thông khí huyết, ngủ ngon.",
    disclaimer: "Sản phẩm chứa cồn, thưởng thức có trách nhiệm.",
    status: "published",
    category: { id: "c-2", name: "Rượu Dược Liệu", slug: "ruou-duoc-lieu" },
    images: [
      { id: "img-3", image_url: "/images/products/ruou-tv.png", alt_text: "Rượu Sâm Thượng Hạng", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Rượu Sâm Bà Đen Thượng Hạng", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-tra-sam",
    name: "Trà Sâm Bà Đen Túi Lọc",
    slug: "tra-sam-ba-den",
    short_desc: "Trà sâm Bố Chính tiện lợi, thanh nhiệt, giải độc, tăng thể lực.",
    description: "<p>Trà Sâm túi lọc được phối chế từ củ và rễ sâm Bố Chính cùng thảo mộc tự nhiên. Giúp giảm căng thẳng mệt mỏi, hỗ trợ tiêu hóa.</p>",
    reference_price: 180000,
    unit: "Hộp 25 túi lọc",
    usage_info: "Hãm 1 túi trà với 200ml nước sôi trong 3-5 phút.",
    disclaimer: "Sản phẩm dùng được hàng ngày cho cả gia đình.",
    status: "published",
    category: { id: "c-3", name: "Trà Dược Liệu", slug: "tra-duoc-lieu" },
    images: [
      { id: "img-4", image_url: "/images/products/tra-sam.jpg", alt_text: "Trà Sâm Bà Đen", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Trà Sâm Bà Đen Túi Lọc", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-binh-ruou",
    name: "Bình Rượu Sâm Bà Đen Nguyên Củ",
    slug: "binh-ruou-sam-nguyen-cu",
    short_desc: "Bình rượu ngâm củ Sâm Bà Đen tươi tuyển chọn, quà biếu đẳng cấp.",
    description: "<p>Bình thủy tinh cao cấp ngâm củ sâm tươi nguyên dáng đẹp mắt, giúp nâng tầm không gian phòng khách và mang lại giá trị sức khỏe vượt trội.</p>",
    reference_price: 2500000,
    unit: "Bình 3 lít",
    usage_info: "Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.",
    disclaimer: "Sản phẩm quà tặng dược liệu cao cấp.",
    status: "published",
    category: { id: "c-2", name: "Rượu Dược Liệu", slug: "ruou-duoc-lieu" },
    images: [
      { id: "img-5", image_url: "/images/products/binh-ruou.png", alt_text: "Bình Rượu Sâm Nguyên Củ", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Bình Rượu Sâm Bà Đen Nguyên Củ", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-cao-sam",
    name: "Cao Sâm Bà Đen Cô Đặc",
    slug: "cao-sam-ba-den",
    short_desc: "Cao sâm Bố Chính nung nấu theo phương pháp truyền thống kết hợp hiện đại.",
    description: "<p>Chiết xuất cô đặc hàm lượng saponin cao, hỗ trợ phục hồi sức khỏe nhanh chóng cho người mới ốm dậy hoặc người làm việc cường độ cao.</p>",
    reference_price: 650000,
    unit: "Hũ 200g",
    usage_info: "Pha 1 thìa nhỏ cao sâm với 100ml nước ấm, uống buổi sáng hoặc chiều.",
    disclaimer: "Bảo quản ngăn mát tủ lạnh sau khi mở nắp.",
    status: "published",
    category: { id: "c-1", name: "Sâm Chế Biến Sâu", slug: "che-bien-sau" },
    images: [
      { id: "img-6", image_url: "/images/products/cao-sam.png", alt_text: "Cao Sâm Bà Đen Cô Đặc", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Cao Sâm Bà Đen Cô Đặc", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-sam-say",
    name: "Sâm Bà Đen Sấy Khô Nguyên Củ",
    slug: "sam-say-kho-nguyen-cu",
    short_desc: "Củ sâm Bố Chính sấy thăng hoa giữ nguyên dưỡng chất.",
    description: "<p>Sâm củ tươi được làm sạch và sấy thăng hoa ở nhiệt độ âm giúp giữ nguyên cặn dinh dưỡng và hoạt chất quý. Có thể dùng hầm canh, ngâm mật ong hoặc sắn lát hãm trà.</p>",
    reference_price: 950000,
    unit: "Hộp 250g",
    usage_info: "Hầm cùng gà, chim cút hoặc xắt lát hãm nước sôi.",
    disclaimer: "Hạn sử dụng 24 tháng từ ngày sản xuất.",
    status: "published",
    category: { id: "c-4", name: "Sâm Tươi & Khô", slug: "sam-tuoi-kho" },
    images: [
      { id: "img-7", image_url: "/images/products/sam-say.png", alt_text: "Sâm Bà Đen Sấy Khô", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Sâm Bà Đen Sấy Khô Nguyên Củ", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-set-lau-2",
    name: "Set Lẩu Sâm Bà Đen Thượng Hạng",
    slug: "set-lau-sam-thuong-hang",
    short_desc: "Set lẩu sâm bổ dưỡng kết hợp dược liệu quý cho tiệc 4-6 người.",
    description: "<p>Nước dùng lẩu thanh ngọt đậm đà vị sâm Bố Chính, kỷ tử, táo đỏ và hạt sen. Mang đến trải nghiệm ẩm thực dưỡng sinh độc đáo.</p>",
    reference_price: 450000,
    unit: "Set 4-6 người",
    usage_info: "Hầm cùng xương gà hoặc xương heo trong 45 phút trước khi nhúng lẩu.",
    disclaimer: "Nguyên liệu tươi sạch, an toàn thực phẩm.",
    status: "published",
    category: { id: "c-5", name: "Ẩm Thực Sâm", slug: "am-thuc-sam" },
    images: [
      { id: "img-8", image_url: "/images/products/set-lau-2.png", alt_text: "Set Lẩu Sâm Thượng Hạng", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Set Lẩu Sâm Bà Đen Thượng Hạng", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-set-lau",
    name: "Set Lẩu Sâm Bà Đen Gia Đình",
    slug: "set-lau-sam-gia-dinh",
    short_desc: "Gia vị và nguyên liệu lẩu sâm thanh mát bổ dưỡng cho bữa ăn gia đình.",
    description: "<p>Set lẩu sâm tiện lợi giúp các bà nội trợ dễ dàng chế biến món lẩu đại bổ, mát gan giải nhiệt cho các thành viên trong gia đình.</p>",
    reference_price: 290000,
    unit: "Set 2-4 người",
    usage_info: "Cho toàn bộ gói gia vị và sâm tươi vào nồi nước hầm.",
    disclaimer: "Chế biến nhanh chóng trong 30 phút.",
    status: "published",
    category: { id: "c-5", name: "Ẩm Thực Sâm", slug: "am-thuc-sam" },
    images: [
      { id: "img-9", image_url: "/images/products/set-lau.png", alt_text: "Set Lẩu Sâm Gia Đình", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Set Lẩu Sâm Bà Đen Gia Đình", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-tra-hoa-sam",
    name: "Trà Hoa Sâm Bà Đen",
    slug: "tra-hoa-sam-ba-den",
    short_desc: "Hoa sâm Bố Chính sấy lạnh thơm dịu, giúp an thần, ngủ ngon.",
    description: "<p>Hoa sâm Bố Chính được thu hái vào sáng sớm khi vừa chớm nở, chứa nhiều chất chống oxy hóa flavonoit. Trà có màu vàng nhạt, hương thơm thanh khiết.</p>",
    reference_price: 220000,
    unit: "Hũ 80g",
    usage_info: "Dùng 5-7 bông hoa sâm hãm với 250ml nước sôi, uống ấm.",
    disclaimer: "Rất tốt cho người cao tuổi và người khó ngủ.",
    status: "published",
    category: { id: "c-3", name: "Trà Dược Liệu", slug: "tra-duoc-lieu" },
    images: [
      { id: "img-10", image_url: "/images/products/tra-hoa-sam.png", alt_text: "Trà Hoa Sâm Bà Đen", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Trà Hoa Sâm Bà Đen", robots: "index,follow" },
    json_ld: [],
    related: [],
  }
];

export const product = {
  async list(category?: string) {
    try {
      const r = await api.get<ApiResponse<ProductListItem[]>>("/public/products", {
        params: { "danh-muc": category },
      });
      if (r.data.data && r.data.data.length > 0) {
        return r.data.data;
      }
    } catch {
      // Fallback when API offline or empty
    }
    const listItems: ProductListItem[] = MOCK_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      short_desc: p.short_desc,
      reference_price: p.reference_price,
      unit: p.unit,
      status: p.status ?? "published",
      category: p.category,
      primary_image: p.images[0]?.image_url,
    }));
    if (category) {
      return listItems.filter((i) => i.category.slug === category);
    }
    return listItems;
  },
  async detail(slug: string) {
    try {
      const r = await api.get<ApiResponse<ProductDetail>>(
        `/public/products/${slug}`,
      );
      if (r.data.data) return r.data.data;
    } catch {
      // Fallback when API offline
    }
    const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!found) return null;
    return {
      ...found,
      related: MOCK_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        short_desc: p.short_desc,
        reference_price: p.reference_price,
        unit: p.unit,
        status: p.status ?? "published",
        category: p.category,
        primary_image: p.images[0]?.image_url,
      })),
    };
  },
};

export function fmtVnd(v?: number | string | null): string {
  if (v == null || v === "") return "Liên hệ";
  const n = typeof v === "string" ? parseFloat(v) : v;
  return n.toLocaleString("vi-VN") + " ₫";
}

// ---- Contact & Dealer forms ----
export interface ContactPayload {
  full_name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export interface DealerPayload {
  full_name: string;
  phone: string;
  email?: string;
  area: string;
  message?: string;
}

export interface ContactResult {
  id: string;
  message: string;
}

export const contact = {
  async submit(data: ContactPayload): Promise<ContactResult> {
    const r = await api.post<ApiResponse<ContactResult>>(
      "/public/contact",
      data,
    );
    if (r.data.error) throw new Error(r.data.error.message);
    return r.data.data!;
  },
  async submitDealer(data: DealerPayload): Promise<ContactResult> {
    const r = await api.post<ApiResponse<ContactResult>>(
      "/public/contact/dealer",
      data,
    );
    if (r.data.error) throw new Error(r.data.error.message);
    return r.data.data!;
  },
};

// ---- QR Code verification (M8) ----
export interface QRVerifyResponse {
  authentic: boolean;
  status: string;
  scan_count: number;
  first_scan_at?: string | null;
  batch?: {
    id: string;
    batch_no: string;
    product_name?: string | null;
    sku?: string | null;
    manufacture_date?: string | null;
    expiry_date?: string | null;
    warehouse?: string | null;
    supplier_name?: string | null;
    origin_region?: string | null;
    notes?: string | null;
  } | null;
  message: string;
  warning?: string | null;
}

export const qrcode = {
  async verify(token: string): Promise<QRVerifyResponse> {
    const r = await api.get<ApiResponse<QRVerifyResponse>>(
      `/public/qrcode/verify/${token}`,
    );
    if (r.data.error) throw new Error(r.data.error.message);
    return r.data.data!;
  },
};
