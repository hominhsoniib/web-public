import { useState } from "react";
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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Bài viết & Blog</h2>
          <p className="text-sm text-gray-500 mt-1">Chỉnh sửa, thêm bài viết tin tức mới hiển thị trên website không cần đụng mã nguồn.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕ Thêm bài viết mới</span>
        </button>
      </div>

      {/* Danh sách bài viết */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 flex justify-between items-center">
          <span>Danh sách bài viết hiện tại ({posts.length})</span>
        </div>
        <div className="divide-y divide-gray-100">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={post.cover_image_url || "/images/loi-ich-sbc.png"}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{post.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                      {post.category?.name || "Tin tức"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString("vi-VN") : "Mới đăng"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium rounded-md transition-colors"
                >
                  ✏️ Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium rounded-md transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {isNew ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
              </h3>
              <button
                onClick={() => setEditingPost(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề bài viết (*)</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="Ví dụ: 6 Công dụng tuyệt vời của Sâm Bố Chính"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn Hình ảnh (URL)</label>
                  <input
                    type="text"
                    value={editingPost.cover_image_url || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, cover_image_url: e.target.value })}
                    placeholder="/images/loi-ich-sbc.png"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={editingPost.author_name || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, author_name: e.target.value })}
                    placeholder="Ban Biên Tập Bà Đen Farm"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả tóm tắt (Excerpt)</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn hiển thị trên thẻ bài viết"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung bài viết (HTML / Văn bản)</label>
                <textarea
                  rows={8}
                  value={editingPost.content || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Nhập nội dung bài viết..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium shadow-md"
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
