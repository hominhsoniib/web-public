import { useState, useEffect } from "react";
import {
  getPartners,
  savePartners,
  addPartner,
  updatePartner,
  deletePartner,
  type PartnerItem,
} from "../../lib/partners";

const EMOJI_OPTIONS = ["🏫", "🤝", "🏬", "🌿", "🏆", "🌾", "🏢", "💼", "⭐", "🌐", "🏭", "📦"];

export default function PortalPartners() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("🏫");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(1);

  useEffect(() => {
    loadPartners();
    const handleUpdate = () => {
      setPartners(getPartners());
    };
    window.addEventListener("partners_updated", handleUpdate);
    return () => window.removeEventListener("partners_updated", handleUpdate);
  }, []);

  const loadPartners = () => {
    setPartners(getPartners());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setName("");
    setUrl("");
    setIcon("🏫");
    setDescription("");
    setActive(true);
    setOrder(partners.length + 1);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: PartnerItem) => {
    setEditingPartner(p);
    setName(p.name);
    setUrl(p.url);
    setIcon(p.icon || "🏫");
    setDescription(p.description || "");
    setActive(p.active);
    setOrder(p.order || 1);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      alert("Vui lòng điền đầy đủ Tên đối tác và Link Website!");
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    if (editingPartner) {
      updatePartner(editingPartner.id, {
        name: name.trim(),
        url: formattedUrl,
        icon,
        description: description.trim(),
        active,
        order: Number(order) || 1,
      });
      showToast(`✅ Đã cập nhật thông tin đối tác "${name}"!`);
    } else {
      addPartner({
        name: name.trim(),
        url: formattedUrl,
        icon,
        description: description.trim(),
        active,
        order: Number(order) || 1,
      });
      showToast(`🎉 Đã thêm đối tác mới "${name}" thành công!`);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (p: PartnerItem) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá đối tác "${p.name}"?`)) {
      deletePartner(p.id);
      showToast(`🗑️ Đã xoá đối tác "${p.name}".`);
    }
  };

  const handleToggleActive = (p: PartnerItem) => {
    const updatedStatus = !p.active;
    updatePartner(p.id, { active: updatedStatus });
    showToast(
      updatedStatus
        ? `👁️ Đã hiện đối tác "${p.name}" trên website public.`
        : `🙈 Đã ẩn đối tác "${p.name}" khỏi website public.`
    );
  };

  const handleReorder = (id: string, direction: "up" | "down") => {
    const sorted = [...partners].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex((p) => p.id === id);
    if (idx === -1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    // Swap order values
    const tempOrder = sorted[idx].order;
    sorted[idx].order = sorted[targetIdx].order;
    sorted[targetIdx].order = tempOrder;

    savePartners(sorted);
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      {/* Header Card */}
      <div className="portal-card" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h2 className="portal-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              🤝 Quản lý Danh sách Đối tác
            </h2>
            <p className="portal-card-desc">
              Thêm, sửa, ẩn/hiện đối tác liên kết. Các đối tác đang mở (Bật) sẽ tự động xuất hiện trong Menu "Đối tác" trên website public.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="portal-btn-save"
            style={{
              padding: "10px 18px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#15803d",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ➕ Thêm Đối tác Mới
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="portal-alert-success" style={{ marginBottom: "20px" }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Partner Form Modal / Drawer */}
      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            className="portal-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              marginBottom: 0,
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "12px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                {editingPartner ? "✏️ Chỉnh sửa Đối tác" : "➕ Thêm Đối tác Mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "#334155", fontSize: "14px" }}>
                  Tên đối tác (*)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="portal-input"
                  placeholder="Ví dụ: HTX GD 369 hoặc Công ty Dược ABC"
                />
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "#334155", fontSize: "14px" }}>
                  Đường dẫn Website / Link liên kết (*)
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="portal-input"
                  placeholder="https://369-daotao.vercel.app/"
                />
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "#334155", fontSize: "14px" }}>
                  Biểu tượng / Icon
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "6px" }}>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="portal-input"
                    style={{ width: "80px", textAlign: "center", fontSize: "18px" }}
                  />
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {EMOJI_OPTIONS.map((eOpt) => (
                      <button
                        key={eOpt}
                        type="button"
                        onClick={() => setIcon(eOpt)}
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "6px",
                          border: icon === eOpt ? "2px solid #15803d" : "1px solid #cbd5e1",
                          background: icon === eOpt ? "#f0fdf4" : "#ffffff",
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      >
                        {eOpt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "#334155", fontSize: "14px" }}>
                  Mô tả ngắn (Tuỳ chọn)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="portal-textarea"
                  placeholder="Mô tả tóm tắt vai trò hoặc hoạt động của đối tác..."
                />
              </div>

              <div className="portal-grid-2">
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontWeight: 600, color: "#334155", fontSize: "14px" }}>
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="portal-input"
                  />
                </div>

                <div className="portal-form-group" style={{ marginBottom: 0, justifyContent: "center" }}>
                  <label style={{ fontWeight: 600, color: "#334155", fontSize: "14px", marginBottom: "8px" }}>
                    Trạng thái hiển thị
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#15803d" }}
                    />
                    <span>{active ? "🟢 Cho phép hiển thị lên Menu" : "🔴 Ẩn khỏi website"}</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  style={{
                    padding: "8px 16px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="portal-btn-save"
                  style={{
                    padding: "8px 20px",
                    fontSize: "14px",
                    background: "#15803d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  💾 {editingPartner ? "Lưu thay đổi" : "Tạo đối tác"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partners List Table */}
      <div className="portal-card" style={{ padding: 0, overflow: "hidden" }}>
        {partners.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            <p style={{ fontSize: "16px", margin: "0 0 12px 0" }}>Chưa có đối tác nào trong hệ thống.</p>
            <button
              onClick={handleOpenAdd}
              style={{
                padding: "8px 16px",
                background: "#15803d",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ➕ Thêm đối tác đầu tiên
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                  <th style={{ padding: "14px 16px", width: "50px", textAlign: "center" }}>STT</th>
                  <th style={{ padding: "14px 16px", width: "60px", textAlign: "center" }}>Icon</th>
                  <th style={{ padding: "14px 16px" }}>Tên Đối tác</th>
                  <th style={{ padding: "14px 16px" }}>Đường dẫn (URL)</th>
                  <th style={{ padding: "14px 16px" }}>Mô tả</th>
                  <th style={{ padding: "14px 16px", width: "120px", textAlign: "center" }}>Trạng thái</th>
                  <th style={{ padding: "14px 16px", width: "140px", textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {partners
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((p, idx) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 16px", textAlign: "center", color: "#94a3b8", fontWeight: 600 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                          <span>{p.order || idx + 1}</span>
                          <div style={{ display: "flex", gap: "2px" }}>
                            <button
                              type="button"
                              onClick={() => handleReorder(p.id, "up")}
                              disabled={idx === 0}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: idx === 0 ? "default" : "pointer",
                                opacity: idx === 0 ? 0.2 : 0.7,
                                fontSize: "10px",
                              }}
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReorder(p.id, "down")}
                              disabled={idx === partners.length - 1}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: idx === partners.length - 1 ? "default" : "pointer",
                                opacity: idx === partners.length - 1 ? 0.2 : 0.7,
                                fontSize: "10px",
                              }}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center", fontSize: "20px" }}>
                        {p.icon || "🏫"}
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a" }}>
                        {p.name}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#15803d",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: 500,
                            wordBreak: "break-all",
                          }}
                        >
                          <span>{p.url}</span>
                          <span style={{ fontSize: "12px", opacity: 0.7 }}>↗</span>
                        </a>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#64748b", maxWidth: "240px" }}>
                        {p.description || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            background: p.active ? "#dcfce7" : "#fee2e2",
                            color: p.active ? "#15803d" : "#b91c1c",
                          }}
                        >
                          {p.active ? "🟢 Hiển thị" : "🔴 Ẩn"}
                        </button>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            style={{
                              padding: "6px 12px",
                              background: "#f0fdf4",
                              color: "#166534",
                              border: "1px solid #bbf7d0",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            style={{
                              padding: "6px 12px",
                              background: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Xoá
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
