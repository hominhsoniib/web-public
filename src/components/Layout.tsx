import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import ResponsiveImage from "./ResponsiveImage";
import { getActivePartners, type PartnerItem } from "../lib/partners";

const FB_URL = "https://www.facebook.com/people/S%C3%A2m-B%E1%BB%91-Ch%C3%ADnh-B%C3%A0-%C4%90en-Farm/100076325312382/";

export const POLICY_ITEMS = [
  { id: "bao-hanh", label: "Chính Sách Bảo Hành", icon: "🛡️" },
  { id: "doi-tra", label: "Chính sách đổi trả", icon: "🔄" },
  { id: "thanh-toan", label: "Chính sách thanh toán", icon: "💳" },
  { id: "ban-hang", label: "Chính sách bán hàng", icon: "🛒" },
  { id: "kiem-tra-hang", label: "Chính Sách Kiểm Tra Hàng", icon: "🔍" },
  { id: "bao-mat", label: "Chính sách bảo mật", icon: "🔒" },
  { id: "van-chuyen", label: "Chính sách vận chuyển và giao nhận", icon: "🚚" },
];

export const PARTNER_ITEMS = [
  { id: "htx-369", label: "HTX GD 369", url: "https://369-daotao.vercel.app/", icon: "🏫" },
];

