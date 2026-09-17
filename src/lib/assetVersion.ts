declare const __ASSET_VERSION__: string;

function withAssetVersion(src: string): string {
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}v=${typeof __ASSET_VERSION__ !== "undefined" ? __ASSET_VERSION__ : "1.0"}`;
}

export function versionedImageSrc(src: string): string {
  if (!src || !src.startsWith("/images/")) return src;
  return withAssetVersion(src);
}
