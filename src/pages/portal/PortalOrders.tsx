import { useEffect, useState } from "react";
import { portalApi } from "../../lib/portalApi";

export interface Order {
  id: string;
  order_no: string;
  created_at: string;
  status: string;
  shipping_address?: string;
  total_amount: number;
}

export default function PortalOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalApi.getOrders()
      .then(res => setOrders(res ?? []))
      .finally(() => setLoading(false));
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const statusMap: Record<string, { label: string, bg: string, color: string }> = {
    draft: { label: "Bản nháp", bg: "#f1f5f9", color: "#475569" },
    confirmed: { label: "Đã xác nhận", bg: "#eff6ff", color: "#1d4ed8" },
    shipping: { label: "Đang giao", bg: "#fef9c3", color: "#854d0e" },
    completed: { label: "Hoàn thành", bg: "#f0fdf4", color: "#166534" },
    cancelled: { label: "Đã hủy", bg: "#fef2f2", color: "#991b1b" },
  };

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Đang tải lịch sử đơn hàng...</div>;

  return (
    <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Lịch sử Đơn hàng B2B</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => portalApi.exportOrders('excel')}
            style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer' }}
          >
            Xuất Excel
          </button>
          <button 
            onClick={() => portalApi.exportOrders('pdf')}
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
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Mã đơn</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Ngày đặt</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Trạng thái</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Địa chỉ giao</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Tổng tiền</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px', color: '#334155' }}>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Chưa có đơn hàng nào được tạo.
                </td>
              </tr>
            ) : (
              orders.map(order => {
                const st = statusMap[order.status] || { label: order.status, bg: "#f1f5f9", color: "#475569" };
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#166534' }}>{order.order_no}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>
                      {new Date(order.created_at).toLocaleDateString('vi-VN', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }} title={order.shipping_address}>
                      {order.shipping_address || "Mặc định"}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>
                      {formatMoney(order.total_amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
