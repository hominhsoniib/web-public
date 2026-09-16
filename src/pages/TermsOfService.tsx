import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const SITE = import.meta.env.VITE_SITE_URL ?? "https://badenfarm.com.vn";

export default function TermsOfService() {
  return (
    <>
      <Seo
        seo={{
          title: "Điều khoản sử dụng — Bà Đen Farm",
          description:
            "Quy định và điều khoản sử dụng dịch vụ, đặt hàng, bản quyền thông tin tại website Công ty Cổ phần Bà Đen Farm.",
          canonical_url: SITE + "/dieu-khoan-su-dung",
          robots: "index,follow",
        }}
      />

      <div className="container page-top">
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span> <span>Điều khoản sử dụng</span>
        </nav>
        <h1 className="page-title">Điều khoản sử dụng</h1>
        <p className="page-lead">
          Chào mừng quý khách đến với trang web chính thức của Công ty Cổ phần Bà Đen Farm (badenfarm.com.vn).
        </p>
      </div>

      <section className="container section" style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "60px" }}>
        <div className="terms-content" style={{ lineHeight: "1.8", fontSize: "16px", color: "#333" }}>
          <p style={{ marginBottom: "20px" }}>
            Khi quý khách truy cập, tham quan hoặc sử dụng trang web này, quý khách được xem là đã đọc, hiểu và đồng ý tuân thủ các quy định và điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi mua hàng hoặc sử dụng các thông tin trên website.
          </p>

          <h2 style={{ color: "var(--primary-color, #1a4d2e)", marginTop: "32px", marginBottom: "12px", fontSize: "22px", fontWeight: "700" }}>
            1. Chấp nhận điều khoản
          </h2>
          <p>
            Trang web này thuộc quyền sở hữu và vận hành bởi <strong>Công ty Cổ phần Bà Đen Farm</strong>. Chúng tôi có quyền sửa đổi, cập nhật hoặc bổ sung các Điều khoản sử dụng này bất kỳ lúc nào mà không cần thông báo trước. Việc tiếp tục sử dụng website sau khi các thay đổi được đăng tải đồng nghĩa với việc quý khách chấp nhận các sửa đổi đó.
          </p>

          <h2 style={{ color: "var(--primary-color, #1a4d2e)", marginTop: "32px", marginBottom: "12px", fontSize: "22px", fontWeight: "700" }}>
            2. Quyền sở hữu trí tuệ & Bản quyền
          </h2>
          <p>
            Tất cả nội dung trên website bao gồm nhưng không giới hạn: văn bản, hình ảnh, logo, biểu tượng, video, tài liệu chứng nhận OCOP/VietGAP, nhãn hiệu "Bà Đen Farm", kiểu dáng bao bì và thiết kế giao diện đều là tài sản sở hữu trí tuệ của Bà Đen Farm hoặc được cấp phép hợp pháp.
          </p>
          <ul style={{ paddingLeft: "24px", marginTop: "10px", marginBottom: "16px" }}>
            <li>Nghiêm cấm mọi hành vi sao chép, trích dẫn, sửa đổi, phân phối hoặc sử dụng vào mục đích thương mại khi chưa có sự đồng ý bằng văn bản của Bà Đen Farm.</li>
            <li>Mọi hành vi vi phạm bản quyền sẽ bị xử lý theo quy định của pháp luật Việt Nam.</li>
          </ul>

          <h2 style={{ color: "var(--primary-color, #1a4d2e)", marginTop: "32px", marginBottom: "12px", fontSize: "22px", fontWeight: "700" }}>
            3. Quyền và trách nhiệm của người sử dụng
          </h2>
          <p>
            Quý khách cam kết sử dụng website vào các mục đích hợp pháp và tuân thủ các quy định sau:
          </p>
          <ul style={{ paddingLeft: "24px", marginTop: "10px", marginBottom: "16px" }}>
            <li>Cung cấp chính xác, đầy đủ các thông tin cá nhân (họ tên, số điện thoại, địa chỉ nhận hàng) khi thực hiện đăng ký tư vấn hoặc đặt mua sản phẩm.</li>
            <li>Không phát tán các nội dung vi phạm pháp luật, giả mạo thông tin, chứa mã độc hay can thiệp làm gián đoạn hoạt động của website.</li>
            <li>Tự chịu trách nhiệm bảo mật thông tin liên hệ và các giao dịch cá nhân.</li>
          </ul>

          <h2 style={{ color: "var(--primary-color, #1a4d2e)", marginTop: "32px", marginBottom: "12px", fontSize: "22px", fontWeight: "700" }}>
            4. Thông tin sản phẩm, Giá cả & Miễn trừ trách nhiệm y tế
          </h2>
          <p>
            Bà Đen Farm cam kết cung cấp thông tin minh bạch, trung thực về các sản phẩm Sâm Bố Chính (bột sâm, trà hoa sâm, sâm tươi, rượu sâm...).
          </p>
          <ul style={{ paddingLeft: "24px", marginTop: "10px", marginBottom: "16px" }}>
            <li><strong>Thông tin giá cả:</strong> Giá sản phẩm niêm yết trên website là giá bán chính thức (chưa bao gồm phí vận chuyển ngoại tỉnh nếu có). Chúng tôi có quyền điều chỉnh giá niêm yết theo từng thời điểm phù hợp với chính sách kinh doanh.</li>
            <li><strong>Lưu ý về sức khỏe:</strong> Các sản phẩm từ Sâm Bố Chính của Bà Đen Farm là thực phẩm bổ dưỡng, thực phẩm bảo vệ sức khỏe. <em>Sản phẩm không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.</em> Thông tin bài viết trên website mang tính chất tham khảo kiến thức đông y, không thay thế cho chẩn đoán hoặc chỉ định của bác sĩ y khoa.</li>
          </ul>

          <h2 style={{ color: "var(--primary-color, #1a4d2e)", marginTop: "32px", marginBottom: "12px", fontSize: "22px", fontWeight: "700" }}>
            5. Chính sách Đặt hàng, Thanh toán & Giao nhận
          </h2>
          <p>
            Bà Đen Farm hỗ trợ nhiều hình thức thanh toán thuận tiện cho quý khách hàng:
          </p>
          <ul style={{ paddingLeft: "24px", marginTop: "10px", marginBottom: "16px" }}>
            <li><strong>Hình thức thanh toán:</strong> Chuyển khoản ngân hàng (MB Bank số TK: 1983 3939 6868) hoặc Thanh toán khi nhận hàng (COD).</li>
            <li><strong>Kiểm tra hàng khi nhận:</strong> Quý khách được quyền mở gói hàng kiểm tra đúng loại sản phẩm, số lượng và tình trạng bao bì trước khi thanh toán cho đơn vị giao vận.</li>
            <li><strong>Chính sách đổi trả:</strong> Đổi trả 1-1 miễn phí trong 7 ngày nếu sản phẩm hư hỏng do vận chuyển hoặc lỗi sản xuất (vỡ hũ, hỏng seal, giao sai mặt hàng).</li>
          </ul>

          <h2 style={{ color: "var(--primary-color, #1a4d2e)", marginTop: "32px", marginBottom: "12px", fontSize: "22px", fontWeight: "700" }}>
            6. Bảo mật thông tin cá nhân
          </h2>
          <p>
            Bà Đen Farm tôn trọng và cam kết bảo vệ quyền riêng tư của quý khách. Mọi thông tin thu thập (họ tên, số điện thoại, địa chỉ) chỉ được sử dụng để xử lý đơn hàng, giao hàng và chăm sóc khách hàng. Chúng tôi tuyệt đối không chia sẻ, bán hoặc trao đổi thông tin này cho bất kỳ bên thứ ba nào khác ngoài đơn vị vận chuyển đối tác.
          </p>

          <h2 style={{ color: "var(--primary-color, #1a4d2e)", marginTop: "32px", marginBottom: "12px", fontSize: "22px", fontWeight: "700" }}>
            7. Giải quyết tranh chấp & Thông tin liên hệ
          </h2>
          <p>
            Mọi tranh chấp phát sinh trong quá trình sử dụng dịch vụ hoặc mua hàng sẽ được ưu tiên giải quyết thông qua thương lượng và hòa giải trên tinh thần tôn trọng quyền lợi của khách hàng.
          </p>
          <div style={{ background: "#f8f9fa", borderLeft: "4px solid var(--primary-color, #1a4d2e)", padding: "16px 20px", marginTop: "16px", borderRadius: "0 8px 8px 0" }}>
            <p style={{ margin: 0, fontWeight: "600", color: "#1a4d2e" }}>CÔNG TY CỔ PHẦN BÀ ĐEN FARM</p>
            <p style={{ margin: "4px 0 0 0" }}>Địa chỉ: Lộ 12A, Khu phố Tân Trung, Phường Bình Minh, TP. Tây Ninh, Tỉnh Tây Ninh</p>
            <p style={{ margin: "4px 0 0 0" }}>Hotline: <a href="tel:+84919257757" style={{ color: "#1a4d2e", fontWeight: "600" }}>0919.257.757</a> — <a href="tel:+84981557957" style={{ color: "#1a4d2e", fontWeight: "600" }}>0981.557.957</a></p>
            <p style={{ margin: "4px 0 0 0" }}>Website: <a href="https://badenfarm.com.vn" target="_blank" rel="noreferrer" style={{ color: "#1a4d2e" }}>badenfarm.com.vn</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