const NAV_LINKS = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/san-pham", label: "Sản phẩm" },
  { to: "/vung-trong", label: "Vùng trồng" },
  { to: "/dai-ly", label: "Đại lý" },
  { to: "/blog", label: "Blog" },
  { to: "/dieu-khoan-su-dung", label: "ĐIỀU KHOẢN SỬ DỤNG", hasDropdown: true },
  { to: "#partner", label: "Đối tác", hasPartnerDropdown: true },
  { to: "https://sambochinh.badenfarm.com.vn/", label: "Landing Page", external: true },
  { to: "/lien-he", label: "Liên hệ" },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const [mobilePolicyOpen, setMobilePolicyOpen] = useState(false);
  const [mobilePartnerOpen, setMobilePartnerOpen] = useState(false);
  const [partners, setPartners] = useState<PartnerItem[]>(() => getActivePartners());

  useEffect(() => {
    const handleUpdate = () => {
      setPartners(getActivePartners());
    };
    window.addEventListener("partners_updated", handleUpdate);
    return () => window.removeEventListener("partners_updated", handleUpdate);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="site-logo" onClick={() => setMobileOpen(false)}>
            <ResponsiveImage
              src="/images/logo-black.png"
              alt="Bà Đen Farm"
              sizes="40px"
              loading="eager"
              style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "8px" }}
            />
            <span className="site-logo-name">Bà Đen Farm</span>
          </Link>

          {/* Desktop nav */}
          <nav className="site-nav">
            {NAV_LINKS.map((n) => {
              if (n.external) {
                return (
                  <a
                    key={n.to}
                    href={n.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-nav-link"
                  >
                    {n.label}
                  </a>
                );
              }

              if (n.hasDropdown) {
                return (
                  <div
                    key={n.to}
                    className="nav-dropdown-wrapper"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <NavLink
                      to={n.to}
                      className={({ isActive }) =>
                        isActive ? "site-nav-link active" : "site-nav-link"
                      }
                    >
                      <span>{n.label}</span>
                      <span style={{ fontSize: "10px", marginLeft: "2px", transition: "transform 0.2s ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </NavLink>

                    {dropdownOpen && (
                      <div className="nav-dropdown-menu">
                        {POLICY_ITEMS.map((item) => (
                          <Link
                            key={item.id}
                            to={`/dieu-khoan-su-dung?tab=${item.id}`}
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <span className="dropdown-icon">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (n.hasPartnerDropdown) {
                return (
                  <div
                    key={n.to}
                    className="nav-dropdown-wrapper"
                    onMouseEnter={() => setPartnerDropdownOpen(true)}
                    onMouseLeave={() => setPartnerDropdownOpen(false)}
                  >
                    <span
                      className="site-nav-link"
                      style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                    >
                      <span>{n.label}</span>
                      <span style={{ fontSize: "10px", marginLeft: "2px", transition: "transform 0.2s ease", transform: partnerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </span>

                    {partnerDropdownOpen && (
                      <div className="nav-dropdown-menu" style={{ width: "240px" }}>
                        {partners.length === 0 ? (
                          <div style={{ padding: "10px 14px", fontSize: "13px", color: "#64748b" }}>Chưa có đối tác</div>
                        ) : (
                          partners.map((item) => (
                            <a
                              key={item.id}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="dropdown-item"
                              onClick={() => setPartnerDropdownOpen(false)}
                            >
                              <span className="dropdown-icon">{item.icon || "🏫"}</span>
                              <span>{item.name}</span>
                              <span style={{ marginLeft: "auto", fontSize: "12px", opacity: 0.6 }}>↗</span>
                            </a>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    isActive ? "site-nav-link active" : "site-nav-link"
                  }
                >
                  {n.label}
                </NavLink>
              );
            })}
          </nav>

          <Link to="/lien-he" className="btn btn-primary site-cta">
            Tư vấn
          </Link>

          {/* Hamburger */}
          <button
            className={`hamburger ${mobileOpen ? "hamburger-open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile nav overlay — cố ý đặt NGOÀI <header> (không còn là con của phần tử có
          backdrop-filter). backdrop-filter tạo containing block mới cho con position:fixed,
          khiến inset: 68px 0 0 0 tính theo chiều cao ~68px của header (không phải viewport)
          và co box xuống 0px chiều cao — kết hợp overflow-y: auto (thêm ở commit 9c7d4f8)
          khiến menu bị clip vô hình dù state mobileOpen vẫn đúng. Xem thêm ghi chú audit
          "bug mobile menu ando" — không lồng lại phần tử này vào trong header nữa. */}
      {mobileOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)}>
          <nav
            className="mobile-nav"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map((n) => {
              if (n.external) {
                return (
                  <a
                    key={n.to}
                    href={n.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {n.label}
                  </a>
                );
              }

              if (n.hasDropdown) {
                return (
                  <div key={n.to}>
                    <button
                      className="mobile-nav-link"
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                      onClick={() => setMobilePolicyOpen(!mobilePolicyOpen)}
                    >
                      <span>{n.label}</span>
                      <span>{mobilePolicyOpen ? "▲" : "▼"}</span>
                    </button>
                    {mobilePolicyOpen && (
                      <div style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px", margin: "4px 0" }}>
                        {POLICY_ITEMS.map((item) => (
                          <Link
                            key={item.id}
                            to={`/dieu-khoan-su-dung?tab=${item.id}`}
                            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", fontSize: "14px", color: "#334155", borderRadius: "6px" }}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobilePolicyOpen(false);
                            }}
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (n.hasPartnerDropdown) {
                return (
                  <div key={n.to}>
                    <button
                      className="mobile-nav-link"
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                      onClick={() => setMobilePartnerOpen(!mobilePartnerOpen)}
                    >
                      <span>{n.label}</span>
                      <span>{mobilePartnerOpen ? "▲" : "▼"}</span>
                    </button>
                    {mobilePartnerOpen && (
                      <div style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px", margin: "4px 0" }}>
                        {partners.length === 0 ? (
                          <div style={{ padding: "8px 12px", fontSize: "13px", color: "#64748b" }}>Chưa có đối tác</div>
                        ) : (
                          partners.map((item) => (
                            <a
                              key={item.id}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", fontSize: "14px", color: "#334155", borderRadius: "6px", textDecoration: "none" }}
                              onClick={() => {
                                setMobileOpen(false);
                                setMobilePartnerOpen(false);
                              }}
                            >
                              <span>{item.icon || "🏫"}</span>
                              <span>{item.name}</span>
                              <span style={{ marginLeft: "auto", fontSize: "12px", opacity: 0.6 }}>↗</span>
                            </a>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    "mobile-nav-link" + (isActive ? " active" : "")
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {n.label}
                </NavLink>
              );
            })}
            <div className="mobile-nav-extra">
              <Link to="/tuyen-dung" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                Tuyển dụng
              </Link>
              <Link to="/faq" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                FAQ
              </Link>
            </div>
          </nav>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  padding: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                  flexShrink: 0,
                  boxSizing: "border-box",
                }}
              >
                <img
                  src="/images/logo-black.png"
                  alt="Bà Đen Farm"
                  style={{ height: "100%", width: "100%", objectFit: "contain", borderRadius: "5px" }}
                />
              </div>
              <span className="site-logo-name" style={{ color: "#fff", fontSize: "20px" }}>Bà Đen Farm</span>
            </div>
            <p className="footer-tagline">
              Sâm Bố Chính từ Núi Bà Đen, Tây Ninh — hữu cơ, an toàn,
              OCOP 4 sao.
            </p>
            <div className="footer-social">
              <a href={FB_URL} target="_blank" rel="noopener" aria-label="Facebook">FB</a>
              <a href="https://zalo.me/0919257757" target="_blank" rel="noopener" aria-label="Zalo">Zalo</a>
            </div>
          </div>
          <div>
            <h4>Khám phá</h4>
            <Link to="/gioi-thieu">Giới thiệu</Link>
            <Link to="/san-pham">Sản phẩm</Link>
            <Link to="/blog">Blog kiến thức</Link>
            <Link to="/vung-trong">Vùng trồng</Link>
          </div>
          <div>
            <h4>Điều khoản & Chính sách</h4>
            {POLICY_ITEMS.slice(0, 5).map((item) => (
              <Link key={item.id} to={`/dieu-khoan-su-dung?tab=${item.id}`}>
                {item.label}
              </Link>
            ))}
            <Link to="/dieu-khoan-su-dung" style={{ color: "var(--gold-400)", fontWeight: 600 }}>Xem tất cả điều khoản →</Link>
          </div>
          <div>
            <h4>Liên hệ</h4>
            <p>Lộ 12A, Khu phố Tân Trung,<br />Phường Bình Minh, TP. Tây Ninh</p>
            <p>
              <a href="tel:+84919257757">0919.257.757</a>
            </p>
            <p>
              <a href="tel:+84981557957">0981.557.957</a>
            </p>
            <p style={{ marginTop: "10px" }}>
              <Link to="/portal/login" style={{ color: "var(--gold-400)", fontWeight: 600 }}>🔐 Quản trị Admin</Link>
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>
            © {new Date().getFullYear()} Công ty Cổ phần Bà Đen Farm. Sản phẩm này không phải là
            thuốc và không có tác dụng thay thế thuốc chữa bệnh.
          </p>
        </div>
      </footer>
    </>
  );
}
