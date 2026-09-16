import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ResponsiveImage from "../components/ResponsiveImage";
import Seo from "../components/Seo";
import { fmtVnd, product, type ProductDetail } from "../lib/api";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [p, setP] = useState<ProductDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    queueMicrotask(() => {
      setP(null);
      setNotFound(false);
      setActiveImg(0);
    });
    void product
      .detail(slug)
      .then((x) => (x ? setP(x) : setNotFound(true)))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="container section">
        <h1>Không tìm thấy sản phẩm</h1>
        <p className="muted">
          <Link to="/san-pham">Quay lại danh sách sản phẩm</Link>
        </p>
      </div>
    );
  }
  if (!p) {
    return (
      <div className="container section">
        <p className="muted">Đang tải…</p>
      </div>
    );
  }

  const images = p.images.length
    ? p.images
    : [{ id: "ph", image_url: "", alt_text: p.name, is_primary: true, sort_order: 0 }];

  return (
    <article>
      <Seo seo={p.seo} jsonLd={p.json_ld} />

      <div className="container product-detail">
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>{" "}
          <Link to="/san-pham">Sản phẩm</Link> <span>/</span>{" "}
          <Link to={`/san-pham?danh-muc=${p.category.slug}`}>
            {p.category.name}
          </Link>
        </nav>

        <div className="pd-grid">
          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-main-img">
              {images[activeImg].image_url ? (
                <ResponsiveImage
                  src={images[activeImg].image_url}
                  alt={p.name}
                  sizes="(max-width: 768px) 100vw, 600px"
                  loading="eager"
                />
              ) : (
                <div className="pd-ph">SBĐ</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((im, i) => (
                  <button
                    key={im.id}
                    className={"pd-thumb" + (i === activeImg ? " active" : "")}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Ảnh ${i + 1}`}
                  >
                    <ResponsiveImage src={im.image_url} alt="" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <span className="article-cat">{p.category.name}</span>
            <h1 className="pd-title">{p.name}</h1>
            {p.short_desc && <p className="pd-short">{p.short_desc}</p>}

            <div className="pd-price-box">
              <span className="pd-price">{fmtVnd(p.reference_price)}</span>
              {p.unit && <span className="pd-unit">/ {p.unit}</span>}
            </div>

            <div className="pd-cta">
              <a href="#lien-he" className="btn btn-primary">
                Liên hệ đặt mua
              </a>
              <a href="#lien-he" className="btn btn-outline">
                Nhận tư vấn
              </a>
            </div>

            {p.usage_info && (
              <div className="pd-section">
                <h3>Hướng dẫn sử dụng</h3>
                <p>{p.usage_info}</p>
              </div>
            )}

            <div className="pd-section pd-terms-box" style={{ background: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px 20px", marginTop: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary-color, #1a4d2e)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>📜</span> Điều khoản & Cam kết mua hàng
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", lineHeight: "1.7", color: "#444" }}>
                <li style={{ marginBottom: "6px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ color: "#2e7d32", fontWeight: "bold" }}>✓</span>
                  <span><strong>Kiểm tra hàng trước khi thanh toán:</strong> Quý khách được mở kiểm tra đúng loại và tình trạng sản phẩm trước khi thanh toán (COD toàn quốc).</span>
                </li>
                <li style={{ marginBottom: "6px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ color: "#2e7d32", fontWeight: "bold" }}>✓</span>
                  <span><strong>Đổi trả 1-1 trong 7 ngày:</strong> Đổi mới 100% miễn phí nếu sản phẩm có lỗi bao bì hoặc rủi ro vận chuyển.</span>
                </li>
                <li style={{ marginBottom: "6px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ color: "#2e7d32", fontWeight: "bold" }}>✓</span>
                  <span><strong>Sản phẩm OCOP 4 Sao:</strong> 100% Sâm Bố Chính hữu cơ Núi Bà Đen, Tây Ninh.</span>
                </li>
              </ul>
              <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px dashed #cbd5e1" }}>
                <Link to="/dieu-khoan-su-dung" style={{ fontSize: "13px", color: "var(--primary-color, #1a4d2e)", fontWeight: "600", textDecoration: "underline" }}>
                  Xem chi tiết Điều khoản sử dụng chính thức →
                </Link>
              </div>
            </div>

            {p.disclaimer && <p className="disclaimer">{p.disclaimer}</p>}
          </div>
        </div>

        {/* Mô tả chi tiết */}
        {p.description && (
          <div className="pd-description">
            <h2>Mô tả sản phẩm</h2>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: p.description }}
            />
          </div>
        )}
      </div>

      {/* Liên quan */}
      {p.related.length > 0 && (
        <div className="container section">
          <h2 className="related-head">Sản phẩm liên quan</h2>
          <div className="prod-grid">
            {p.related.map((r) => (
              <Link
                key={r.id}
                to={`/san-pham/${r.slug}`}
                className="prod-card"
              >
                <div className="prod-card-img">
                  {r.primary_image ? (
                    <ResponsiveImage
                      src={r.primary_image}
                      alt={r.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="prod-card-ph">SBĐ</div>
                  )}
                </div>
                <div className="prod-card-body">
                  <span className="prod-card-cat">{r.category.name}</span>
                  <h3>{r.name}</h3>
                  <div className="prod-card-foot">
                    <span className="prod-price">
                      {fmtVnd(r.reference_price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
