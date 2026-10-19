// Module 2: 图片压缩管道（HTML5 Canvas 等比缩放，最大宽度 1000px，JPEG 质量 0.75）
// PNG 透明通道会丢失（按 v1.md 规格统一为 JPEG）

const MAX_WIDTH = 1000;
const JPEG_QUALITY = 0.75;
const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10MB 上限保护

export async function compressImage(file: File | Blob): Promise<string> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('图片过大（超过 10MB），请压缩后再粘贴');
  }
  const bitmap = await loadBitmap(file);
  try {
    const ratio = Math.min(1, MAX_WIDTH / bitmap.width);
    const targetW = Math.round(bitmap.width * ratio);
    const targetH = Math.round(bitmap.height * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D 上下文不可用');
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } finally {
    if ('close' in bitmap) bitmap.close();
  }
}

async function loadBitmap(file: File | Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      // 回退到 HTMLImageElement
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
}

// 从剪贴板事件提取第一张图片
export function extractImageFromClipboard(e: ClipboardEvent): Blob | null {
  const items = e.clipboardData?.items;
  if (!items) return null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      return items[i].getAsFile();
    }
  }
  return null;
}
