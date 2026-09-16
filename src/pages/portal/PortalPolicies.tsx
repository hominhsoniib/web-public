import { useState } from "react";

const DEFAULT_POLICIES_ADMIN: Record<string, { title: string; description: string; contentText: string }> = {
  "bao-hanh": {
    title: "Chính Sách Bảo Hành",
    description: "Cam kết chất lượng nguồn gốc Sâm Bố Chính Bà Đen 100% hữu cơ, OCOP 4 sao.",
    contentText: `1. Cam kết chất lượng sản phẩm
Công ty Cổ phần Bà Đen Farm cam kết tất cả các sản phẩm phân phối (Bột Sâm Bố Chính, Trà Hoa Sâm, Sâm Tươi, Rượu Sâm...) đều được trồng và sản xuất theo quy trình hữu cơ 100% tại vùng trồng Núi Bà Đen, Tây Ninh, đạt chứng nhận OCOP 4 sao và ISO 22000 / VietGAP.

2. Phạm vi bảo hành & Đổi mới
- Bảo hành nguồn gốc: 100% sản phẩm có mã QR truy xuất nguồn gốc từng lô thu hoạch. Nếu phát hiện hàng giả, hàng nhái, Bà Đen Farm cam kết bồi thường 200% giá trị đơn hàng.
- Bảo hành chất lượng bao bì & Hạn sử dụng: Tất cả sản phẩm giao tới tay khách hàng đều phải còn nguyên tem niêm phong, hạn sử dụng trên 6 tháng.
- Bảo hành đổi mới: Đổi mới 100% sản phẩm nếu trong quá trình sử dụng phát hiện mốc, ẩm, biến màu hay biến chất dù đã bảo quản đúng hướng dẫn.

3. Quy trình bảo hành
Quý khách chỉ cần gọi điện hotline 0919.257.757 hoặc gửi hình ảnh qua Zalo 0919.257.757. Đội ngũ Bà Đen Farm sẽ tiếp nhận và gửi sản phẩm bảo hành đổi mới tận nhà cho quý khách trong 2 - 4 ngày làm việc.`
  },
  "doi-tra": {
    title: "Chính sách đổi trả",
    description: "Đổi trả 1-1 miễn phí trong vòng 7 ngày kể từ khi nhận hàng.",
    contentText: `1. Điều kiện áp dụng đổi trả (Trong vòng 7 ngày)
Quý khách được quyền đổi hoặc trả lại sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng trong các trường hợp sau:
- Sản phẩm bị vỡ, rách bao bì, hỏng hóc do quá trình vận chuyển.
- Giao sai chủng loại, sai số lượng hoặc thiếu sản phẩm so với đơn hàng đã đặt.
- Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất (hỏng seal, bay hơi, biến chất).

2. Điều kiện sản phẩm khi đổi trả
- Sản phẩm còn đầy đủ bao bì, tem mác, quà tặng kèm theo (nếu có).
- Có hóa đơn bán hàng hoặc mã đơn hàng đã xác nhận từ Bà Đen Farm.

3. Chi phí đổi trả
Nếu lỗi thuộc về nhà sản xuất hoặc đơn vị vận chuyển, Bà Đen Farm sẽ chịu 100% phí vận chuyển đổi trả 2 chiều.

4. Phương thức hoàn tiền
Trường hợp trả hàng hoàn tiền, Bà Đen Farm sẽ chuyển khoản hoàn tiền 100% vào tài khoản ngân hàng của quý khách trong vòng 24h làm việc sau khi nhận lại sản phẩm.`
  },
  "thanh-toan": {
    title: "Chính sách thanh toán",
    description: "Hỗ trợ thanh toán chuyển khoản ngân hàng linh hoạt hoặc COD khi nhận hàng.",
    contentText: `1. Các hình thức thanh toán
Bà Đen Farm cung cấp 2 phương thức thanh toán linh hoạt cho quý khách:

A. Thanh toán chuyển khoản ngân hàng (MB Bank)
- Ngân hàng: MB Bank (Ngân hàng TMCP Quân Đội)
- Số tài khoản: 1983 3939 6868
- Chủ tài khoản: CÔNG TY CỔ PHẦN BÀ ĐEN FARM
- Nội dung CK: [Số điện thoại mua hàng] + [Mã đơn hàng]

B. Thanh toán khi nhận hàng (COD)
Quý khách thanh toán tiền mặt trực tiếp cho nhân viên giao hàng (Shipper) sau khi đã nhận và kiểm tra kiện hàng.

2. Xuất hóa đơn VAT
Bà Đen Farm hỗ trợ xuất hóa đơn tài chính (VAT) cho khách hàng doanh nghiệp hoặc cá nhân có nhu cầu.`
  },
  "ban-hang": {
    title: "Chính sách bán hàng",
    description: "Cam kết bán đúng giá niêm yết, chính sách chiết khấu đại lý & quà tặng hấp dẫn.",
    contentText: `1. Quy định niêm yết giá
Tất cả sản phẩm bán lẻ niêm yết trên website badenfarm.com.vn là giá bán chính thức đã bao gồm thuế VAT.

2. Chính sách ưu đãi & Quà tặng
- Đơn hàng mua sỉ / số lượng lớn sẽ được áp dụng bảng giá ưu đãi theo từng cấp đại lý.
- Các chương trình khuyến mại, tặng kèm quà tặng đều được thông báo công khai trên website.

3. Quy trình xử lý đơn hàng
- Bước 1: Khách hàng đăng ký đặt hàng hoặc tư vấn trên website / hotline.
- Bước 2: Chuyên viên tư vấn gọi điện xác nhận đơn hàng, số lượng, địa chỉ.
- Bước 3: Đóng gói sản phẩm từ kho vùng trồng Núi Bà Đen, Tây Ninh.
- Bước 4: Giao hàng tận tay khách hàng.`
  },
  "kiem-tra-hang": {
    title: "Chính Sách Kiểm Tra Hàng",
    description: "Cho phép mở gói kiểm tra đúng sản phẩm, tem mác trước khi thanh toán.",
    contentText: `1. Quyền đồng kiểm khi nhận hàng
Bà Đen Farm áp dụng chính sách CHO PHÉP KIỂM TRA HÀNG (ĐỒNG KIỂM) khi nhân viên giao vận mang hàng tới.

2. Các mục được kiểm tra
- Mở thùng carton / gói hàng ngoại quan để kiểm tra số lượng hũ / hộp sản phẩm.
- Kiểm tra tem niêm phong, hạn sử dụng ghi trên bao bì sản phẩm.
- Kiểm tra tính nguyên vẹn của lọ thủy tinh / túi zip.

3. Xử lý khi hàng không đúng yêu cầu
Nếu phát hiện hàng bị móp vỡ, giao thiếu, giao sai loại, quý khách có quyền từ chối nhận hàng và báo ngay về hotline 0919.257.757.`
  },
  "bao-mat": {
    title: "Chính sách bảo mật",
    description: "Bảo vệ tuyệt đối thông tin cá nhân và thông tin giao dịch của khách hàng.",
    contentText: `1. Mục đích thu thập thông tin
Bà Đen Farm chỉ thu thập các thông tin cá nhân cần thiết: Họ và tên, Số điện thoại, Địa chỉ giao hàng, Email.

2. Phạm vi sử dụng thông tin
Thông tin chỉ dùng để xử lý và giao đơn hàng, thông báo trạng thái vận chuyển, chăm sóc khách hàng.

3. Cam kết không chia sẻ thông tin
Bà Đen Farm tuyệt đối không chia sẻ, bán hay tiết lộ thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào.`
  },
  "van-chuyen": {
    title: "Chính sách vận chuyển và giao nhận",
    description: "Giao hàng toàn quốc nhanh chóng 2-4 ngày, miễn phí giao hàng nội thành Tây Ninh.",
    contentText: `1. Phạm vi & Thời gian giao hàng
- Khu vực TP. Tây Ninh: Giao hàng nhanh trong ngày (miễn phí vận chuyển).
- Các tỉnh/thành khác toàn quốc: Giao hàng qua đối tác Viettel Post / GHTK từ 2 - 4 ngày làm việc.

2. Cước phí vận chuyển
- Miễn phí 100% ship cho các đơn hàng từ 500.000 ₫ trở lên.
- Đơn hàng dưới 500.000 ₫: Phí ship đồng giá 25.000 – 30.000 ₫.

3. Trách nhiệm trong quá trình vận chuyển
Bà Đen Farm chịu hoàn toàn trách nhiệm về rủi ro hư hỏng, mất mát sản phẩm trong suốt quá trình vận chuyển.`
  }
};

