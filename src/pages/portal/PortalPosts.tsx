import { useState } from "react";

import { versionedImageSrc } from "../../lib/assetVersion";
import { MOCK_POSTS, type PostDetail } from "../../lib/api";

export default function PortalPosts() {
  const [posts, setPosts] = useState<PostDetail[]>(() => {
    const saved = localStorage.getItem("custom_mock_posts");
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });

  const [editingPost, setEditingPost] = useState<Partial<PostDetail> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const savePostsToStorage = (newPosts: PostDetail[]) => {
    setPosts(newPosts);
    localStorage.setItem("custom_mock_posts", JSON.stringify(newPosts));
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingPost({
      id: `post-${Date.now()}`,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "/images/loi-ich-sbc.png",
      category: { id: "cat-b1", name: "Kiến thức Dược liệu", slug: "kien-thuc-duoc-lieu" },
      author_name: "Ban Quản Trị Bà Đen Farm",
      tags: [{ id: "t1", name: "SâmBốChính", slug: "sam-bo-chinh" }],
      published_at: new Date().toISOString(),
    });
  };

  const handleOpenEdit = (post: PostDetail) => {
    setIsNew(false);
    setEditingPost({ ...post });
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này khỏi trang Blog?")) {
      const updated = posts.filter((p) => p.id !== id);
      savePostsToStorage(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    const slug = editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const updatedPost: PostDetail = {
      id: editingPost.id || `post-${Date.now()}`,
      title: editingPost.title || "Bài viết không tiêu đề",
      slug: slug,
      excerpt: editingPost.excerpt || "",
      content: editingPost.content || "",
      cover_image_url: editingPost.cover_image_url || "/images/loi-ich-sbc.png",
      category: editingPost.category || { id: "cat-b1", name: "Kiến thức Dược liệu", slug: "kien-thuc-duoc-lieu" },
      author_name: editingPost.author_name || "Ban Quản Trị Bà Đen Farm",
      tags: editingPost.tags || [],
      published_at: editingPost.published_at || new Date().toISOString(),
      disclaimer: editingPost.disclaimer || "Thông tin chính thức từ Bà Đen Farm.",
      seo: { title: editingPost.title || "", description: editingPost.excerpt || "", robots: "index,follow" },
      json_ld: [],
      related: [],
    };

    let newPosts: PostDetail[];
    if (isNew) {
      newPosts = [updatedPost, ...posts];
    } else {
      newPosts = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    }

    savePostsToStorage(newPosts);
    setEditingPost(null);
    alert("Đã lưu bài viết thành công!");
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div className="portal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="portal-card-title">Quản lý Bài viết & Blog</h2>
          <p className="portal-card-desc">Chỉnh sửa, thêm bài viết tin tức mới hiển thị trên website không cần đụng mã nguồn.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="portal-btn-save"
        >
          <span>➕ Thêm bài viết mới</span>
        </button>
      </div>

      {/* Danh sách bài viết */}
      <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#334155' }}>
          Danh sách bài viết hiện tại ({posts.length})
        </div>
        <div>
          {posts.map((post) => (
            <div key={post.id} className="portal-post-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={versionedImageSrc(post.cover_image_url || "/images/loi-ich-sbc.png")}
                  alt={post.title}
                  loading="lazy"
                  width={64}
                  height={64}
                  style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{post.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                    <span style={{ fontSize: '12px', background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      {post.category?.name || "Tin tức"}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {post.published_at ? new Date(post.published_at).toLocaleDateString("vi-VN") : "Mới đăng"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="portal-btn-edit"
                >
                  ✏️ Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="portal-btn-delete"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form Thêm/Sửa */}
      {editingPost && (
        <div
          onClick={() => setEditingPost(null)}
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
                {isNew ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
              </h3>
              <button
                onClick={() => setEditingPost(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Tiêu đề bài viết (*)</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="Ví dụ: 6 Công dụng tuyệt vời của Sâm Bố Chính"
                  className="portal-input"
                />
              </div>

              <div className="portal-grid-2">
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Đường dẫn Hình ảnh (URL)</label>
                  <input
                    type="text"
                    value={editingPost.cover_image_url || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, cover_image_url: e.target.value })}
                    placeholder="/images/loi-ich-sbc.png"
                    className="portal-input"
                  />
                </div>
                <div className="portal-form-group" style={{ marginBottom: 0 }}>
                  <label>Tác giả</label>
                  <input
                    type="text"
                    value={editingPost.author_name || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, author_name: e.target.value })}
                    placeholder="Ban Biên Tập Bà Đen Farm"
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Mô tả tóm tắt (Excerpt)</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn hiển thị trên thẻ bài viết"
                  className="portal-textarea"
                />
              </div>

              <div className="portal-form-group" style={{ marginBottom: 0 }}>
                <label>Nội dung bài viết (HTML / Văn bản)</label>
                <textarea
                  rows={8}
                  value={editingPost.content || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Nhập nội dung bài viết..."
                  className="portal-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  style={{ padding: '10px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="portal-btn-save"
                >
                  💾 Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
