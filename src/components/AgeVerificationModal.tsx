import { useEffect, useState } from "react";

export default function AgeVerificationModal() {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yList: number[] = [];
    for (let y = currentYear; y >= 1930; y--) {
      yList.push(y);
    }
    setYears(yList);

    const verified = localStorage.getItem("htx369_age_verified");
    if (verified !== "true") {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  function handleConfirm() {
    if (!selectedYear) {
      setErrorMsg("⚠️ Vui lòng chọn năm sinh của bạn trước khi xác nhận.");
      return;
    }

    const birthYear = parseInt(selectedYear, 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age >= 18) {
      localStorage.setItem("htx369_age_verified", "true");
      localStorage.setItem("htx369_birth_year", birthYear.toString());
      setShowModal(false);
      document.body.style.overflow = "";
    } else {
      setErrorMsg("❌ Rất tiếc! Bạn chưa đủ 18 tuổi để truy cập website theo quy định Luật Phòng, chống tác hại của rượu, bia.");
    }
  }

  if (!showModal) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: "rgba(0, 0, 0, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "460px",
          width: "100%",
          borderRadius: "24px",
          padding: "28px 24px",
          textAlign: "center",
          color: "#FFFFFF",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          position: "relative",
          overflow: "hidden",
          border: "2px solid rgba(220, 38, 38, 0.6)",
          background: "linear-gradient(165deg, #4A040D 0%, #6E0B19 50%, #3B0209 100%)",
          boxSizing: "border-box",
          fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top Logo Circle */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            padding: "6px",
            margin: "0 auto 16px auto",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            border: "2px solid #F59E0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <img
            src="/images/logo-black.png"
            alt="Bà Đen Farm"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%",
              display: "block",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Badge Subtitle */}
        <p
          style={{
            color: "#FBBF24",
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1px",
            margin: "0 0 8px 0",
          }}
        >
          XÁC THỰC THÔNG TIN ĐỘ TUỔI TRUY CẬP
        </p>

        {/* Main Title */}
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "20px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 12px 0",
            lineHeight: 1.3,
          }}
        >
          VUI LÒNG CHỌN NĂM SINH CỦA BẠN
        </h2>

        {/* Explanation */}
        <p
          style={{
            color: "rgba(254, 243, 199, 0.9)",
            fontSize: "13px",
            lineHeight: 1.5,
            margin: "0 0 20px 0",
            padding: "0 4px",
          }}
        >
          Hệ thống dựa trên thông tin năm sinh để tính tuổi pháp lý (xác định{" "}
          <strong style={{ color: "#FCD34D", textDecoration: "underline" }}>
            đủ 18 tuổi trở lên
          </strong>
          ) làm căn cứ cho phép truy cập theo quy định.
        </p>

        {/* Select Year */}
        <div style={{ marginBottom: "16px", textAlign: "left" }}>
          <label
            htmlFor="age-verify-year-select"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "#FCD34D",
              marginBottom: "8px",
            }}
          >
            Năm sinh của bạn:
          </label>
          <select
            id="age-verify-year-select"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setErrorMsg("");
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              color: "#111827",
              fontWeight: 700,
              fontSize: "15px",
              textAlign: "center",
              border: "2px solid #F59E0B",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="">-- Chọn Năm Sinh --</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "12px",
              backgroundColor: "rgba(69, 10, 10, 0.9)",
              border: "1px solid rgba(239, 68, 68, 0.6)",
              color: "#FCA5A5",
              fontSize: "12px",
              textAlign: "center",
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          style={{
            width: "100%",
            padding: "14px 24px",
            borderRadius: "16px",
            backgroundColor: "#05A85A",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "15px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            border: "1px solid rgba(52, 211, 153, 0.4)",
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(5, 168, 90, 0.4)",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
        >
          🛡️ XÁC NHẬN & TRUY CẬP
        </button>

        {/* Disclaimer */}
        <p
          style={{
            fontSize: "11px",
            color: "rgba(253, 230, 138, 0.7)",
            lineHeight: 1.5,
            marginTop: "20px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            textAlign: "center",
            margin: "20px 0 0 0",
          }}
        >
          Thông tin năm sinh là căn cứ pháp lý để thực hiện quy định Luật Phòng,
          chống tác hại của rượu, bia. Sản phẩm rượu không dành cho người dưới 18
          tuổi.
        </p>
      </div>
    </div>
  );
}
