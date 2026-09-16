import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { portalApi, type PortalDealerProfile } from "../lib/portalApi";

export default function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<PortalDealerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("portal_access_token");
    if (!token) {
      if (location.pathname !== "/portal/login") {
        navigate("/portal/login");
      }
      queueMicrotask(() => setLoading(false));
      return;
    }

    portalApi.getProfile()
      .then(res => {
        setProfile(res);
      })
      .catch(err => {
        console.error("Portal auth error:", err);
        localStorage.removeItem("portal_access_token");
        navigate("/portal/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("portal_access_token");
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
          <img src="/images/logo.jpg" alt="Bà Đen Farm Logo" />
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
            {location.pathname.startsWith('/portal/products') && "Quản lý Danh mục Sản phẩm"}
            {location.pathname.startsWith('/portal/orders') && "Quản lý Đơn hàng & Đại lý"}
            {location.pathname.startsWith('/portal/settings') && "Cấu hình Nội dung Website"}
            {location.pathname.startsWith('/portal/ledger') && "Quản lý Sổ cái & Thanh toán"}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
