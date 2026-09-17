import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ResponsiveImage from "../../components/ResponsiveImage";
import { portalApi } from "../../lib/portalApi";

/** Hash SHA-256 (hex, lowercase) bằng Web Crypto API — dùng để so khớp với
 * VITE_OFFLINE_ADMIN_PASSWORD_SHA256 mà không bao giờ so sánh plaintext. */
async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function PortalLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const data = await portalApi.login(email, password);
      localStorage.setItem("portal_access_token", data.access_token);
      if (data.auth_mode === "offline") {
        localStorage.setItem("portal_auth_mode", "offline-verified");
      } else {
        localStorage.removeItem("portal_auth_mode");
      }
      navigate("/portal");
    } catch {
      // TODO(migrate-to-backend): offline SHA256 fallback — replace with real server-side
      // auth (Vercel Serverless Function) once backend exists. See portalApi.ts.
      const offlineEmail = (import.meta.env.VITE_OFFLINE_ADMIN_EMAIL as string | undefined)
        ?.trim()
        .toLowerCase();
      const offlinePasswordHash = (
        import.meta.env.VITE_OFFLINE_ADMIN_PASSWORD_SHA256 as string | undefined
      )?.trim().toLowerCase();

      // Fail-safe: thiếu biến môi trường offline (build khác/production chưa cấu hình)
      // => luôn từ chối đăng nhập, KHÔNG bao giờ fallback cho phép truy cập.
      if (offlineEmail && offlinePasswordHash && cleanEmail === offlineEmail) {
        const enteredHash = await sha256Hex(password.trim());
        if (enteredHash === offlinePasswordHash) {
          localStorage.setItem("portal_access_token", "offline_admin_token_" + Date.now());
          localStorage.setItem("portal_auth_mode", "offline-verified");
          navigate("/portal");
          return;
        }
      }

      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu hoặc thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-login-page">
      <div className="portal-login-card">
        <div className="portal-login-header">
          <ResponsiveImage src="/images/logo-black.png" alt="Bà Đen Farm Logo" className="portal-login-logo" sizes="80px" loading="eager" />
          <h1 className="portal-login-title">Bà Đen Farm</h1>
          <p className="portal-login-subtitle">Hệ thống Quản trị Admin & Portal</p>
        </div>
        
        <div className="portal-login-body">
          <form onSubmit={handleLogin}>
            {error && (
              <div className="portal-alert-error">
                {error}
              </div>
            )}
            
            <div className="portal-form-group">
              <label>Email / Tài khoản Admin</label>
              <input
                type="text"
                required
                placeholder="admin@badenfarm.com.vn"
                className="portal-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="portal-form-group">
              <label>Mật khẩu</label>
              <div className="portal-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="portal-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="portal-eye-btn"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  aria-label="Bật/tắt hiển thị mật khẩu"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="portal-btn-primary"
            >
              {loading ? "Đang xác thực..." : "🔑 Đăng nhập hệ thống"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
