import type { CSSProperties } from "react";

import { versionedImageSrc } from "../lib/assetVersion";
import { imageManifest } from "../lib/imageManifest";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
}

function webpVariantUrl(src: string, width: number): string {
  const dot = src.lastIndexOf(".");
  return `${src.slice(0, dot)}-${width}w.webp`;
}

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
