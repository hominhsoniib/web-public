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

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 2500,
});

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

export const MOCK_POSTS: PostDetail[] = [
  {
    id: "post-loi-ich-sbc",
    title: "6 Công dụng Tuyệt vời của Sâm Bố Chính đối với Sức khỏe & Làn da",
    slug: "6-cong-dung-sam-bo-chinh",
    excerpt: "Khám phá 6 công dụng dược lý vượt trội của Sâm Bố Chính Tây Ninh: nuôi dưỡng xương khớp, giải độc gan, an thần ngủ ngon và làm đẹp da.",
    content: `<p><strong>Sâm Bố Chính (Abelmoschus sagittifolius)</strong> là loại nhân sâm tiến vua có lịch sử hơn 300 năm tại Việt Nam. Nghiên cứu khoa học cho thấy Sâm Bố Chính Bà Đen Farm chứa hàm lượng chất nhầy lớn (377,8 mg/g) cùng Saponin toàn phần (15,2 mg/g) mang lại nhiều giá trị dưỡng sinh cao.</p><p style="text-align:center;"><img src="/images/loi-ich-sbc.png" alt="6 Công dụng Sâm Bố Chính Bà Đen Farm" style="width:100%; max-width:850px; display:inline-block; margin:24px auto; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12);" /></p><h3>1. Nuôi dưỡng & bảo vệ hệ xương khớp</h3><p>Chất nhầy tự nhiên (377,8 mg/g) đóng vai trò nuôi dưỡng sụn khớp, giúp các khớp cơ hoạt động trơn tru, giảm đau nhức xương khớp ở người cao tuổi.</p><h3>2. Tăng cường hệ miễn dịch & Kháng thể</h3><p>Dồi dào enzyme và Saponin triterpenoid hỗ trợ kích thích bạch cầu, nâng cao thể lực và sức đề kháng chống lại vi khuẩn.</p><h3>3. Thanh lọc giải độc gan</h3><p>Hoạt chất Cysteine cân bằng lượng amoniac trong máu, hạn chế tác hại của bia rượu, thuốc lá và hóa chất tích tụ trong gan.</p><h3>4. Cải thiện mất ngủ mãn tính</h3><p>Glycine, Histidine và Valine trong sâm có tác dụng an thần, xua tan căng thẳng mệt mỏi, mang lại giấc ngủ ngon sâu giấc sau 30 ngày.</p><h3>5. Trẻ hóa làn da & Kích thích Collagen</h3><p>Amino acid Glycine, Phenylalanine và Threonine ngăn ngừa lão hóa sớm, hỗ trợ tổng hợp Collagen cho làn da mịn màng hồng hào.</p><h3>6. Bổ sung dinh dưỡng & Nâng cao thể lực</h3><p>Hàm lượng Lipid, Protein, Tinh bột và các nguyên tố vi lượng tự nhiên dễ hấp thụ giúp người mới ốm dậy nhanh chóng phục hồi sức khỏe.</p>`,
    cover_image_url: "/images/loi-ich-sbc.png",
    category: { id: "cat-b1", name: "Kiến thức Dược liệu", slug: "kien-thuc-duoc-lieu" },
    author_name: "Ban Biên Tập Bà Đen Farm",
    tags: [{ id: "t1", name: "SâmBốChính", slug: "sam-bo-chinh" }, { id: "t2", name: "SứcKhỏe", slug: "suc-khoe" }],
    published_at: "2026-09-14T08:00:00Z",
    disclaimer: "Thông tin tổng hợp dựa trên nghiên cứu khoa học và hồ sơ dược liệu của Bà Đen Farm.",
    seo: { title: "6 Công dụng Tuyệt vời của Sâm Bố Chính đối với Sức khỏe", description: "Infographic 6 công dụng sức khỏe của Sâm Bố Chính Bà Đen Farm.", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "post-lich-su-sam-bo-chinh",
    title: "Lịch sử 300 năm Sâm Bố Chính — Loại Nhân Sâm Tiến Vua Quý Giá",
    slug: "lich-su-300-nam-sam-bo-chinh",
    excerpt: "Nguồn gốc lịch sử loài sâm Châu Bố Chính được ghi danh trong cuốn sách kinh điển 'Những cây thuốc vị thuốc Việt Nam'.",
    content: `<p>Cách đây hơn 300 năm có 01 loại nhân Sâm được phát hiện và sử dụng lần đầu tiên làm dược liệu ở Châu Bố Chính (nay là vùng Bố Trạch, Quảng Bình). Sâm Bố Chính hay còn được gọi là: sâm Tiến Vua, thổ hào sâm, sâm núi... có tên khoa học là Abelmoschus sagittifolius.</p><p style="text-align:center;"><img src="/images/products/sam-say.png" alt="Sâm Bố Chính sấy thăng hoa" style="width:100%; max-width:600px; display:inline-block; margin:24px auto; border-radius:12px;" /></p><h3>Dược tính sánh ngang Sâm Cao Ly Hàn Quốc</h3><p>Từ lâu, cây sâm Bố Chính đã được đánh giá là một vị thuốc quý, được ghi trong cuốn sách nổi tiếng “Những cây thuốc vị thuốc Việt Nam” của GS. Đỗ Tất Lợi. Trong sâm Bố Chính chứa Saponin triterpenoid có tác dụng tăng lực, chống suy nhược thần kinh, giúp bồi bổ cơ thể rất tốt.</p>`,
    cover_image_url: "/images/products/sam-say.png",
    category: { id: "cat-b1", name: "Kiến thức Dược liệu", slug: "kien-thuc-duoc-lieu" },
    author_name: "Dược Sĩ Bà Đen Farm",
    tags: [{ id: "t1", name: "SâmBốChính", slug: "sam-bo-chinh" }],
    published_at: "2026-09-08T10:00:00Z",
    disclaimer: "Tài liệu lịch sử dược học Việt Nam.",
    seo: { title: "Lịch sử 300 năm Sâm Bố Chính", description: "Lịch sử loài sâm Tiến Vua nổi tiếng.", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "post-huong-dan-su-dung-sam",
    title: "Hướng dẫn 5 Cách Chế biến & Thưởng thức Sâm Bố Chính Bồi bổ Gia đình",
    slug: "huong-dan-su-dung-sam-bo-chinh",
    excerpt: "Gợi ý 5 công thức thưởng thức Bột sâm, Trà hoa sâm, Lẩu sâm dưỡng sinh bồi bổ sức khỏe cho cả gia đình.",
    content: `<p>Sâm Bố Chính Bà Đen Farm là dược liệu lành tính, vị ngọt thanh mát phù hợp cho cả người già, trẻ nhỏ và người làm việc căng thẳng. Dưới đây là 5 cách thưởng thức thơm ngon dễ làm nhất:</p><p style="text-align:center;"><img src="/images/products/tra-hoa-sam.png" alt="Trà Hoa Sâm Tứ Vị" style="width:100%; max-width:600px; display:inline-block; margin:24px auto; border-radius:12px;" /></p><h3>1. Pha Trà Hoa Sâm Tứ Vị</h3><p>Cho 5-6 bông hoa trà sâm vào ly, hãm với 150 - 200ml nước sôi trong 3 - 5 phút. Trà có vị thơm tự nhiên giúp an thần, tạo giấc ngủ sâu.</p><h3>2. Pha Bột Sâm uống buổi sáng</h3><p>Hòa 3-5g Bột Sâm với 150ml nước ấm 70°C, thêm mật ong để bổ sung chất nhầy xương khớp và tăng đề kháng.</p><h3>3. Đắp mặt nạ Bột Sâm dưỡng da</h3><p>Trộn Bột Sâm với mật ong hoặc sữa chua không đường giúp kích thích Collagen, giảm thâm mụn cho phụ nữ.</p>`,
    cover_image_url: "/images/products/tra-hoa-sam.png",
    category: { id: "cat-b3", name: "Sức khỏe & Chăm sóc", slug: "suc-khoe-cham-soc" },
    author_name: "Chuyên Gia Dưỡng Sinh",
    tags: [{ id: "t5", name: "ChămSócSứcKhỏe", slug: "cham-soc-suc-khoe" }],
    published_at: "2026-09-06T14:00:00Z",
    disclaimer: "Cẩm nang dinh dưỡng Bà Đen Farm.",
    seo: { title: "Hướng dẫn sử dụng Sâm Bố Chính", description: "Các công thức chế biến chế biến Sâm Bố Chính.", robots: "index,follow" },
    json_ld: [],
    related: [],
  }
];

export const blog = {
  async list(category?: string, page = 1) {
    try {
      const r = await api.get<ApiResponse<PostListItem[]>>("/public/posts", {
        params: { "danh-muc": category, page },
      });
      if (r.data.data && r.data.data.length > 0) {
        return { items: r.data.data, meta: r.data.meta };
      }
    } catch {
      // Fallback
    }
    const customPostsRaw = localStorage.getItem("custom_mock_posts");
    const activePosts: PostDetail[] = customPostsRaw ? JSON.parse(customPostsRaw) : MOCK_POSTS;

    const listItems: PostListItem[] = activePosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      cover_image_url: p.cover_image_url,
      status: "published",
      category: p.category,
      published_at: p.published_at,
      view_count: 120,
    }));
    if (category) {
      const filtered = listItems.filter((i) => i.category.slug === category);
      return { items: filtered, meta: { total: filtered.length } };
    }
    return { items: listItems, meta: { total: listItems.length } };
  },
  async detail(slug: string) {
    try {
      const r = await api.get<ApiResponse<PostDetail>>(`/public/posts/${slug}`);
      if (r.data.data) return r.data.data;
    } catch {
      // Fallback
    }
    const customPostsRaw = localStorage.getItem("custom_mock_posts");
    const activePosts: PostDetail[] = customPostsRaw ? JSON.parse(customPostsRaw) : MOCK_POSTS;

    const found = activePosts.find((p) => p.slug === slug);
    if (!found) return null;
    return {
      ...found,
      related: activePosts.filter((p) => p.slug !== slug).slice(0, 3).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        cover_image_url: p.cover_image_url,
        status: "published",
        category: p.category,
        published_at: p.published_at,
        view_count: 95,
      })),
    };
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
    short_desc: "100% Củ Sâm Bố Chính sấy lạnh vi khí hậu & nghiền mịn. Hàm lượng chất nhầy 377,8 mg/g & Saponin 15,2 mg/g.",
    description: `<p><strong>Bột Sâm Bố Chính Bà Đen Farm</strong> được chế biến từ 100% củ sâm Bố Chính tươi trồng tự nhiên tại chân Núi Bà Đen Tây Ninh. Củ sâm sau khi làm sạch được sấy lạnh vi khí hậu giữ trọn vẹn dược tính và nghiền thành bột siêu mịn.</p><h3>Công dụng nổi bật:</h3><ul><li><strong>Giàu chất nhầy tự nhiên (377,8 mg/g):</strong> Nuôi dưỡng khớp cơ, hỗ trợ xương khớp hoạt động trơn tru, dồi dào enzyme kháng thể tăng cường đề kháng.</li><li><strong>Bổ sung dinh dưỡng toàn diện:</strong> Giàu Lipid, Protein, Tinh bột, Saponin và các nguyên tố vi lượng tự nhiên dễ hấp thụ.</li><li><strong>Dưỡng da chống lão hóa:</strong> Chứa Saponin, Acid Amin giúp kích thích sản sinh Collagen, tái tạo tế bào, giảm thâm mụn khi kết hợp đắp mặt cùng mật ong hoặc sữa chua.</li></ul><h3>Đối tượng sử dụng:</h3><p>Người mới phẫu thuật, người gầy gò ốm yếu thường xuyên mệt mỏi, phụ nữ rối loạn kinh nguyệt, người già đau nhức xương khớp do thiếu chất nhầy.</p>`,
    reference_price: 350000,
    unit: "Hũ 100g",
    usage_info: "Hòa 3-5g bột sâm với 150ml nước ấm 70°C, thêm mật ong hoặc đường phèn. Có thể nêm vào canh bổ hoặc pha cùng mật ong, lòng đỏ trứng, sữa chua không đường làm mặt nạ dưỡng da.",
    disclaimer: "Sản phẩm bổ sung dưỡng chất tự nhiên an toàn dùng được hàng ngày.",
    status: "published",
    category: { id: "c-1", name: "Sâm Chế Biến Sâu", slug: "che-bien-sau" },
    images: [
      { id: "img-1", image_url: "/images/products/bot-sam.jpg", alt_text: "Bột Sâm Bà Đen Nguyên Chất", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Bột Sâm Bà Đen Nguyên Chất — Sâm Bố Chính Tây Ninh", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-ruou-dvt",
    name: "Rượu Sâm Đương Quy Tây Ninh",
    slug: "ruou-sam-duong-quy",
    short_desc: "Rượu nếp xử lý Điện Từ Trường ngâm Sâm Bố Chính & Đương Quy. Khử sạch độc tố, bổ khí huyết.",
    description: `<p><strong>Rượu Sâm Đương Quy Bà Đen Farm</strong> kết hợp giữa củ Sâm Bố Chính Núi Bà Đen và Đương Quy Tây Ninh cùng rượu nếp ngâm ủ qua <strong>Công Nghệ Điện Từ Trường (2-3 giờ)</strong> giúp khử sạch độc tố Andehit, Methanol, êm nồng như rượu hạ thổ lâu năm.</p><h3>Công dụng nổi bật:</h3><ul><li>Bổ khí huyết, tăng cường sinh lực, giảm suy nhược cơ thể.</li><li>Không gây đau đầu, hoa mắt, khát nước hay mệt mỏi sau khi uống.</li><li>Giúp lưu thông tuần hoàn máu, hỗ trợ tiêu hóa ăn ngon ngủ sâu.</li></ul>`,
    reference_price: 850000,
    unit: "Chai 750ml",
    usage_info: "Uống 1-2 ly nhỏ (20-30ml) trong hoặc sau bữa ăn hàng ngày.",
    disclaimer: "Sản phẩm dành cho người trên 18 tuổi. Không dùng cho phụ nữ mang thai.",
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
    name: "Rượu Sâm Bà Đen Thượng Hạng (Samtani Tiến Vua)",
    slug: "ruou-sam-ba-den-thuong-hang",
    short_desc: "Phối ngũ 4 đại dược liệu: Sâm Bố Chính, Sâm Ấn Độ (Ashwagandha), Đẳng Sâm & Đông Trùng Hạ Thảo.",
    description: "<p><strong>Rượu Sâm Tiến Vua Thượng Hạng Bà Đen Farm</strong> kết hợp 4 loài dược liệu quý: Sâm Bố Chính Núi Bà Đen, Sâm Ấn Độ (Ashwagandha), Đẳng Sâm (Sâm Ngọc Linh dây) và Đông Trùng Hạ Thảo. Rượu nếp được hạ thổ công nghệ điện từ trường khử độc tố 100%.</p><h3>Tác dụng dược lý đỉnh cao:</h3><ul><li><strong>Sâm Bố Chính:</strong> Chứa Saponin triterpenoid (15,2 mg/g) tăng lực mạnh mẽ, chống mệt mỏi.</li><li><strong>Sâm Ấn Độ (Ashwagandha):</strong> Bổ thần kinh, minh mẫn trí óc, giảm căng thẳng kéo dài và tăng cường sinh lý nam nữ.</li><li><strong>Đẳng Sâm:</strong> Bổ thận suy, chữa đau lưng mỏi gối, váng đầu hoa mắt, mới ốm dậy.</li><li><strong>Đông Trùng Hạ Thảo:</strong> Bổ phổi thận, đào thải độc tố, ngăn ngừa suy nhược.</li></ul>",
    reference_price: 1200000,
    unit: "Chai 750ml",
    usage_info: "Dùng 30ml mỗi ngày vào bữa tối để giúp lưu thông khí huyết, an thần ngủ ngon.",
    disclaimer: "Thưởng thức có trách nhiệm. Không dùng khi lái xe.",
    status: "published",
    category: { id: "c-2", name: "Rượu Dược Liệu", slug: "ruou-duoc-lieu" },
    images: [
      { id: "img-3", image_url: "/images/products/ruou-tv.png", alt_text: "Rượu Sâm Thượng Hạng", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Rượu Sâm Bà Đen Thượng Hạng (Samtani Tiến Vua)", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-tra-sam",
    name: "Trà Sâm Bà Đen Túi Lọc",
    slug: "tra-sam-ba-den",
    short_desc: "100% Thân, rễ, lá, củ Sâm Bố Chính. Vị ngọt thanh đọng lâu cổ họng, giải độc gan & cải thiện mất ngủ.",
    description: "<p><strong>Trà túi lọc Sâm Bố Chính Bà Đen Farm</strong> chiết xuất từ 100% thân, rễ, lá và củ sâm Bố Chính trồng tự nhiên tại Núi Bà Đen. Trà có hương thơm phảng phất, vị ngọt thanh tự nhiên lưu giữ rất lâu nơi cổ họng.</p><h3>Lợi ích sức khỏe vượt trội:</h3><ul><li><strong>Phòng ngừa suy nhược & Chống lão hóa:</strong> Saponin triterpenoid giúp phân hủy chất béo, phòng chống bệnh mãn tính. Cysteine giúp giải độc tố gan, hạn chế tác hại của bia rượu, thuốc lá.</li><li><strong>Tạo giấc ngủ ngon sau 30 ngày:</strong> Chứa Glycine, Histidine an thần, Valine cải thiện mất ngủ lo âu, Phenylalanine chống trầm cảm.</li><li><strong>Đẹp da & Tăng Collagen:</strong> Glycine làm chậm lão hóa skin, Threonine hỗ trợ hình thành Collagen & Elastin liên kết mô.</li><li><strong>Bổ tim mạch & Máu:</strong> Chứa Omega 3-6-9 tươi cùng 19 loại Amino Acid phục hồi thể lực sau chấn thương, phẫu thuật.</li></ul>",
    reference_price: 180000,
    unit: "Hộp 25 túi lọc",
    usage_info: "Hãm 1 túi trà với 150-200ml nước sôi trong 3-5 phút. Thích hợp thưởng thức sau bữa ăn, buổi chiều tối hoặc lúc nghỉ ngơi.",
    disclaimer: "Trà thảo dược thiên nhiên dùng hàng ngày cho cả gia đình.",
    status: "published",
    category: { id: "c-3", name: "Trà Dược Liệu", slug: "tra-duoc-lieu" },
    images: [
      { id: "img-4", image_url: "/images/products/tra-sam.jpg", alt_text: "Trà Sâm Bà Đen Túi Lọc", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Trà Sâm Bà Đen Túi Lọc", robots: "index,follow" },
    json_ld: [],
    related: [],
  },
  {
    id: "p-binh-ruou",
    name: "Bình Rượu Sâm Bà Đen Nguyên Củ (3L)",
    slug: "binh-ruou-sam-nguyen-cu",
    short_desc: "Bình thủy tinh ngâm củ Sâm Bố Chính tươi nguyên dáng tuyệt đẹp, đại bổ khí huyết, quà biếu đẳng cấp.",
    description: "<p><strong>Bình Rượu Sâm Bà Đen Nguyên Củ 3 Litre</strong> sử dụng củ sâm tươi Bố Chính đạt tuổi từ 3 năm trở lên, dáng rễ uốn lượn đẹp mắt ngâm cùng rượu nếp đã qua hệ thống xử lý điện từ trường khử độc tố Andehit.</p><h3>Giá trị mang lại:</h3><ul><li>Vừa là vật phẩm trang trí sang trọng cho phòng khách, vừa là bài thuốc đại bổ khí huyết.</li><li>Bổ thận, tráng dương, tăng cường đề kháng và kéo dài tuổi thọ.</li></ul>",
    reference_price: 2500000,
    unit: "Bình 3 lít",
    usage_info: "Uống 1-2 ly nhỏ mỗi ngày sau bữa ăn. Để nơi khô ráo thoáng mát.",
    disclaimer: "Sản phẩm quà biếu sang trọng chất lượng cao.",
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
    short_desc: "Chiết xuất cô đặc hàm lượng Saponin & chất nhầy cao, phục hồi sức khỏe nhanh cho người mới ốm dậy.",
    description: "<p><strong>Cao Sâm Bố Chính Bà Đen Cô Đặc</strong> được nấu cất theo quy trình nghiêm ngặt từ củ sâm tươi Tây Ninh giàu hoạt chất. Dạng cao sền sệt mượt mà, dễ hấp thu trực tiếp vào máu và hệ tiêu hóa.</p><h3>Tác dụng chính:</h3><ul><li>Phục hồi nhanh thể lực cho người bệnh sau phẫu thuật, người già suy nhược.</li><li>Bổ sung chất nhầy khớp xương, giảm đau nhức xương khớp.</li><li>Mát gan, giải nhiệt, hỗ trợ tiêu hóa tốt.</li></ul>",
    reference_price: 650000,
    unit: "Hũ 200g",
    usage_info: "Mỗi ngày pha 1-2 thìa cà phê (3-5g) với 100ml nước ấm, thêm mật ong nếu thích.",
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
    short_desc: "Củ Sâm Bố Chính sấy thăng hoa giữ 100% màu sắc & hoạt chất. Thay thế sâm Cao Ly Hàn Quốc.",
    description: "<p><strong>Sâm Bà Đen Sấy Khô Nguyên Củ</strong> được sản xuất bằng công nghệ sấy thăng hoa ở nhiệt độ âm. Phương pháp này giữ nguyên hình dáng củ, màu sắc tự nhiên và không làm phân hủy các hợp chất Saponin triterpenoid quý giá.</p><h3>Hướng dẫn chế biến:</h3><ul><li><strong>Hầm canh dưỡng sinh:</strong> Hầm cùng gà ác, chim cút, xương heo bổ dưỡng.</li><li><strong>Ngâm mật ong:</strong> Xắt lát mỏng ngâm mật ong rừng uống mỗi buổi sáng.</li><li><strong>Ngâm rượu:</strong> Ngâm cùng rượu nếp ngon 40 độ.</li></ul>",
    reference_price: 950000,
    unit: "Hộp 250g",
    usage_info: "Dùng 10-15g cho mỗi lần chế biến hầm canh hoặc hãm nước sôi uống.",
    disclaimer: "Hạn sử dụng 24 tháng. Bảo quản nơi khô ráo.",
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
    name: "Set Lẩu Sâm Bà Đen Thượng Hạng (4-6 người)",
    slug: "set-lau-sam-thuong-hang",
    short_desc: "Set lẩu dưỡng sinh cao cấp với Củ Sâm Bố Chính tươi Núi Bà Đen, Kỷ tử, Táo đỏ & Hạt sen.",
    description: "<p><strong>Set Lẩu Sâm Bà Đen Thượng Hạng</strong> mang đến trải nghiệm ẩm thực dưỡng sinh nổi tiếng của Nhà hàng Sâm Bà Đen Tây Ninh. Nước dùng thanh ngọt đượm vị sâm Bố Chính kết hợp cùng các vị thuốc bắc dưỡng thai bổ khí.</p><h3>Thành phần set:</h3><p>Củ sâm Bố Chính tươi Tây Ninh, Hoa sâm sấy lạnh, Kỷ tử đỏ, Táo đỏ Hàn Quốc, Hạt sen tươi, Gói cốt nước hầm lẩu sâm đặc chế.</p>",
    reference_price: 450000,
    unit: "Set 4-6 người",
    usage_info: "Hầm gói gia vị và sâm tươi cùng xương heo/gà trong 45 phút trước khi nhúng thịt & rau tươi.",
    disclaimer: "Bảo quản ngăn đông nếu chưa dùng ngay.",
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
    name: "Set Lẩu Sâm Bà Đen Gia Đình (2-4 người)",
    slug: "set-lau-sam-gia-dinh",
    short_desc: "Set lẩu sâm tươi thanh mát, mát gan giải nhiệt cho bữa ăn ấm cúng gia đình.",
    description: "<p><strong>Set Lẩu Sâm Bà Đen Gia Đình</strong> giúp các bà nội trợ dễ dàng chuẩn bị bữa ăn dưỡng sinh mát lành, thanh lọc cơ thể và nâng cao sức đề kháng cho cả nhà vào cuối tuần.</p>",
    reference_price: 290000,
    unit: "Set 2-4 người",
    usage_info: "Cho gói sâm tươi và cốt lẩu vào 1.5 - 2 lít nước hầm xương đun sôi.",
    disclaimer: "Chế biến đơn giản nhanh chóng.",
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
    name: "Trà Hoa Sâm Bà Đen (Tứ Vị)",
    slug: "tra-hoa-sam-ba-den",
    short_desc: "100% Hoa Sâm Bố Chính sấy lạnh (Saponin 22,7%) kết hợp Kỷ tử & Đông trùng hạ thảo. An thần ngủ ngon.",
    description: "<p><strong>Trà Hoa Sâm Bố Chính Bà Đen Farm</strong> được chế biến từ 100% hoa sâm Bố Chính tươi thu hái vào sáng sớm lúc vừa chớm nở, kết hợp cùng Kỷ tử và Đông trùng hạ thảo. Trà có hàm lượng <strong>Saponin cực cao 22,7%</strong> cùng 11 loại Acid Amin quý.</p><h3>Dưỡng chất nổi bật:</h3><ul><li><strong>Glycine (0.16%) & Threonine (0.147%):</strong> Hỗ trợ tiêu hóa, kháng viêm, kích thích sản sinh Collagen & Elastin cho làn da phụ nữ trung niên luôn căng mịn.</li><li><strong>Histidine (0.093%) & Valine (0.170%):</strong> An thần, giúp ngủ sâu giấc, giảm căng thẳng làm việc cường độ cao, cải thiện sinh lý nam nữ.</li><li><strong>Arginine (0.698%) & Cysteine:</strong> Cân bằng amoniac trong máu, bảo vệ tế bào gan, hạ men gan và giải độc tố bia rượu.</li><li><strong>Lysine (0.212%):</strong> Thúc đẩy tế bào tự phục hồi nhanh cho người mới phẫu thuật hoặc thể trạng yếu.</li></ul>",
    reference_price: 220000,
    unit: "Hũ 80g",
    usage_info: "Cho 5-6 bông hoa trà vào ly, rót 150-200ml nước sôi 90°C, hãm 3-5 phút. Có thể dùng nóng hoặc lạnh, thêm mật ong hoặc đường phèn tùy thích.",
    disclaimer: "Rất tốt cho người cao tuổi, người hay mất ngủ và người làm việc văn phòng.",
    status: "published",
    category: { id: "c-3", name: "Trà Dược Liệu", slug: "tra-duoc-lieu" },
    images: [
      { id: "img-10", image_url: "/images/products/tra-hoa-sam.png", alt_text: "Trà Hoa Sâm Bà Đen", is_primary: true, sort_order: 1 }
    ],
    seo: { title: "Trà Hoa Sâm Bà Đen (Tứ Vị)", robots: "index,follow" },
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

    const savedPortalProducts = localStorage.getItem("custom_mock_products");
    let activeProducts: ProductDetail[] = MOCK_PRODUCTS;

    if (savedPortalProducts) {
      try {
        const portalProds = JSON.parse(savedPortalProducts);
        activeProducts = portalProds.map((p: any) => {
          const foundMock = MOCK_PRODUCTS.find(m => m.id === p.id);
          const slug = p.slug || p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return {
            id: p.id,
            name: p.name,
            slug: slug,
            short_desc: p.description || p.short_desc || "",
            description: p.description || foundMock?.description || "",
            reference_price: p.base_price ?? p.reference_price,
            unit: p.unit || "Hộp",
            status: "published",
            category: foundMock?.category || { id: "c-1", name: "Sâm Chế Biến Sâu", slug: "che-bien-sau" },
            images: [
              { id: `img-${p.id}`, image_url: p.image_url || "/images/products/bot-sam.jpg", alt_text: p.name, is_primary: true, sort_order: 1 }
            ],
            seo: { title: p.name, robots: "index,follow" },
            json_ld: [],
            related: []
          };
        });
      } catch {
        activeProducts = MOCK_PRODUCTS;
      }
    }

    const listItems: ProductListItem[] = activeProducts.map((p) => ({
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

    const savedPortalProducts = localStorage.getItem("custom_mock_products");
    let activeProducts: ProductDetail[] = MOCK_PRODUCTS;

    if (savedPortalProducts) {
      try {
        const portalProds = JSON.parse(savedPortalProducts);
        activeProducts = portalProds.map((p: any) => {
          const foundMock = MOCK_PRODUCTS.find(m => m.id === p.id);
          const pSlug = p.slug || p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return {
            id: p.id,
            name: p.name,
            slug: pSlug,
            short_desc: p.description || p.short_desc || "",
            description: p.description || foundMock?.description || `<p>${p.name}</p>`,
            reference_price: p.base_price ?? p.reference_price,
            unit: p.unit || "Hộp",
            status: "published",
            category: foundMock?.category || { id: "c-1", name: "Sâm Chế Biến Sâu", slug: "che-bien-sau" },
            images: [
              { id: `img-${p.id}`, image_url: p.image_url || "/images/products/bot-sam.jpg", alt_text: p.name, is_primary: true, sort_order: 1 }
            ],
            seo: { title: p.name, robots: "index,follow" },
            json_ld: [],
            related: []
          };
        });
      } catch {
        activeProducts = MOCK_PRODUCTS;
      }
    }

    const found = activeProducts.find((p) => p.slug === slug || p.id === slug);
    if (!found) return null;
    return {
      ...found,
      related: activeProducts.filter((p) => p.slug !== found.slug).slice(0, 3).map((p) => ({
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
