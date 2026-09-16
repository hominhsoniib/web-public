import { useEffect, useState } from "react";
import { portalApi } from "../../lib/portalApi";

export interface LedgerItem {
  id: string;
  created_at: string;
  entry_type: "debit" | "credit";
  amount: number;
  ref_type: string;
  note?: string;
}

export default function PortalLedger() {
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    portalApi.getLedgers()
      .then(res => setLedgers(res ?? []))
      .finally(() => setLoading(false));
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePaymentSubmit = async () => {
    const amountVal = parseFloat(paymentAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      setErrorMsg("Vui lòng nhập số tiền hợp lệ lớn hơn 0.");
      return;
    }
    setPaymentLoading(true);
    setErrorMsg("");
    try {
      const paymentUrl = await portalApi.createPaymentUrl(amountVal);
      window.location.href = paymentUrl;
    } catch (err: unknown) {
      console.error(err);
      const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setErrorMsg(message || "Không thể kết nối đến VNPay. Vui lòng thử lại sau.");
      setPaymentLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Đang tải sổ cái...</div>;

  return (
    <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Sổ cái & Giao dịch Công nợ</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Ghi chú: Nợ (Debit) là mua hàng/nợ tiền. Có (Credit) là đã thanh toán hoặc giảm trừ.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setShowPaymentModal(true)}
            style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700, color: '#ffffff', background: '#d97706', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            💳 Thanh toán công nợ
          </button>
          <button 
            onClick={() => portalApi.exportLedger('excel')}
            style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer' }}
          >
            Xuất Excel
          </button>
          <button 
            onClick={() => portalApi.exportLedger('pdf')}
            style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer' }}
          >
            Xuất PDF
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Thời gian</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Loại</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Số tiền</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Nguồn/Tham chiếu</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Diễn giải</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px', color: '#334155' }}>
            {ledgers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Chưa có giao dịch công nợ nào.
                </td>
              </tr>
            ) : (
              ledgers.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', color: '#64748b' }}>
                    {new Date(l.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: l.entry_type === 'debit' ? '#fef2f2' : '#f0fdf4', color: l.entry_type === 'debit' ? '#dc2626' : '#166534' }}>
                      {l.entry_type === 'debit' ? 'GHI NỢ (-)' : 'GHI CÓ (+)'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, textAlign: 'right', color: l.entry_type === 'debit' ? '#dc2626' : '#166534' }}>
                    {formatMoney(l.amount)}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b', fontFamily: 'monospace', fontSize: '12px', textTransform: 'uppercase' }}>
                    {l.ref_type}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#0f172a' }}>
                    {l.note || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Thanh toán công nợ qua VNPay</h3>
              <button 
                onClick={() => { setShowPaymentModal(false); setErrorMsg(""); }}
                style={{ background: 'none', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              Nhập số tiền bạn muốn thanh toán. Hệ thống sẽ kết nối trực tiếp đến cổng thanh toán VNPay.
            </p>
            
            {errorMsg && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Số tiền thanh toán (VND)</label>
              <input 
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Ví dụ: 5000000"
                className="portal-input"
                style={{ fontSize: '18px', fontWeight: 700 }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setShowPaymentModal(false); setErrorMsg(""); }}
                style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handlePaymentSubmit}
                disabled={paymentLoading || !paymentAmount}
                className="portal-btn-primary"
                style={{ width: 'auto', padding: '10px 20px', fontSize: '14px' }}
              >
                {paymentLoading ? "Đang kết nối VNPay..." : "Xác nhận Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
