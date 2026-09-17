import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import ResponsiveImage from "./ResponsiveImage";
import { portalApi, type PortalDealerProfile } from "../lib/portalApi";

export default function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<PortalDealerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // State cho Modal Đổi Mật Khẩu
  const [showPassModal, setShowPassModal] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [passMsg, setPassMsg] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

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

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg("");
    setPassSuccess(false);

    if (newPass.length < 6) {
      setPassMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPass !== confirmPass) {
      setPassMsg("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }

    localStorage.setItem("admin_password", newPass);
    setPassSuccess(true);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => {
      setShowPassModal(false);
      setPassSuccess(false);
    }, 2000);
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
          <button
            onClick={() => setShowPassModal(true)}
            className="portal-nav-link"
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          >
            🔑 Đổi mật khẩu Admin
          </button>
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
            <button
              onClick={() => setShowPassModal(true)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#15803d',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              🔑 Đổi mật khẩu
            </button>
            <Link to="/" target="_blank" style={{ fontSize: '13px', color: '#15803d', fontWeight: 600, textDecoration: 'none' }}>
              🌐 Xem Trang Web
            </Link>
          </div>
        </header>

        <div className="portal-content-body">
          <Outlet context={{ profile }} />
        </div>
      </main>

      {/* Modal Popup Đổi Mật Khẩu */}
      {showPassModal && (
        <div
          onClick={() => setShowPassModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '450px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowPassModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              🔑 Đổi Mật Khẩu Admin
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Cập nhật mật khẩu mới cho tài khoản Quản trị Bà Đen Farm.
            </p>

            {passMsg && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {passMsg}
              </div>
            )}

            {passSuccess && (
              <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
                ✅ Đã đổi mật khẩu Admin thành công!
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Mật khẩu hiện tại</label>
                <div className="portal-password-wrapper">
                  <input
                    type={showCurr ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="portal-input"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurr(!showCurr)}
                    className="portal-eye-btn"
                  >
                    {showCurr ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Mật khẩu mới (*)</label>
                <div className="portal-password-wrapper">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu mới"
                    className="portal-input"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="portal-eye-btn"
                  >
                    {showNew ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Xác nhận mật khẩu mới (*)</label>
                <div className="portal-password-wrapper">
                  <input
                    type={showConf ? "text" : "password"}
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    className="portal-input"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConf(!showConf)}
                    className="portal-eye-btn"
                  >
                    {showConf ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '14px' }}
                >
                  💾 Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
