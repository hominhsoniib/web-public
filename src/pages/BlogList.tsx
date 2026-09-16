import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ResponsiveImage from "../components/ResponsiveImage";
import Seo from "../components/Seo";
import { blog, fmtDate, type PostListItem } from "../lib/api";

const SITE = import.meta.env.VITE_SITE_URL ?? "http://localhost:4174";

export default function BlogList() {
  const [params] = useSearchParams();
  const category = params.get("danh-muc") ?? undefined;
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    queueMicrotask(() => setLoading(true));
    void blog.list(category, 1).then(({ items }) => {
      if (!ignore) {
        setPosts(items);
        setLoading(false);
      }
    }).catch(() => {
      if (!ignore) setLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, [category]);

  return (
    <>
      <Seo
        seo={{
          title: "Blog Kiến thức — Sâm Bà Đen",
          description:
            "Kiến thức về sâm Bà Đen: nguồn gốc, kỹ thuật trồng, chăm sóc sức khỏe và hoạt động doanh nghiệp.",
          canonical_url: SITE + "/blog",
          robots: "index,follow",
        }}
      />
      <div className="container page-top">
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span> <span>Blog</span>
        </nav>
        <h1 className="page-title">Kiến thức &amp; Câu chuyện Sâm Bà Đen</h1>
        <p className="page-lead">
          Tổng hợp bài viết về dược liệu, kỹ thuật trồng và chăm sóc sức khỏe.
        </p>
      </div>

      <div className="container section">
        {loading ? (
          <p className="muted">Đang tải…</p>
        ) : posts.length === 0 ? (
          <p className="muted">Chưa có bài viết nào được xuất bản.</p>
        ) : (
          <div className="post-grid">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="post-card">
                <div className="post-card-cover">
                  {p.cover_image_url ? (
                    <ResponsiveImage
                      src={p.cover_image_url}
                      alt={p.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="post-card-placeholder">SBĐ</div>
                  )}
                </div>
                <div className="post-card-body">
                  <span className="post-card-cat">{p.category.name}</span>
                  <h3>{p.title}</h3>
                  {p.excerpt && <p>{p.excerpt}</p>}
                  <span className="post-card-date">
                    {fmtDate(p.published_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
