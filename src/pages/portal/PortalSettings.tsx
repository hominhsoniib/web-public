import { useState } from "react";

export default function PortalSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("custom_site_settings");
    return saved
      ? JSON.parse(saved)
      : {
          hotline: "0909 123 456",
          email: "info@badenfarm.com.vn",
          address: "Chân Núi Bà Đen, Xã Thạnh Tân, TP. Tây Ninh, Tỉnh Tây Ninh",
          facebook: "https://www.facebook.com/people/S%C3%A2m-B%E1%BB%91-Ch%C3%ADnh-B%C3%A0-%C4%90en-Farm/100076325312382/",
          zalo: "0909123456",
          missionText: "Đưa Nhân Sâm Việt đến với người Việt. Nỗ lực không ngừng nghỉ để xây dựng Sâm Bố Chính là thương hiệu đặc sản của Tỉnh Tây Ninh và thương hiệu quốc gia Việt Nam.",
          visionText: "Trở thành đơn vị uy tín và tiên phong về thị trường Dược liệu sạch của Việt Nam. Ước mơ đưa Dược liệu Việt Nam vươn tầm thế giới (Nhật Bản, Hàn Quốc, Châu Âu, Mỹ và Úc).",
        };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("custom_site_settings", JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      <div className="portal-card">
        <div className="portal-card-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
          <h2 className="portal-card-title">Quản lý Cấu hình & Nội dung Website</h2>
          <p className="portal-card-desc">Chỉnh sửa số điện thoại, email, địa chỉ, liên hệ và câu từ giới thiệu công ty trực tiếp không cần sửa code.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="portal-alert-success">
          <span>✅</span>
          <span>Đã lưu thông tin cấu hình website thành công!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="portal-card">
          <div className="portal-card-header">
            <h3 className="portal-card-title">1. Thông tin liên hệ & Hotline</h3>
            <p className="portal-card-desc">Cập nhật thông tin hỗ trợ khách hàng hiển thị trên Header và Footer website</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="portal-grid-2">
              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Số điện thoại Hotline (*)</label>
                <input
                  type="text"
                  required
                  value={settings.hotline}
                  onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                  className="portal-input"
                  placeholder="0909 123 456"
                />
              </div>
              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Email liên hệ (*)</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="portal-input"
                  placeholder="info@badenfarm.com.vn"
                />
              </div>
            </div>

            <div className="portal-form-group" style={{ marginBottom: 0 }}>
              <label>Địa chỉ trụ sở / Vùng trồng</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="portal-input"
                placeholder="Chân Núi Bà Đen, Tây Ninh"
              />
            </div>

            <div className="portal-grid-2">
              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Link Fanpage Facebook</label>
                <input
                  type="text"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="portal-input"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Số Zalo tư vấn</label>
                <input
                  type="text"
                  value={settings.zalo}
                  onChange={(e) => setSettings({ ...settings, zalo: e.target.value })}
                  className="portal-input"
                  placeholder="0909123456"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="portal-card">
          <div className="portal-card-header">
            <h3 className="portal-card-title">2. Nội dung Sứ mệnh & Tầm nhìn</h3>
            <p className="portal-card-desc">Cập nhật thông điệp định hướng phát triển của Công ty Cổ phần Bà Đen Farm</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="portal-form-group" style={{ marginBottom: 0 }}>
              <label>Nội dung Sứ Mệnh (Mission)</label>
              <textarea
                rows={3}
                value={settings.missionText}
                onChange={(e) => setSettings({ ...settings, missionText: e.target.value })}
                className="portal-textarea"
                placeholder="Nhập nội dung Sứ mệnh..."
              />
            </div>

            <div className="portal-form-group" style={{ marginBottom: 0 }}>
              <label>Nội dung Tầm Nhìn (Vision)</label>
              <textarea
                rows={3}
                value={settings.visionText}
                onChange={(e) => setSettings({ ...settings, visionText: e.target.value })}
                className="portal-textarea"
                placeholder="Nhập nội dung Tầm nhìn..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
            <button type="submit" className="portal-btn-save">
              <span>💾 Lưu thay đổi cấu hình</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
