/**
 * Printable QR colors must be resolved hex.
 * `@atlaskit/tokens` returns `var(--ds-…)`, which canvas and standalone SVG
 * cannot resolve — JPG/SVG export becomes a solid black square.
 */
export const QR_PRINT_BG = '#ffffff';
export const QR_PRINT_FG = '#0f172a';

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function isPrintableCssColor(value: string): boolean {
  return HEX_COLOR.test(value.trim());
}

/**
 * Rewrite unresolved CSS-variable fills so exported SVG/JPG stays scannable.
 * First non-printable fill is treated as the background rect; the rest as modules.
 */
export function rewriteSvgFillsForPrint(svgMarkup: string): string {
  let unresolvedIndex = 0;
  return svgMarkup.replace(/fill="([^"]*)"/gi, (match, value: string) => {
    if (value === 'none' || isPrintableCssColor(value)) {
      return match;
    }
    const hex = unresolvedIndex === 0 ? QR_PRINT_BG : QR_PRINT_FG;
    unresolvedIndex += 1;
    return `fill="${hex}"`;
  });
}

export function serializeQrSvgForExport(svgMarkup: string): string {
  let markup = rewriteSvgFillsForPrint(svgMarkup);
  if (!/xmlns=/.test(markup)) {
    markup = markup.replace(
      /<svg\b/i,
      '<svg xmlns="http://www.w3.org/2000/svg"'
    );
  }
  return markup;
}

export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadQrSvg(svg: Element, filename: string): void {
  const markup = serializeQrSvgForExport(
    new XMLSerializer().serializeToString(svg)
  );
  triggerFileDownload(
    new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }),
    filename
  );
}

export function downloadQrJpg(
  svg: Element,
  filename: string,
  pixelSize = 1024
): Promise<void> {
  const svgData = serializeQrSvgForExport(
    new XMLSerializer().serializeToString(svg)
  );
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas unavailable'));
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = QR_PRINT_BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('JPG export failed'));
            return;
          }
          triggerFileDownload(blob, filename);
          resolve();
        },
        'image/jpeg',
        0.95
      );
    };
    img.onerror = () => reject(new Error('QR image failed to load'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
  });
}