export const POLICY_META = [
  { id: "bao-hanh", label: "Chính Sách Bảo Hành", icon: "🛡️" },
  { id: "doi-tra", label: "Chính sách đổi trả", icon: "🔄" },
  { id: "thanh-toan", label: "Chính sách thanh toán", icon: "💳" },
  { id: "ban-hang", label: "Chính sách bán hàng", icon: "🛒" },
  { id: "kiem-tra-hang", label: "Chính Sách Kiểm Tra Hàng", icon: "🔍" },
  { id: "bao-mat", label: "Chính sách bảo mật", icon: "🔒" },
  { id: "van-chuyen", label: "Chính sách vận chuyển và giao nhận", icon: "🚚" },
];

export default function PortalPolicies() {
  const [policies, setPolicies] = useState(() => {
    const saved = localStorage.getItem("custom_policy_content");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_POLICIES_ADMIN;
  });

  const [activePolicyId, setActivePolicyId] = useState<string>("bao-hanh");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("custom_policy_content", JSON.stringify(policies));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const currentPolicy = policies[activePolicyId] ?? DEFAULT_POLICIES_ADMIN[activePolicyId];

  const updateCurrentPolicy = (field: "title" | "description" | "contentText", val: string) => {
    setPolicies({
      ...policies,
      [activePolicyId]: {
        ...currentPolicy,
        [field]: val,
      },
    });
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      <div className="portal-card">
        <div className="portal-card-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
          <h2 className="portal-card-title">📜 Quản lý Điều khoản & 7 Chính sách Sử dụng</h2>
          <p className="portal-card-desc">Chỉnh sửa trực tiếp tiêu đề, mô tả và nội dung chi tiết 7 chính sách hiển thị trên website không cần đụng mã nguồn.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="portal-alert-success">
          <span>✅</span>
          <span>Đã lưu thành công nội dung Điều khoản sử dụng & Chính sách!</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="portal-card">
          {/* Policy Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
            {POLICY_META.map((meta) => {
              const isActive = meta.id === activePolicyId;
              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => setActivePolicyId(meta.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: isActive ? '1px solid #166534' : '1px solid #cbd5e1',
                    background: isActive ? '#f0fdf4' : '#ffffff',
                    color: isActive ? '#166534' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Policy Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div className="portal-form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                Tiêu đề chính sách (*)
              </label>
              <input
                type="text"
                required
                value={currentPolicy.title}
                onChange={(e) => updateCurrentPolicy("title", e.target.value)}
                className="portal-input"
                placeholder="Tiêu đề chính sách"
              />
            </div>

            <div className="portal-form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                Mô tả ngắn gọn (Hiển thị dưới tiêu đề chính)
              </label>
              <input
                type="text"
                required
                value={currentPolicy.description}
                onChange={(e) => updateCurrentPolicy("description", e.target.value)}
                className="portal-input"
                placeholder="Mô tả ngắn gọn"
              />
            </div>

            <div className="portal-form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                Nội dung chi tiết chính sách (Nhập từng đoạn văn, có số thứ tự 1. 2. 3. hoặc gạch đầu dòng - )
              </label>
              <textarea
                rows={14}
                required
                value={currentPolicy.contentText}
                onChange={(e) => updateCurrentPolicy("contentText", e.target.value)}
                className="portal-textarea"
                style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}
                placeholder="Nhập chi tiết nội dung chính sách..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
            <button type="submit" className="portal-btn-save">
              <span>💾 Lưu nội dung Điều khoản này</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
