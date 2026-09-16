import { useState } from "react";
import { Link } from "react-router-dom";

import ResponsiveImage from "../components/ResponsiveImage";
import Seo from "../components/Seo";

const SITE = import.meta.env.VITE_SITE_URL ?? "http://localhost:4174";

const CERTIFICATES = [
  { title: "Giấy chứng nhận OCOP 4 Sao — Bột Sâm Bố Chính", src: "/images/ocop/1. sp ocop.png", width: 1086, height: 1448 },
  { title: "Giấy chứng nhận OCOP 4 Sao — Trà Sâm Bà Đen", src: "/images/ocop/2. sp ocop.png", width: 1086, height: 1448 },
  { title: "Giấy chứng nhận OCOP 4 Sao — Rượu Sâm Bố Chính", src: "/images/ocop/3. sp ocop.png", width: 1086, height: 1448 },
  { title: "Giấy chứng nhận OCOP 4 Sao — Cao Sâm Bố Chính", src: "/images/ocop/4. sp ocop.png", width: 1086, height: 1448 },
  { title: "Giấy chứng nhận OCOP 4 Sao — Sâm Sấy Khô", src: "/images/ocop/5. sp ocop.png", width: 1086, height: 1448 },
  { title: "Giấy chứng nhận OCOP 4 Sao — Trà Hoa Sâm", src: "/images/ocop/6. sp ocop.png", width: 1086, height: 1448 },
  { title: "Giấy chứng nhận OCOP 4 Sao — Lẩu Sâm Dưỡng Sinh", src: "/images/ocop/7. sp ocop.png", width: 1089, height: 1445 },
  { title: "Giấy chứng nhận Cơ sở đủ điều kiện An toàn Thực phẩm", src: "/images/ocop/Giay ATVSTP.png", width: 995, height: 1581 },
  { title: "Chứng nhận Sản phẩm Nông nghiệp Tiêu biểu Cấp Tỉnh", src: "/images/ocop/1. CC SP tieu bieu.jpg", width: 1080, height: 1440 },
  { title: "Bằng khen Sản phẩm Nông nghiệp Tiêu biểu", src: "/images/ocop/sp tieu bieu.png", width: 1086, height: 1448 },
  { title: "Chứng nhận Top Sản phẩm Tiêu biểu 2022", src: "/images/ocop/sp top.png", width: 1105, height: 1423 },
  { title: "Chứng nhận Top Sản phẩm Tiêu biểu 2023", src: "/images/ocop/sp top 2.png", width: 1096, height: 1435 },
];

const VALUES = [
  {
    icon: "🌿",
    title: "Hữu cơ",
    desc: "Canh tác hoàn toàn hữu cơ — tuyệt đối không dùng phân hóa học hay thuốc bảo vệ thực vật.",
  },
  {
    icon: "🛡️",
    title: "An toàn",
    desc: "Đạt chuẩn OCOP 4 sao, VietGAP, GlobalGAP và ISO 22000 — kiểm định chất lượng từng lô.",
  },
  {
    icon: "🔬",
    title: "Khoa học",
    desc: "Hàm lượng Saponin tổng đạt 15,2 mg/g. Nghiên cứu bài bản từ 2015, hợp tác viện dược liệu.",
  },
  {
    icon: "🤝",
    title: "Cộng đồng",
    desc: "Liên kết với nông dân 4 huyện Tây Ninh (Gò Dầu, Dương Minh Châu, Châu Thành, Tân Biên).",
  },
];

const MILESTONES = [
  { year: "2015", event: "Khảo sát, nghiên cứu thử nghiệm sâm Bố Chính trên vùng đất Tây Ninh" },
  { year: "2019", event: "Hình thành vùng trồng thử nghiệm đầu tiên 1,2 ha tại chân Núi Bà Đen" },
  { year: "2020", event: "Thành lập Công ty Cổ phần Bà Đen Farm — bà Huỳnh Thị Mỹ Hạnh làm Giám đốc" },
  { year: "2020", event: "Ra mắt Nhà hàng Sâm Bà Đen — phục vụ các món ăn kết hợp sâm Bố Chính" },
  { year: "2021", event: "Đạt danh hiệu Sản phẩm Công nghiệp Nông thôn Tiêu biểu cấp tỉnh" },
  { year: "2022", event: "Đạt chứng nhận OCOP 4 sao tỉnh Tây Ninh, mở rộng 10+ hecta vùng trồng" },
  { year: "2023", event: "Đạt GlobalGAP, ISO 22000 — triển khai QR Code truy xuất nguồn gốc" },
  { year: "2024", event: "Mở rộng mạng lưới đại lý toàn quốc, phát triển dòng sản phẩm chế biến sâu" },
];

