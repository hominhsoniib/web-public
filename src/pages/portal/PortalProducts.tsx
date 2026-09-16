import { useEffect, useState } from "react";

import { versionedImageSrc } from "../../lib/assetVersion";
import { portalApi, type PortalProduct } from "../../lib/portalApi";

export default function PortalProducts() {
  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{product_id: string, qty: number, price: number, name: string}[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Partial<PortalProduct> | null>(null);
  const [isNew, setIsNew] = useState(false);

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

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingProduct({
      id: `p-${Date.now()}`,
      sku: "",
      name: "",
      image_url: "",
      description: "",
      unit: "Hũ",
      in_stock: true,
    });
  };

  const handleOpenEdit = (product: PortalProduct) => {
    setIsNew(false);
    setEditingProduct({ ...product });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách?")) {
      const updated = await portalApi.deleteProduct(id);
      setProducts(updated);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const name = (editingProduct.name || "").trim();
    if (!name) {
      alert("Vui lòng nhập tên sản phẩm.");
      return;
    }

    const basePrice = editingProduct.base_price;
    if (typeof basePrice !== "number" || !Number.isFinite(basePrice) || basePrice <= 0) {
      alert("Giá sản phẩm phải là số dương.");
      return;
    }

    const enteredDealerPrice = editingProduct.dealer_price;
    if (enteredDealerPrice != null && (!Number.isFinite(enteredDealerPrice) || enteredDealerPrice <= 0)) {
      alert("Giá khuyến mãi phải là số dương.");
      return;
    }

    const dealerPrice = enteredDealerPrice && enteredDealerPrice > 0 ? enteredDealerPrice : basePrice;
    const discountPercent = dealerPrice < basePrice
      ? Math.round((1 - dealerPrice / basePrice) * 100)
      : 0;

    const productData: PortalProduct = {
      id: editingProduct.id || `p-${Date.now()}`,
      sku: (editingProduct.sku || `SBD-${Date.now()}`).trim(),
      name,
      image_url: editingProduct.image_url || undefined,
      description: editingProduct.description || undefined,
      unit: (editingProduct.unit || "Sản phẩm").trim(),
      base_price: basePrice,
      dealer_price: dealerPrice,
      discount_percent: discountPercent,
      in_stock: editingProduct.in_stock ?? true,
    };

    const updated = isNew
      ? await portalApi.createProduct(productData)
      : await portalApi.updateProduct(productData);

    setProducts(updated);
    setEditingProduct(null);
    alert("Đã lưu sản phẩm thành công!");
  };

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Đang tải danh sách sản phẩm...</div>;

  return (
    <div>
      <div className="portal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="portal-card-title">Sản phẩm Bán sỉ Bà Đen Farm</h2>
          <p className="portal-card-desc">Quản lý danh mục sản phẩm hiển thị trong catalogue bán sỉ cho đại lý.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="portal-btn-save"
        >
          <span>➕ Thêm sản phẩm mới</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        {/* Product List */}
        <div>
          {orderSuccess && (
            <div className="portal-alert-success" style={{ marginBottom: '20px' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Đặt hàng thành công! Đơn hàng đã được tự động ghi nhận vào công nợ.</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {products.map(p => (
              <div key={p.id} className="portal-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  {p.image_url ? (
                    <img src={p.image_url ? versionedImageSrc(p.image_url) : undefined} alt={p.name} loading="lazy" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có hình</span>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="portal-btn-edit"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="portal-btn-delete"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      🗑️
                    </button>
                  </div>
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

      {/* Modal Form Thêm/Sửa */}
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
              maxWidth: '800px',
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
                {isNew ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="portal-grid-2">
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Tên sản phẩm (*)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ví dụ: Bột Sâm Bà Đen Nguyên Chất (100g)"
                    className="portal-input"
                  />
                </div>
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Mã SKU</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    placeholder="SBD-BOT-100"
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-grid-2">
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Giá gốc (*)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={editingProduct.base_price ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, base_price: e.target.value === "" ? undefined : Number(e.target.value) })}
                    placeholder="350000"
                    className="portal-input"
                  />
                </div>
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Giá khuyến mãi (đại lý)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingProduct.dealer_price ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dealer_price: e.target.value === "" ? undefined : Number(e.target.value) })}
                    placeholder="Để trống nếu không giảm giá"
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-grid-2">
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Đơn vị tính</label>
                  <input
                    type="text"
                    value={editingProduct.unit || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    placeholder="Hũ / Chai / Hộp..."
                    className="portal-input"
                  />
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
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Mô tả sản phẩm</label>
                <textarea
                  rows={4}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về sản phẩm..."
                  className="portal-textarea"
                />
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
