import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { portalApi } from "../../lib/portalApi";

export interface PaymentCallbackResult {
  status?: string;
  message?: string;
  txn_ref?: string;
  amount: number;
}

export default function PortalPaymentCallback() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PaymentCallbackResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    portalApi.verifyPayment(params)
      .then((res) => {
        setResult(res);
      })
      .catch((err) => {
        console.error("Xác minh thanh toán thất bại:", err);
        setErrorMsg(err.response?.data?.error?.message || "Không thể xác thực giao dịch thanh toán.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', padding: '48px 0', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #d97706', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Đang xác thực giao dịch từ VNPay...</p>
      </div>
    );
  }

  if (errorMsg || !result || result.status !== "success") {
    const displayError = errorMsg || result?.message || "Thanh toán không thành công hoặc đã bị hủy.";
    return (
      <div className="portal-card" style={{ maxWidth: '440px', margin: '32px auto', textAlign: 'center', padding: '32px' }}>
        <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 16px' }}>
          <svg style={{ width: '36px', height: '36px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Thanh toán không thành công</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px 0' }}>{displayError}</p>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', textAlign: 'left', fontSize: '14px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          {result?.txn_ref && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Mã giao dịch:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{result.txn_ref}</span>
            </div>
          )}
          {!!result?.amount && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Số tiền:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatMoney(result.amount)}</span>
            </div>
          )}
        </div>

        <Link
          to="/portal/ledger"
          className="portal-btn-primary"
          style={{ textDecoration: 'none', display: 'inline-block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
        >
          Quay lại trang Sổ cái
        </Link>
      </div>
    );
  }

  return (
    <div className="portal-card" style={{ maxWidth: '440px', margin: '32px auto', textAlign: 'center', padding: '32px' }}>
      <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', margin: '0 auto 16px' }}>
        <svg style={{ width: '36px', height: '36px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Thanh toán thành công!</h2>
      <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px 0' }}>Giao dịch đã được xác thực an toàn qua VNPay.</p>

      <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', textAlign: 'left', fontSize: '14px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Số tiền thanh toán:</span>
          <span style={{ fontWeight: 700, color: '#166534', fontSize: '16px' }}>{formatMoney(result.amount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #bbf7d0', paddingTop: '8px', marginBottom: '6px' }}>
          <span>Mã tham chiếu:</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{result.txn_ref}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Trạng thái:</span>
          <span style={{ fontSize: '12px', background: '#166534', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>Ghi có sổ cái</span>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 24px 0' }}>
        Khoản thanh toán này đã được cộng vào số dư Có (Credit) trong sổ cái đại lý để giảm trừ tổng dư nợ hiện tại của bạn.
      </p>

      <Link
        to="/portal/ledger"
        className="portal-btn-primary"
        style={{ textDecoration: 'none', display: 'inline-block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
      >
        Xem Sổ cái công nợ
      </Link>
    </div>
  );
}
