/**
 * ============================================================================
 * TODO(migrate-to-backend): Resize ảnh phía client + lưu base64 vào
 * localStorage — GIẢI PHÁP TẠM cho tới khi có backend thật.
 * Chỉ tồn tại vì hiện chưa có backend/CDN nào để upload ảnh thật lên (xem audit
 * badenfarm.com.vn — không có API nào phản hồi). Khi có backend thật, XÓA file
 * này và thay bằng upload thật: <input type="file"> gửi multipart/form-data
 * lên endpoint backend (hoặc PUT thẳng lên S3/Cloudinary qua signed URL do
 * backend cấp), backend trả về URL CDN thật, lưu URL đó vào image_url thay vì
 * data URL base64. Ảnh upload cần pipeline resize riêng ở thời điểm upload
 * (khác generate-responsive-webp.py — script đó chỉ chạy build-time cho ảnh
 * có sẵn trong repo, không áp dụng được cho ảnh upload runtime).
 * ============================================================================
 */

const MAX_IMAGE_DIMENSION = 800; // px, cạnh dài nhất sau resize
const MAX_IMAGE_BYTES = 400 * 1024; // 400KB — ngân sách tối đa 1 ảnh trong localStorage dùng chung

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Không đọc được file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Không đọc được ảnh — file có thể bị hỏng hoặc không đúng định dạng."));
    img.src = src;
  });
}

/** Ước lượng dung lượng byte thật của 1 data URL base64. */
export function dataUrlSizeBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

/**
 * Resize ảnh về tối đa MAX_IMAGE_DIMENSION px (cạnh dài nhất), nén WebP 80% qua
 * canvas, trả về data URL. Ném lỗi nếu vượt MAX_IMAGE_BYTES sau khi nén.
 */
export async function resizeImageToDataUrl(file: File): Promise<string> {
  const originalDataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(originalDataUrl);

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh (canvas 2D context).");
  ctx.drawImage(img, 0, 0, width, height);

  const resizedDataUrl = canvas.toDataURL("image/webp", 0.8);
  const sizeBytes = dataUrlSizeBytes(resizedDataUrl);
  if (sizeBytes > MAX_IMAGE_BYTES) {
    throw new Error(
      `Ảnh sau khi nén còn ${(sizeBytes / 1024).toFixed(0)}KB, vượt giới hạn ${MAX_IMAGE_BYTES / 1024}KB. Vui lòng chọn ảnh khác hoặc ảnh có độ phân giải thấp hơn.`,
    );
  }

  return resizedDataUrl;
}
