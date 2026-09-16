import { useOutletContext, Link } from "react-router-dom";
import type { PortalDealerProfile } from "../../lib/portalApi";

export default function PortalDashboard() {
  const { profile } = useOutletContext<{ profile: PortalDealerProfile }>();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const availableCredit = profile.credit_limit - profile.balance;
  const creditUsagePercent = profile.credit_limit > 0 
    ? Math.min(100, Math.max(0, (profile.balance / profile.credit_limit) * 100)) 
    : 0;

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Welcome Banner */}
      <div className="portal-card" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
          Xin chào, {profile.contact_name || profile.name}!
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
          Chào mừng bạn trở lại Hệ thống Quản trị & B2B của Sâm Bố Chính Bà Đen Farm.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        {/* Card 1: Nợ hiện tại */}
        <div className="portal-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Dư nợ hiện tại</span>
              <span style={{ padding: '8px', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
            </div>
            <p style={{ fontSize: '26px', fontWeight: 800, color: profile.balance > 0 ? '#dc2626' : '#0f172a', margin: '0 0 12px 0' }}>
              {formatMoney(profile.balance)}
            </p>
          </div>
          <Link to="/portal/ledger" style={{ fontSize: '14px', color: '#15803d', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
            <span>Xem sao kê công nợ</span>
            <span style={{ fontSize: '12px' }}>→</span>
          </Link>
        </div>

        {/* Card 2: Hạn mức khả dụng */}
        <div className="portal-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Hạn mức Khả dụng</span>
              <span style={{ padding: '8px', background: '#f0fdf4', color: '#166534', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </span>
            </div>
            <p style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
              {formatMoney(availableCredit)}
            </p>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '4px', width: `${creditUsagePercent}%`, background: creditUsagePercent > 80 ? '#ef4444' : '#22c55e' }}></div>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', margin: '8px 0 0 0' }}>
            Tổng hạn mức: {formatMoney(profile.credit_limit)}
          </p>
        </div>

        {/* Card 3: Quick Action */}
        <div style={{ background: 'linear-gradient(135deg, #0c2e12 0%, #166534 100%)', borderRadius: '16px', padding: '28px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 25px rgba(12, 46, 18, 0.2)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#facc15' }}>Tác vụ Nhanh Admin</h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: '0 0 20px 0' }}>Chỉnh sửa thông tin liên hệ, sứ mệnh & 7 điều khoản sử dụng website.</p>
          <Link to="/portal/settings" style={{ padding: '10px 20px', background: '#eab308', color: '#0c2e12', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
            ⚙️ Đến Cấu hình Website
          </Link>
        </div>

      </div>
    </div>
  );
}
