import { Link } from "react-router-dom";

import Seo from "../components/Seo";

const SITE = import.meta.env.VITE_SITE_URL ?? "http://localhost:4174";

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
            <img 
              src="/images/su-menh.png" 
              alt="Infographic Sứ mệnh Bà Đen Farm" 
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
            <img 
              src="/images/tam-nhin.png" 
              alt="Infographic Tầm nhìn Bà Đen Farm" 
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
