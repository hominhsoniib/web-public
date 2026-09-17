import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ResponsiveImage from "../components/ResponsiveImage";
import Seo from "../components/Seo";
import YouTubeFacade from "../components/YouTubeFacade";
import { blog, fmtDate, product, type PostListItem, type ProductListItem } from "../lib/api";
import { fmtVnd } from "../lib/api";

const SITE = import.meta.env.VITE_SITE_URL ?? "http://localhost:4174";

const INTRO_VIDEOS = [
  { id: "wtxXklOBhgE", title: "Triển vọng từ cây sâm Bố Chính trên đất Tây Ninh | TayNinhTV", category: "Phóng sự Truyền hình" },
  { id: "-vmvlboyWPQ", title: "Hành trình SÂM BỐ CHÍNH đến với Tây Ninh | Trò chuyện cùng Doanh nhân", category: "Phóng sự Truyền hình" },
  { id: "pp4PH2AByZk", title: "Khát vọng mùa vàng - Mô hình khởi nghiệp từ sâm Bố Chính Bà Đen", category: "Phóng sự Truyền hình" },
  { id: "t7tI6t-nH5E", title: "Trồng sâm Bố Chính lấy hoa mang lại hiệu quả kinh tế cao", category: "Phóng sự Truyền hình" },
  { id: "qD9Hduf7tP4", title: "Triển vọng phát triển cây sâm Bố Chính gắn với du lịch Tây Ninh", category: "Phóng sự Truyền hình" },
  { id: "HB6Eb67gz1I", title: "Gỏi hoa sâm Bố Chính xé phay | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
  { id: "Pyv__M0hrco", title: "Đậu hũ nhồi sâm Bố Chính | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
  { id: "30WM2x-omZ0", title: "Súp sâm Tiến Vua thượng hạng | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
  { id: "0bQ9ugJJ2rI", title: "Sâm sốt giấy bạc bổ dưỡng | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
  { id: "TFXPcn9pA9g", title: "Trailer Chay Việt Tinh Hoa — Sâm sốt giấy bạc", category: "Ẩm thực Sâm" },
  { id: "Np1ZAqhOmUw", title: "Lẩu Tiến Vua Sâm Bố Chính | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
  { id: "4nfNfRplQYE", title: "Trailer Chay Việt Tinh Hoa — Sâm xiên que", category: "Ẩm thực Sâm" },
  { id: "wauNYzVY9Zs", title: "Lá kim cuộn sâm Bố Chính | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
  { id: "l36sI61emB4", title: "Cải thảo bọc sâm ngũ sắc | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
  { id: "BA0d2Jp1Gv8", title: "Gỏi Tiến Vua Sâm Bố Chính | Chay Việt Tinh Hoa", category: "Ẩm thực Sâm" },
];

export default function Home() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [vidCategory, setVidCategory] = useState<string>("all");

  useEffect(() => {
    void blog.list(undefined, 1).then(({ items }) => setPosts(items.slice(0, 3)));
    void product.list().then((items) => setProducts(items.slice(0, 3)));
  }, []);

  const filteredVideos = vidCategory === "all"
    ? INTRO_VIDEOS
    : INTRO_VIDEOS.filter((v) => v.category === vidCategory);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sâm Bà Đen",
    url: SITE,
    description:
      "Dược liệu Sâm Bà Đen bản địa từ vùng Núi Bà Đen, Tây Ninh.",
  };

  return (
    <>
      <Seo
        seo={{
          title: "Sâm Bà Đen — Báu vật dược liệu từ Núi Thiêng Nam Bộ",
          description:
            "Sâm Bà Đen — dược liệu bản địa quý từ vùng Núi Bà Đen, Tây Ninh. An toàn, chất lượng, gắn với câu chuyện núi thiêng.",
          canonical_url: SITE + "/",
          robots: "index,follow",
        }}
        jsonLd={[orgJsonLd]}
      />

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <span className="hero-eyebrow">Dược liệu bản địa · OCOP Tây Ninh</span>
          <h1 className="hero-title">
            Báu vật dược liệu
            <br />
            từ Núi Thiêng Nam Bộ
          </h1>
          <p className="hero-sub">
            Sâm Bà Đen mang trong mình tinh túy của vùng Núi Bà Đen — được
            chăm trồng tự nhiên, an toàn và gìn giữ theo cách của người Việt.
          </p>
          <div className="hero-cta">
            <Link to="/blog" className="btn btn-primary">
              Tìm hiểu kiến thức
            </Link>
            <a href="#lien-he" className="btn btn-outline">
              Nhận tư vấn
            </a>
          </div>
        </div>
        <div className="hero-ridge" aria-hidden="true" />
      </section>

      {/* Thanh tin cậy */}
      <section className="container trust-row">
        {["Chứng nhận OCOP", "Vùng trồng Núi Bà Đen", "Quy trình tự nhiên", "Người Việt dùng sâm Việt"].map(
          (t) => (
            <div key={t} className="trust-item">
              {t}
            </div>
          ),
        )}
      </section>

      {/* Sản phẩm nổi bật */}
      {products.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2>Sản phẩm nổi bật</h2>
            <Link to="/san-pham" className="section-link">
              Xem tất cả →
            </Link>
          </div>
          <div className="prod-grid">
            {products.map((p) => (
              <Link key={p.id} to={`/san-pham/${p.slug}`} className="prod-card">
                <div className="prod-card-img">
                  {p.primary_image ? (
                    <ResponsiveImage
                      src={p.primary_image}
                      alt={p.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="prod-card-ph">SBĐ</div>
                  )}
                </div>
                <div className="prod-card-body">
                  <span className="prod-card-cat">{p.category.name}</span>
                  <h3>{p.name}</h3>
                  {p.short_desc && <p>{p.short_desc}</p>}
                  <div className="prod-card-foot">
                    <span className="prod-price">
                      {fmtVnd(p.reference_price)}
                      {p.unit && <span className="prod-unit"> / {p.unit}</span>}
                    </span>
                    <span className="prod-cta">Xem →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Blog mới nhất */}
      <section className="container section">
        <div className="section-head">
          <h2>Kiến thức &amp; Câu chuyện</h2>
          <Link to="/blog" className="section-link">
            Xem tất cả →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="muted">Chưa có bài viết.</p>
        ) : (
          <div className="post-grid">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="post-card">
                <div className="post-card-cover">
                  {p.cover_image_url ? (
                    <ResponsiveImage
                      src={p.cover_image_url}
                      alt={p.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="post-card-placeholder">SBĐ</div>
                  )}
                </div>
                <div className="post-card-body">
                  <span className="post-card-cat">{p.category.name}</span>
                  <h3>{p.title}</h3>
                  {p.excerpt && <p>{p.excerpt}</p>}
                  <span className="post-card-date">
                    {fmtDate(p.published_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Video giới thiệu & Truyền hình */}
      <section className="container section">
        <div className="section-head" style={{ marginBottom: "24px" }}>
          <div>
            <h2>Thước Phim & Truyền hình Đưa Tin</h2>
            <p className="muted" style={{ marginTop: "4px" }}>
              Khám phá vùng trồng Sâm Bố Chính Tây Ninh qua các phóng sự VTV, TayNinhTV và ẩm thực Sâm Tiến Vua
            </p>
          </div>
        </div>

        {/* Local HD Feature Video */}
        <div style={{ marginBottom: "40px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", background: "#000" }}>
          <video
            controls
            preload="metadata"
            poster="/images/su-menh-1200w.webp"
            style={{ width: "100%", maxHeight: "500px", display: "block", objectFit: "cover" }}
          >
            <source src="/videos/sam-bo-chinh-tay-ninh-full.mp4" type="video/mp4" />
            <source src="/videos/clips-gioi-thieu-bdf-v2.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        </div>

        {/* Tab Filters */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
          <button
            type="button"
            onClick={() => setVidCategory("all")}
            className={`btn ${vidCategory === "all" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "20px", padding: "8px 18px", fontSize: "14px" }}
          >
            📺 Tất cả Video (15)
          </button>
          <button
            type="button"
            onClick={() => setVidCategory("Phóng sự Truyền hình")}
            className={`btn ${vidCategory === "Phóng sự Truyền hình" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "20px", padding: "8px 18px", fontSize: "14px" }}
          >
            🎥 Phóng sự Truyền hình (5)
          </button>
          <button
            type="button"
            onClick={() => setVidCategory("Ẩm thực Sâm")}
            className={`btn ${vidCategory === "Ẩm thực Sâm" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "20px", padding: "8px 18px", fontSize: "14px" }}
          >
            🍲 Ẩm thực Sâm Tiến Vua (10)
          </button>
        </div>

        <div className="video-grid">
          {filteredVideos.map((v) => (
            <div key={v.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <YouTubeFacade videoId={v.id} title={v.title} />
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1b4d3e" }}>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", marginRight: "6px" }}>
                  {v.category}
                </span>
                {v.title}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
