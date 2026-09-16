"""One-off codegen: create responsive WebP variants for large PNGs under public/images.

Usage: python scripts/generate-responsive-webp.py
Requires: Pillow (PIL). Original PNGs are left untouched (used as <img> fallback).
Prints a JSON manifest {relative_path: [widths]} at the end for imageManifest.ts.
"""

import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(ROOT, "public", "images")
SIZE_THRESHOLD_KB = 200
TARGET_WIDTHS = [480, 768, 1200]
WEBP_QUALITY = 82


def find_targets():
    targets = []
    for dirpath, _dirs, files in os.walk(IMAGES_DIR):
        for f in files:
            if not f.lower().endswith(".png"):
                continue
            full = os.path.join(dirpath, f)
            if os.path.getsize(full) / 1024 > SIZE_THRESHOLD_KB:
                targets.append(full)
    return targets


def widths_for(original_width):
    capped = {min(w, original_width) for w in TARGET_WIDTHS}
    return sorted(capped)


def to_web_path(full_path):
    rel = os.path.relpath(full_path, os.path.join(ROOT, "public")).replace("\\", "/")
    return "/" + rel


def main():
    manifest = {}
    for full in find_targets():
        im = Image.open(full).convert("RGB")
        orig_w, orig_h = im.size
        base, _ext = os.path.splitext(full)
        widths = widths_for(orig_w)

        for w in widths:
            h = round(orig_h * (w / orig_w))
            out_path = f"{base}-{w}w.webp"
            if w == orig_w:
                resized = im
            else:
                resized = im.resize((w, h), Image.LANCZOS)
            resized.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
            print(f"wrote {out_path} ({w}x{h})")

        manifest[to_web_path(full)] = widths

    manifest_path = os.path.join(ROOT, "image-manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
    print(f"\nManifest written to {manifest_path}")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
