// __ASSET_VERSION__ is injected at build time by vite.config.ts (a short hash of
// everything under public/images/). Appending it as a query string busts long-lived
// browser cache (see nginx.conf: images are served with `Cache-Control: immutable,
// max-age=31536000`) whenever any image under public/images changes.
declare const __ASSET_VERSION__: string;

function withAssetVersion(src: string): string {
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}v=${__ASSET_VERSION__}`;
}

/**
 * Nối `?v=<hash>` vào ảnh tĩnh của chính site (`/images/...`) để bust cache
 * dài hạn (nginx.conf: 1 năm immutable) khi nội dung ảnh thay đổi. Bỏ qua
 * URL rỗng hoặc không thuộc `/images/` (VD ảnh từ CDN/API thật sau này).
 */
export function versionedImageSrc(src: string): string {
  if (!src || !src.startsWith("/images/")) return src;
  return withAssetVersion(src);
}
