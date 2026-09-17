import { useEffect, useState } from "react";
import { portalApi, type PortalProduct } from "../../lib/portalApi";

export default function PortalProducts() {
  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{product_id: string, qty: number, price: number, name: string}[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Modal State cho Thêm / Sửa sản phẩm Admin
  const [editingProduct, setEditingProduct] = useState<Partial<PortalProduct> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    portalApi.getProducts()
      .then(res => setProducts(res))
      .finally(() => setLoading(false));
  }, []);

  const saveProductsList = (newList: PortalProduct[]) => {
    setProducts(newList);
    portalApi.saveProducts(newList);
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingProduct({
      id: `p-${Date.now()}`,
      sku: `SBD-NEW-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      base_price: 300000,
      dealer_price: 240000,
      unit: "Hộp",
      image_url: "/images/products/bot-sam.jpg",
      description: "",
      discount_percent: 20,
      in_stock: true,
    });
  };

  const handleOpenEdit = (product: PortalProduct) => {
    setIsNew(false);
    setEditingProduct({ ...product });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi danh mục hệ thống?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProductsList(updated);
    }
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    const basePrice = Number(editingProduct.base_price) || 0;
    const dealerPrice = Number(editingProduct.dealer_price) || Math.round(basePrice * 0.8);
    const discount = basePrice > 0 ? Math.round(((basePrice - dealerPrice) / basePrice) * 100) : 0;

    const updatedProduct: PortalProduct = {
      id: editingProduct.id || `p-${Date.now()}`,
      sku: editingProduct.sku || `SBD-SKU-${Date.now().toString().slice(-4)}`,
      name: editingProduct.name,
      base_price: basePrice,
      dealer_price: dealerPrice,
      discount_percent: discount,
      unit: editingProduct.unit || "Hộp",
      image_url: editingProduct.image_url || "/images/products/bot-sam.jpg",
      description: editingProduct.description || "",
      in_stock: editingProduct.in_stock !== false,
    };

    let newProducts: PortalProduct[];
    if (isNew) {
      newProducts = [updatedProduct, ...products];
    } else {
      newProducts = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    }

    saveProductsList(newProducts);
    setEditingProduct(null);
    alert(isNew ? "Đã thêm sản phẩm mới thành công!" : "Đã cập nhật sản phẩm thành công!");
  };

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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
      {/* Main Product Area */}
      <div>
        <div className="portal-alert-warning">
          <span aria-hidden="true">⚠️</span>
          <span>
            <strong>Lưu ý:</strong> Dữ liệu sản phẩm hiện chỉ lưu trên trình duyệt này (localStorage).
            Xoá cache hoặc đổi thiết bị/trình duyệt sẽ mất toàn bộ chỉnh sửa. Hãy export backup định kỳ
            (tính năng export sẽ được bổ sung sau).
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Quản lý Danh mục & Sản phẩm
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              Thêm mới, chỉnh sửa giá bán sỉ/bán lẻ, xóa hoặc cập nhật ảnh sản phẩm hiển thị trên website.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="portal-btn-save"
            style={{ padding: '10px 18px', fontSize: '14px', fontWeight: 700 }}
          >
            <span>➕ Thêm sản phẩm mới</span>
          </button>
        </div>

        {orderSuccess && (
          <div className="portal-alert-success" style={{ marginBottom: '20px' }}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span>Đặt hàng thành công! Đơn hàng đã được tự động ghi nhận vào công nợ.</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <div key={p.id} className="portal-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có hình</span>
                )}
                {!p.in_stock && (
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                    Hết hàng
                  </span>
                )}
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>SKU: {p.sku}</span>
                  {p.discount_percent > 0 && (
                    <span style={{ fontSize: '11px', background: '#fef2f2', color: '#dc2626', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                      Giảm {p.discount_percent}%
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.3' }}>
                  {p.name}
                </h3>
                {p.description && (
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                )}
                
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      {p.dealer_price < p.base_price && (
                        <p style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', margin: 0 }}>{formatMoney(p.base_price)}</p>
                      )}
                      <p style={{ fontSize: '16px', fontWeight: 800, color: '#166534', margin: 0 }}>
                        {formatMoney(p.dealer_price)} <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>/{p.unit}</span>
                      </p>
                    </div>
                  </div>

                  {/* Admin Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      style={{ padding: '6px 10px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ padding: '6px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      🗑️ Xóa
                    </button>
                    <button 
                      onClick={() => handleAddToCart(p)}
                      style={{ padding: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                      title="Thêm vào đơn sỉ"
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>
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

      {/* Modal Form Thêm / Chỉnh Sửa Sản Phẩm */}
      {editingProduct && (
        <div
          onClick={() => setEditingProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {isNew ? "📦 Thêm sản phẩm mới" : "✏️ Chỉnh sửa sản phẩm"}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="portal-grid-2">
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Mã SKU (*)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    placeholder="SBD-BOT-100"
                    className="portal-input"
                  />
                </div>
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Đơn vị tính (*)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.unit || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    placeholder="Hũ, Chai, Hộp, Set..."
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Tên sản phẩm (*)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Bột Sâm Bà Đen Nguyên Chất (100g)"
                  className="portal-input"
                />
              </div>

              <div className="portal-grid-2">
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Giá niêm yết Bán lẻ (VNĐ) (*)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={editingProduct.base_price ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                    className="portal-input"
                  />
                </div>
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Giá sỉ Đại lý (VNĐ) (*)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={editingProduct.dealer_price ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dealer_price: Number(e.target.value) })}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Đường dẫn Hình ảnh (URL)</label>
                <input
                  type="text"
                  value={editingProduct.image_url || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  placeholder="/images/products/bot-sam.jpg"
                  className="portal-input"
                />
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Mô tả ngắn sản phẩm</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Mô tả công dụng dược tính sản phẩm..."
                  className="portal-textarea"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="in_stock_chk"
                  checked={editingProduct.in_stock !== false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#166534', cursor: 'pointer' }}
                />
                <label htmlFor="in_stock_chk" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                  Còn hàng trong kho (bật để cho phép đặt mua)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{ padding: '10px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="portal-btn-save"
                >
                  💾 Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
