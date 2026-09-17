import { useEffect, useState } from "react";
import { portalApi, type PortalProduct } from "../../lib/portalApi";

export default function PortalProducts() {
  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{product_id: string, qty: number, price: number, name: string}[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    portalApi.getProducts()
      .then(res => setProducts(res))
      .finally(() => setLoading(false));
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddToCart = (product: PortalProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        return prev.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product_id: product.id, qty: 1, price: product.dealer_price, name: product.name }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.product_id === id) {
        const newQty = Math.max(0, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const submitOrder = async () => {
    if (cart.length === 0) return;
    setOrdering(true);
    try {
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.qty }));
      await portalApi.createOrder(items);
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => setOrderSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đặt hàng, vui lòng thử lại.");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Đang tải danh sách sản phẩm...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
      {/* Product List */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          Sản phẩm Bán sỉ Bà Đen Farm
        </h2>

        {orderSuccess && (
          <div className="portal-alert-success" style={{ marginBottom: '20px' }}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span>Đặt hàng thành công! Đơn hàng đã được tự động ghi nhận vào công nợ.</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <div key={p.id} className="portal-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có hình</span>
                )}
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 4px 0' }}>SKU: {p.sku}</p>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0', lineHeight: '1.3' }}>{p.name}</h3>
                
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    {p.dealer_price < p.base_price && (
                      <p style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', margin: 0 }}>{formatMoney(p.base_price)}</p>
                    )}
                    <p style={{ fontSize: '16px', fontWeight: 800, color: '#166534', margin: 0 }}>
                      {formatMoney(p.dealer_price)} <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>/{p.unit}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(p)}
                    style={{ padding: '8px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                    title="Thêm vào giỏ"
                  >
                    <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="portal-card" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: '24px' }}>
        <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg style={{ width: '18px', height: '18px', color: '#64748b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Đơn hàng tạm tính</h3>
        </div>
        
        <div style={{ padding: '16px', maxHeight: '380px', overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>Chưa chọn sản phẩm nào</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map(item => (
                <div key={item.product_id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>{item.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                      <button onClick={() => updateQty(item.product_id, -1)} style={{ padding: '2px 8px', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>-</button>
                      <span style={{ padding: '2px 10px', fontSize: '13px', fontWeight: 600 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.product_id, 1)} style={{ padding: '2px 8px', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>+</button>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{formatMoney(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Tổng cộng:</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>{formatMoney(cartTotal)}</span>
            </div>
            <button 
              onClick={submitOrder}
              disabled={ordering}
              style={{ width: '100%', padding: '12px', background: '#eab308', color: '#0c2e12', fontWeight: 800, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              {ordering ? "Đang xử lý..." : "Xác nhận & Ghi nợ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