export default function About() {
  const [selectedCert, setSelectedCert] = useState<{ title: string; src: string; width: number; height: number } | null>(null);

  return (
    <>
      <Seo
        seo={{
          title: "Giới thiệu — Bà Đen Farm | Sâm Bố Chính Tây Ninh",
          description:
            "Công ty Cổ phần Bà Đen Farm — người tiên phong trồng và chế biến Sâm Bố Chính tại Núi Bà Đen, Tây Ninh. OCOP 4 sao, hữu cơ, an toàn.",
          canonical_url: SITE + "/gioi-thieu",
          robots: "index,follow",
        }}
      />

      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero-inner">
          <nav className="breadcrumb breadcrumb-light">
            <Link to="/">Trang chủ</Link> <span>/</span> <span>Giới thiệu</span>
          </nav>
          <span className="hero-eyebrow">Về chúng tôi</span>
          <h1 className="about-hero-title">
            Câu chuyện
            <br />
            <em>Bà Đen Farm</em>
          </h1>
          <p className="about-hero-sub">
            Từ năm 2015, bà Huỳnh Thị Mỹ Hạnh đã dày công nghiên cứu và gây
            dựng vùng trồng Sâm Bố Chính tại chân Núi Bà Đen, Tây Ninh —
            biến dược liệu quý thành sản phẩm hữu cơ chuẩn OCOP cho người Việt.
          </p>
        </div>
        <div className="about-hero-overlay" aria-hidden="true" />
      </section>

      {/* Sứ mệnh - Trang 1 Full-Width */}
      <section className="container section">
        <div className="about-mission-grid">
          <div className="about-mission-text">
            <span className="section-label">Sứ mệnh</span>
            <h2>Sâm Bố Chính Việt — Từ Đất Tây Ninh</h2>
            <p>
              Bà Đen Farm tiên phong nghiên cứu và phát triển cây Sâm Bố Chính
              — loài dược liệu quý đã được ghi chép trong y học cổ truyền Việt
              Nam hàng trăm năm. Đưa Nhân Sâm Việt đến với người Việt, mang lại
              lợi ích kinh tế cho nông dân Tây Ninh và góp phần thay đổi bộ mặt Dược liệu sạch Việt Nam.
            </p>
            <p>
              Mỗi sản phẩm đều trải qua canh tác hữu cơ nghiêm ngặt, kiểm định
              độc lập và cấp mã QR truy xuất nguồn gốc — để người dùng có thể
              tin tưởng từng gram sâm.
            </p>
          </div>
          <div className="about-mission-stats">
            <div className="stat-block">
              <span className="stat-number">2015</span>
              <span className="stat-desc">năm bắt đầu nghiên cứu</span>
            </div>
            <div className="stat-block">
              <span className="stat-number">10+</span>
              <span className="stat-desc">hecta vùng trồng tại Tây Ninh</span>
            </div>
            <div className="stat-block">
              <span className="stat-number">OCOP</span>
              <span className="stat-desc">4 sao — Tây Ninh công nhận</span>
            </div>
            <div className="stat-block">
              <span className="stat-number">15.2</span>
              <span className="stat-desc">mg/g Saponin tổng</span>
            </div>
          </div>
        </div>

        {/* Khối Sứ Mệnh - Full Width */}
        <div style={{ marginTop: '48px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px 24px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '8px' }}>Nền tảng phát triển</span>
          <h2 style={{ fontSize: '28px', color: 'var(--green-800)', marginBottom: '16px' }}>SỨ MỆNH (MISSION) — BÀ ĐEN FARM</h2>
          <p style={{ color: 'var(--text-soft)', maxWidth: '800px', margin: '0 auto 28px', fontSize: '16px', lineHeight: '1.7' }}>
            "Vì sức khỏe cộng đồng, lan tỏa giá trị dược liệu Việt và xây dựng nền nông nghiệp bền vững từ Sâm Bố Chính tại Tây Ninh."
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ResponsiveImage
              src="/images/su-menh.png"
              alt="Infographic Sứ mệnh Bà Đen Farm"
              sizes="(max-width: 1050px) 100vw, 1050px"
              width={1536}
              height={1024}
              style={{ width: '100%', maxWidth: '1050px', height: 'auto', borderRadius: '12px', boxShadow: '0 6px 24px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>
      </section>

      {/* Tầm nhìn - Trang 2 Full-Width */}
      <section className="container section" style={{ paddingTop: 0 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px 24px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '8px' }}>Định hướng chiến lược</span>
          <h2 style={{ fontSize: '28px', color: 'var(--green-800)', marginBottom: '16px' }}>TẦM NHÌN (VISION) — BÀ ĐEN FARM</h2>
          <p style={{ color: 'var(--text-soft)', maxWidth: '850px', margin: '0 auto 28px', fontSize: '16px', lineHeight: '1.7' }}>
            Trở thành đơn vị uy tín và tiên phong trong ngành Dược liệu sạch tại Việt Nam. Khát vọng đưa sản phẩm Dược liệu Việt Nam vươn tầm quốc tế (Nhật Bản, Hàn Quốc, Mỹ, Châu Âu và Úc).
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ResponsiveImage
              src="/images/tam-nhin.png"
              alt="Infographic Tầm nhìn Bà Đen Farm"
              sizes="(max-width: 1050px) 100vw, 1050px"
              width={1536}
              height={1024}
              style={{ width: '100%', maxWidth: '1050px', height: 'auto', borderRadius: '12px', boxShadow: '0 6px 24px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="about-values-section">
        <div className="container section">
          <div className="about-values-head">
            <span className="section-label">Giá trị cốt lõi</span>
            <h2>Những điều chúng tôi kiên định</h2>
          </div>
          <div className="about-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="about-value-card">
                <span className="about-value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hành trình */}
      <section className="container section">
        <div className="about-timeline-head">
          <span className="section-label">Hành trình</span>
          <h2>Cột mốc phát triển</h2>
        </div>
        <div className="about-timeline">
          {MILESTONES.map((m, i) => (
            <div key={`${m.year}-${i}`} className="tl-item" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="tl-dot" />
              <div className="tl-content">
                <span className="tl-year">{m.year}</span>
                <p>{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bộ sưu tập Chứng nhận OCOP 4 sao & Danh hiệu */}
      <section className="container section" style={{ paddingTop: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="section-label">Hồ sơ pháp lý & Uy tín</span>
          <h2 style={{ fontSize: '30px', margin: '8px 0 12px', color: 'var(--green-900)' }}>Chứng Nhận OCOP 4 Sao & Bằng Khen Tiêu Biểu</h2>
          <p style={{ color: 'var(--text-soft)', maxWidth: '720px', margin: '0 auto' }}>
            Toàn bộ sản phẩm Sâm Bố Chính Bà Đen Farm đều đạt chứng nhận OCOP 4 Sao do UBND tỉnh Tây Ninh trao tặng, cùng chứng nhận An toàn Thực phẩm & Bằng khen tiêu biểu. Click vào hình để xem chi tiết.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {CERTIFICATES.map((cert, index) => (
            <div
              key={index}
              onClick={() => setSelectedCert(cert)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
            >
              <div style={{ width: '100%', height: '260px', overflow: 'hidden', borderRadius: 'var(--radius-sm)', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveImage
                  src={cert.src}
                  alt={cert.title}
                  sizes="(max-width: 640px) 45vw, 260px"
                  width={cert.width}
                  height={cert.height}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginTop: '12px', color: 'var(--text)', lineHeight: '1.4' }}>
                {cert.title}
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--green-700)', marginTop: '6px', fontWeight: 500 }}>
                🔍 Click xem phóng to
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal phóng to hình ảnh chứng nhận */}
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              maxHeight: '90vh',
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setSelectedCert(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#333'
              }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green-900)', marginBottom: '16px', paddingRight: '40px', textAlign: 'center' }}>
              {selectedCert.title}
            </h3>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', width: '100%' }}>
              <ResponsiveImage
                src={selectedCert.src}
                alt={selectedCert.title}
                sizes="900px"
                loading="eager"
                width={selectedCert.width}
                height={selectedCert.height}
                style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="about-cta-section">
        <div className="container about-cta-inner">
          <h2>Sẵn sàng trải nghiệm?</h2>
          <p>
            Khám phá sản phẩm hoặc liên hệ để được tư vấn phù hợp nhất.
          </p>
          <div className="about-cta-btns">
            <Link to="/san-pham" className="btn btn-primary">
              Xem sản phẩm
            </Link>
            <Link to="/lien-he" className="btn btn-outline">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

