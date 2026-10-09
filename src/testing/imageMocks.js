import { vi } from 'vitest'

/**
 * jsdom can't decode pictures or draw on a canvas, so this stands in for both:
 * `createImageBitmap` yields a picture of the given size, and the canvas records what is drawn on it.
 * Returns the recorded calls.
 */
export function stubImagePipeline({ width = 800, height = 600, dataUrl = 'data:image/jpeg;base64,TEST' } = {}) {
  const ctx = { fillStyle: '', fillRect: vi.fn(), drawImage: vi.fn() }
  const bitmap = { width, height, close: vi.fn() }
  vi.stubGlobal('createImageBitmap', vi.fn(async () => bitmap))
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx)
  const toDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(dataUrl)
  return { ctx, bitmap, toDataURL }
}
