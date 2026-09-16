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
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Cấu hình & Nội dung Website</h2>
        <p className="text-sm text-gray-500 mt-1">Chỉnh sửa số điện thoại, email, địa chỉ, liên hệ và câu từ giới thiệu công ty trực tiếp không cần sửa code.</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="font-semibold">Đã lưu thông tin cấu hình website thành công!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">1. Thông tin liên hệ & Hotline</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại Hotline (*)</label>
              <input
                type="text"
                required
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email liên hệ (*)</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ trụ sở / Vùng trồng</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Fanpage Facebook</label>
              <input
                type="text"
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số Zalo tư vấn</label>
              <input
                type="text"
                value={settings.zalo}
                onChange={(e) => setSettings({ ...settings, zalo: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">2. Nội dung Sứ mệnh & Tầm nhìn</h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung Sứ Mệnh (Mission)</label>
            <textarea
              rows={3}
              value={settings.missionText}
              onChange={(e) => setSettings({ ...settings, missionText: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung Tầm Nhìn (Vision)</label>
            <textarea
              rows={3}
              value={settings.visionText}
              onChange={(e) => setSettings({ ...settings, visionText: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <span>💾 Lưu thay đổi cấu hình</span>
          </button>
        </div>
      </form>
    </div>
  );
}
