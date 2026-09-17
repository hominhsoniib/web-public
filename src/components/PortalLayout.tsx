import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import ResponsiveImage from "./ResponsiveImage";
import { portalApi, type PortalDealerProfile } from "../lib/portalApi";

export default function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<PortalDealerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Đã ẩn: đổi mật khẩu qua UI không còn tác dụng sau khi auth chuyển sang so khớp
  // SHA256 với VITE_OFFLINE_ADMIN_PASSWORD_SHA256 trong .env.local (xem PortalLogin.tsx).
  // Đổi mật khẩu admin = cập nhật biến env đó rồi build lại. Sẽ xoá hẳn code này khi
  // có backend thật và auth chuyển hoàn toàn sang server-side.

  useEffect(() => {
    const token = localStorage.getItem("portal_access_token");
    if (!token) {
      if (location.pathname !== "/portal/login") {
        navigate("/portal/login");
      }
      queueMicrotask(() => setLoading(false));
      return;
    }

    if (localStorage.getItem("portal_auth_mode") === "offline-verified") {
      // Đã xác thực bằng offline-fallback lúc đăng nhập (không có backend) —
      // không gọi lại getProfile() qua mạng (chắc chắn sẽ lỗi vì không có
      // backend), dùng luôn hồ sơ admin cố định. Xem TODO trong portalApi.ts.
      queueMicrotask(() => {
        setProfile({
          id: "admin-1",
          code: "ADMIN-001",
          name: "Ban Quản Trị Bà Đen Farm",
          tier: "Admin",
          region: "Tây Ninh",
          credit_limit: 1000000000,
          payment_term_days: 30,
          status: "active",
          balance: 0,
        });
        setLoading(false);
      });
      return;
    }

    portalApi.getProfile()
      .then(res => {
        setProfile(res);
      })
      .catch(() => {
        // Nếu API thất bại (do offline / không kết nối backend), dùng hồ sơ Admin mặc định
        setProfile({
          id: "admin-1",
          code: "ADMIN-001",
          name: "Ban Quản Trị Bà Đen Farm",
          tier: "Admin",
          region: "Tây Ninh",
          credit_limit: 1000000000,
          payment_term_days: 30,
          status: "active",
          balance: 0,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("portal_access_token");
    localStorage.removeItem("portal_auth_mode");
    navigate("/portal/login");
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải cấu hình Cổng Đại lý...</div>;
  }

  // Nếu đang ở trang login, không hiển thị header/sidebar
  if (location.pathname === "/portal/login") {
    return <Outlet />;
  }

  if (!profile) return null;

  return (
    <div className="portal-admin-layout">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        <div className="portal-sidebar-brand">
          <ResponsiveImage src="/images/logo-gold.png" alt="Bà Đen Farm Logo" sizes="48px" loading="eager" />
          <div>
            <h2>Bà Đen Farm</h2>
            <p>Hệ Thống Admin CMS</p>
          </div>
        </div>

        <nav className="portal-sidebar-nav">
          <Link to="/portal" className={`portal-nav-link ${location.pathname === '/portal' ? 'active' : ''}`}>
            📊 Bảng điều khiển
          </Link>
          <Link to="/portal/posts" className={`portal-nav-link ${location.pathname.startsWith('/portal/posts') ? 'active' : ''}`}>
            📝 Quản lý Bài viết Blog
          </Link>
          <Link to="/portal/policies" className={`portal-nav-link ${location.pathname.startsWith('/portal/policies') ? 'active' : ''}`}>
            📜 Quản lý Điều khoản sử dụng
          </Link>
          <Link to="/portal/products" className={`portal-nav-link ${location.pathname.startsWith('/portal/products') ? 'active' : ''}`}>
            📦 Quản lý Sản phẩm
          </Link>
          <Link to="/portal/orders" className={`portal-nav-link ${location.pathname.startsWith('/portal/orders') ? 'active' : ''}`}>
            🛒 Quản lý Đơn hàng
          </Link>
          <Link to="/portal/settings" className={`portal-nav-link ${location.pathname.startsWith('/portal/settings') ? 'active' : ''}`}>
            ⚙️ Cấu hình Website
          </Link>
          <Link to="/portal/ledger" className={`portal-nav-link ${location.pathname.startsWith('/portal/ledger') ? 'active' : ''}`}>
            💳 Công nợ & Thanh toán
          </Link>
        </nav>

        <div className="portal-sidebar-footer">
          <button 
            onClick={handleLogout}
            className="portal-btn-logout"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main-area">
        <header className="portal-top-bar">
          <h1 className="portal-top-bar-title">
            {location.pathname === '/portal' && "Bảng điều khiển Tổng quan"}
            {location.pathname.startsWith('/portal/posts') && "Quản lý Bài viết & Nội dung Blog"}
            {location.pathname.startsWith('/portal/policies') && "Quản lý Điều khoản & 7 Chính sách Sử dụng"}
            {location.pathname.startsWith('/portal/products') && "Quản lý Danh mục Sản phẩm"}
            {location.pathname.startsWith('/portal/orders') && "Quản lý Đơn hàng & Đại lý"}
            {location.pathname.startsWith('/portal/settings') && "Cấu hình Nội dung Website"}
            {location.pathname.startsWith('/portal/ledger') && "Quản lý Sổ cái & Thanh toán"}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Xin chào, <strong>{profile.name}</strong></span>
            <Link to="/" target="_blank" style={{ fontSize: '13px', color: '#15803d', fontWeight: 600, textDecoration: 'none' }}>
              🌐 Xem Trang Web
            </Link>
          </div>
        </header>

        <div className="portal-content-body">
          <Outlet context={{ profile }} />
        </div>
      </main>
    </div>
  );
}
