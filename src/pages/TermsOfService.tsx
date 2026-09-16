import { useEffect, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";

const SITE = import.meta.env.VITE_SITE_URL ?? "https://badenfarm.com.vn";

export interface PolicyTab {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: ReactNode;
}

const DEFAULT_POLICIES_STATIC: PolicyTab[] = [
  {
    id: "bao-hanh",
    title: "Chính Sách Bảo Hành",
    icon: "🛡️",
    description: "Cam kết chất lượng nguồn gốc Sâm Bố Chính Bà Đen 100% hữu cơ, OCOP 4 sao.",
    content: (
      <div>
        <h2>1. Cam kết chất lượng sản phẩm</h2>
        <p>
          Công ty Cổ phần Bà Đen Farm cam kết tất cả các sản phẩm phân phối (Bột Sâm Bố Chính, Trà Hoa Sâm, Sâm Tươi, Rượu Sâm...) đều được trồng và sản xuất theo quy trình hữu cơ 100% tại vùng trồng Núi Bà Đen, Tây Ninh, đạt chứng nhận OCOP 4 sao và ISO 22000 / VietGAP.
        </p>

        <h2>2. Phạm vi bảo hành & Đổi mới</h2>
        <ul>
          <li><strong>Bảo hành nguồn gốc:</strong> 100% sản phẩm có mã QR truy xuất nguồn gốc từng lô thu hoạch. Nếu phát hiện hàng giả, hàng nhái, Bà Đen Farm cam kết bồi thường 200% giá trị đơn hàng.</li>
          <li><strong>Bảo hành chất lượng bao bì & Hạn sử dụng:</strong> Tất cả sản phẩm giao tới tay khách hàng đều phải còn nguyên tem niêm phong, hạn sử dụng trên 6 tháng.</li>
          <li><strong>Bảo hành đổi mới:</strong> Đổi mới 100% sản phẩm nếu trong quá trình sử dụng (trong thời hạn bảo quản) phát hiện mốc, ẩm, biến màu hay biến chất dù đã bảo quản đúng hướng dẫn.</li>
        </ul>

        <h2>3. Quy trình bảo hành</h2>
        <p>
          Quý khách chỉ cần gọi điện hotline <strong>0919.257.757</strong> hoặc gửi hình ảnh qua Zalo <strong>0919.257.757</strong>. Đội ngũ Bà Đen Farm sẽ tiếp nhận và gửi sản phẩm bảo hành đổi mới tận nhà cho quý khách trong 2 - 4 ngày làm việc.
        </p>
      </div>
    ),
  },
  {
    id: "doi-tra",
    title: "Chính sách đổi trả",
    icon: "🔄",
    description: "Đổi trả 1-1 miễn phí trong vòng 7 ngày kể từ khi nhận hàng.",
    content: (
      <div>
        <h2>1. Điều kiện áp dụng đổi trả (Trong vòng 7 ngày)</h2>
        <p>
          Quý khách được quyền đổi hoặc trả lại sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng trong các trường hợp sau:
        </p>
        <ul>
          <li>Sản phẩm bị vỡ, rách bao bì, hỏng hóc do quá trình vận chuyển.</li>
          <li>Giao sai chủng loại, sai số lượng hoặc thiếu sản phẩm so với đơn hàng đã đặt.</li>
          <li>Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất (hỏng seal, bay hơi, biến chất).</li>
        </ul>

        <h2>2. Điều kiện sản phẩm khi đổi trả</h2>
        <ul>
          <li>Sản phẩm còn đầy đủ bao bì, tem mác, quà tặng kèm theo (nếu có).</li>
          <li>Có hóa đơn bán hàng hoặc mã đơn hàng đã xác nhận từ Bà Đen Farm.</li>
        </ul>

        <h2>3. Chi phí đổi trả</h2>
        <p>
          Nếu lỗi thuộc về nhà sản xuất hoặc đơn vị vận chuyển, <strong>Bà Đen Farm sẽ chịu 100% phí vận chuyển đổi trả 2 chiều</strong>.
        </p>

        <h2>4. Phương thức hoàn tiền</h2>
        <p>
          Trường hợp trả hàng hoàn tiền, Bà Đen Farm sẽ chuyển khoản hoàn tiền 100% vào tài khoản ngân hàng của quý khách trong vòng 24h làm việc sau khi nhận lại sản phẩm.
        </p>
      </div>
    ),
  },
  {
    id: "thanh-toan",
    title: "Chính sách thanh toán",
    icon: "💳",
    description: "Hỗ trợ thanh toán chuyển khoản ngân hàng linh hoạt hoặc COD khi nhận hàng.",
    content: (
      <div>
        <h2>1. Các hình thức thanh toán</h2>
        <p>
          Bà Đen Farm cung cấp 2 phương thức thanh toán linh hoạt cho quý khách:
        </p>
        
        <div style={{ background: "#f8f9fa", border: "1px solid #e2e8f0", padding: "16px 20px", borderRadius: "8px", margin: "16px 0" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#1a4d2e" }}>A. Thanh toán chuyển khoản ngân hàng (Khuyên dùng)</h3>
          <p style={{ margin: "0 0 6px 0" }}>Quý khách chuyển khoản trực tiếp qua ngân hàng theo thông tin chính thức:</p>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li><strong>Ngân hàng:</strong> MB Bank (Ngân hàng TMCP Quân Đội)</li>
            <li><strong>Số tài khoản:</strong> <span style={{ color: "#d97706", fontWeight: "bold" }}>1983 3939 6868</span></li>
            <li><strong>Chủ tài khoản:</strong> CÔNG TY CỔ PHẦN BÀ ĐEN FARM</li>
            <li><strong>Nội dung CK:</strong> [Số điện thoại mua hàng] + [Mã đơn hàng]</li>
          </ul>
        </div>

        <div style={{ background: "#f8f9fa", border: "1px solid #e2e8f0", padding: "16px 20px", borderRadius: "8px", margin: "16px 0" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#1a4d2e" }}>B. Thanh toán khi nhận hàng (COD)</h3>
          <p style={{ margin: 0 }}>
            Quý khách thanh toán tiền mặt trực tiếp cho nhân viên giao hàng (Shipper) sau khi đã nhận và kiểm tra kiện hàng.
          </p>
        </div>

        <h2>2. Xuất hóa đơn VAT</h2>
        <p>
          Bà Đen Farm hỗ trợ xuất hóa đơn tài chính (VAT) cho khách hàng doanh nghiệp hoặc cá nhân có nhu cầu. Vui lòng cung cấp thông tin xuất hóa đơn khi đặt hàng hoặc liên hệ hotline trong ngày.
        </p>
      </div>
    ),
  },
  {
    id: "ban-hang",
    title: "Chính sách bán hàng",
    icon: "🛒",
    description: "Cam kết bán đúng giá niêm yết, chính sách chiết khấu đại lý & quà tặng hấp dẫn.",
    content: (
      <div>
        <h2>1. Quy định niêm yết giá</h2>
        <p>
          Tất cả sản phẩm bán lẻ niêm yết trên website <strong>badenfarm.com.vn</strong> là giá bán chính thức đã bao gồm thuế VAT (chưa bao gồm phí vận chuyển ngoại tỉnh nếu đơn dưới định mức miễn phí).
        </p>

        <h2>2. Chính sách ưu đãi & Quà tặng</h2>
        <ul>
          <li>Đơn hàng mua sỉ / số lượng lớn sẽ được áp dụng bảng giá ưu đãi theo từng cấp đại lý.</li>
          <li>Các chương trình khuyến mại, tặng kèm quà tặng đều được thông báo công khai trên website và fanpage chính thức.</li>
        </ul>

        <h2>3. Quy trình xử lý đơn hàng</h2>
        <ol style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
          <li><strong>Bước 1:</strong> Khách hàng đăng ký đặt hàng hoặc tư vấn trên website / hotline.</li>
          <li><strong>Bước 2:</strong> Chuyên viên tư vấn gọi điện xác nhận đơn hàng, số lượng, địa chỉ và số tiền thanh toán.</li>
          <li><strong>Bước 3:</strong> Đóng gói sản phẩm từ kho vùng trồng Núi Bà Đen, Tây Ninh và bàn giao đơn vị vận chuyển.</li>
          <li><strong>Bước 4:</strong> Giao hàng tận tay khách hàng và hỗ trợ hậu mãi.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "kiem-tra-hang",
    title: "Chính Sách Kiểm Tra Hàng",
    icon: "🔍",
    description: "Cho phép mở gói kiểm tra đúng sản phẩm, tem mác trước khi thanh toán.",
    content: (
      <div>
        <h2>1. Quyền đồng kiểm khi nhận hàng</h2>
        <p>
          Để đảm bảo tối đa quyền lợi cho khách hàng, Bà Đen Farm áp dụng chính sách <strong>CHO PHÉP KIỂM TRA HÀNG (ĐỒNG KIỂM)</strong> khi nhân viên giao vận mang hàng tới.
        </p>

        <h2>2. Các mục được kiểm tra</h2>
        <ul>
          <li>Mở thùng carton / gói hàng ngoại quan để kiểm tra số lượng hũ / hộp sản phẩm.</li>
          <li>Kiểm tra tem niêm phong, hạn sử dụng ghi trên bao bì sản phẩm.</li>
          <li>Kiểm tra tính nguyên vẹn của lọ thủy tinh / túi zip.</li>
        </ul>

        <h2>3. Xử lý khi hàng không đúng yêu cầu</h2>
        <p>
          Nếu phát hiện hàng bị móp vỡ, giao thiếu, giao sai loại hoặc tem niêm phong bị rách, quý khách <strong>có quyền từ chối nhận hàng</strong> và báo ngay về hotline <strong>0919.257.757</strong>. Quý khách không phải thanh toán bất kỳ chi phí nào.
        </p>
      </div>
    ),
  },
  {
    id: "bao-mat",
    title: "Chính sách bảo mật",
    icon: "🔒",
    description: "Bảo vệ tuyệt đối thông tin cá nhân và thông tin giao dịch của khách hàng.",
    content: (
      <div>
        <h2>1. Mục đích thu thập thông tin</h2>
        <p>
          Bà Đen Farm chỉ thu thập các thông tin cá nhân cần thiết phục vụ quá trình giao dịch:
        </p>
        <ul>
          <li>Họ và tên khách hàng.</li>
          <li>Số điện thoại liên hệ.</li>
          <li>Địa chỉ giao nhận hàng.</li>
          <li>Email (nếu khách hàng cung cấp để nhận thông báo đơn hàng).</li>
        </ul>

        <h2>2. Phạm vi sử dụng thông tin</h2>
        <p>
          Thông tin khách hàng chỉ được dùng để:
        </p>
        <ul>
          <li>Xử lý và giao đơn hàng tận nơi.</li>
          <li>Gửi thông báo xác nhận đơn hàng, trạng thái vận chuyển.</li>
          <li>Hỗ trợ tư vấn, chăm sóc khách hàng và giải quyết khiếu nại.</li>
        </ul>

        <h2>3. Cam kết không chia sẻ thông tin</h2>
        <p>
          Bà Đen Farm <strong>tuyệt đối không chia sẻ, bán hay tiết lộ</strong> thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác ngoài đơn vị vận chuyển đối tác (Viettel Post, GHTK, GHN...) phục vụ việc giao hàng.
        </p>
      </div>
    ),
  },
  {
    id: "van-chuyen",
    title: "Chính sách vận chuyển và giao nhận",
    icon: "🚚",
    description: "Giao hàng toàn quốc nhanh chóng 2-4 ngày, miễn phí giao hàng nội thành Tây Ninh.",
    content: (
      <div>
        <h2>1. Phạm vi & Thời gian giao hàng</h2>
        <ul>
          <li><strong>Khu vực TP. Tây Ninh:</strong> Giao hàng nhanh trong ngày (miễn phí vận chuyển).</li>
          <li><strong>Các tỉnh/thành khác toàn quốc:</strong> Giao hàng qua đối tác Viettel Post / GHTK từ <strong>2 - 4 ngày làm việc</strong>.</li>
        </ul>

        <h2>2. Cước phí vận chuyển</h2>
        <ul>
          <li><strong>Miễn phí 100% ship:</strong> Áp dụng cho các đơn hàng có giá trị từ 500.000 ₫ trở lên hoặc theo chương trình khuyến mại từng thời điểm.</li>
          <li><strong>Đơn hàng dưới 500.000 ₫:</strong> Phí ship đồng giá 25.000 – 30.000 ₫ toàn quốc.</li>
        </ul>

        <h2>3. Trách nhiệm trong quá trình vận chuyển</h2>
        <p>
          Bà Đen Farm chịu hoàn toàn trách nhiệm về rủi ro hư hỏng, mất mát sản phẩm trong suốt quá trình vận chuyển từ kho đến tay quý khách.
        </p>
      </div>
    ),
  },
];

const renderFormattedText = (text: string) => {
  const blocks = text.split("\n\n");
  return (
    <div>
      {blocks.map((block, idx) => {
        const lines = block.split("\n");
        return (
          <div key={idx} style={{ marginBottom: "16px" }}>
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (trimmed.match(/^[0-9]+\./)) {
                return (
                  <h2 key={lIdx} style={{ color: "#1a4d2e", marginTop: "24px", marginBottom: "10px", fontSize: "18px", fontWeight: "700" }}>
                    {trimmed}
                  </h2>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <li key={lIdx} style={{ marginLeft: "20px", marginBottom: "6px" }}>
                    {trimmed.substring(2)}
                  </li>
                );
              }
              return <p key={lIdx} style={{ margin: "6px 0", lineHeight: "1.7" }}>{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const POLICIES = DEFAULT_POLICIES_STATIC;

export default function TermsOfService() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState<string>(tabParam && DEFAULT_POLICIES_STATIC.some(p => p.id === tabParam) ? tabParam : DEFAULT_POLICIES_STATIC[0].id);

  const [customPolicies, setCustomPolicies] = useState<Record<string, { title: string; description: string; contentText: string }> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("custom_policy_content");
    if (saved) {
      try {
        setCustomPolicies(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (tabParam && DEFAULT_POLICIES_STATIC.some(p => p.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const defaultPolicy = DEFAULT_POLICIES_STATIC.find((p) => p.id === activeTab) ?? DEFAULT_POLICIES_STATIC[0];

  const customPolicy = customPolicies ? customPolicies[activeTab] : null;

  const title = customPolicy?.title || defaultPolicy.title;
  const description = customPolicy?.description || defaultPolicy.description;
  const contentNode = customPolicy?.contentText
    ? renderFormattedText(customPolicy.contentText)
    : defaultPolicy.content;

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  return (
    <>
      <Seo
        seo={{
          title: `${title} — Bà Đen Farm`,
          description: description,
          canonical_url: SITE + `/dieu-khoan-su-dung?tab=${activeTab}`,
          robots: "index,follow",
        }}
      />

      <div className="container page-top">
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span> <Link to="/dieu-khoan-su-dung">Điều khoản sử dụng</Link> <span>/</span> <span>{title}</span>
        </nav>
        <h1 className="page-title">Điều khoản sử dụng & Chính sách</h1>
        <p className="page-lead">
          Thông tin minh bạch về bảo hành, đổi trả, thanh toán, bảo mật và chính sách giao nhận tại Bà Đen Farm.
        </p>
      </div>

      <section className="container section" style={{ paddingBottom: "60px" }}>
        <div className="policy-layout" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "32px", alignItems: "start" }}>
          
          {/* Policy Navigation Sidebar */}
          <div className="policy-sidebar" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a4d2e", marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
              Danh mục chính sách
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {DEFAULT_POLICIES_STATIC.map((p) => {
                const isActive = p.id === activeTab;
                const policyTitle = customPolicies && customPolicies[p.id]?.title ? customPolicies[p.id].title : p.title;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectTab(p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: isActive ? "var(--primary-color, #1a4d2e)" : "transparent",
                      color: isActive ? "#fff" : "#334155",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: "14px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{p.icon}</span>
                    <span>{policyTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Policy Content Area */}
          <div className="policy-main-content" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "2px solid #f1f5f9" }}>
              <span style={{ fontSize: "32px" }}>{defaultPolicy.icon}</span>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1a4d2e", margin: 0 }}>
                  {title}
                </h1>
                <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  {description}
                </p>
              </div>
            </div>

            <div className="prose policy-body" style={{ lineHeight: "1.8", color: "#334155", fontSize: "15px" }}>
              {contentNode}
            </div>

            {/* Contact Box Footer */}
            <div style={{ background: "#f8fafc", borderLeft: "4px solid var(--primary-color, #1a4d2e)", padding: "16px 20px", marginTop: "40px", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontWeight: "600", color: "#1a4d2e" }}>CẦN HỖ TRỢ THÊM VỀ CHÍNH SÁCH?</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#475569" }}>
                Liên hệ ngay hotline hỗ trợ 24/7 của Công ty Cổ phần Bà Đen Farm: <a href="tel:+84919257757" style={{ color: "#1a4d2e", fontWeight: "700" }}>0919.257.757</a> hoặc Zalo <a href="https://zalo.me/0919257757" target="_blank" rel="noreferrer" style={{ color: "#1a4d2e", fontWeight: "700" }}>0919.257.757</a>.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
