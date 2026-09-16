import type { CSSProperties } from "react";

import { versionedImageSrc } from "../lib/assetVersion";
import { imageManifest } from "../lib/imageManifest";

interface ResponsiveImageProps {
  /** Đường dẫn ảnh gốc (PNG), ví dụ "/images/products/sam-say.png" */
  src: string;
  alt: string;
  /** Giá trị `sizes` cho <source>/<img> — quyết định browser chọn ảnh nào theo viewport */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  /**
   * Kích thước gốc (px) của ảnh — dùng làm HTML attribute width/height trên <img>.
   * Trình duyệt dùng cặp giá trị này để tính tỷ lệ khung hình và giữ chỗ đúng
   * trước khi ảnh tải xong (chống layout shift), ngay cả khi CSS scale ảnh
   * theo width:100%/height:auto.
   */
  width?: number;
  height?: number;
}

function webpVariantUrl(src: string, width: number): string {
  const dot = src.lastIndexOf(".");
  return `${src.slice(0, dot)}-${width}w.webp`;
}

/**
 * <picture> wrapper: phục vụ WebP responsive (theo imageManifest) cho browser hỗ trợ,
 * fallback về đúng <img> PNG gốc cho browser không hỗ trợ WebP hoặc ảnh chưa có biến thể.
 */
export default function ResponsiveImage({
  src,
  alt,
  sizes = "100vw",
  className,
  style,
  loading = "lazy",
  width,
  height,
}: ResponsiveImageProps) {
  const widths = imageManifest[src];

  if (!widths || widths.length === 0) {
    return (
      <img
        src={versionedImageSrc(src)}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        width={width}
        height={height}
      />
    );
  }

  const srcSet = widths
    .map((w) => `${versionedImageSrc(webpVariantUrl(src, w))} ${w}w`)
    .join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={versionedImageSrc(src)}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        width={width}
        height={height}
      />
    </picture>
  );
}
