// Turns a user's picture into a small square JPEG data URL that fits comfortably in localStorage
// and in a .docx. Everything happens in the browser; the picture is never uploaded anywhere.

import { t } from '../i18n/core.js'

export const PHOTO_SIZE = 320            // px, the stored square's side. Plenty for a ~100px print.
export const PHOTO_QUALITY = 0.85
export const MAX_PHOTO_FILE_BYTES = 15 * 1024 * 1024

/** The largest centred square inside a width x height picture, as a source rectangle to draw from. */
export function centerCropSquare(width, height) {
  const side = Math.min(width, height)
  return { sx: Math.round((width - side) / 2), sy: Math.round((height - side) / 2), side }
}

/** Why a file can't be used as a photo, or '' when it can. */
export function photoFileProblem(file) {
  if (!file || !/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return t('photoErrors.wrongType')
  if (file.size > MAX_PHOTO_FILE_BYTES) return t('photoErrors.tooLarge')
  return ''
}

/** Splits a data URL into its media type and raw bytes, or null when it isn't a base64 image. */
export function parseImageDataUrl(dataUrl) {
  const match = /^data:(image\/[a-z+.-]+);base64,([A-Za-z0-9+/=]+)$/i.exec(dataUrl || '')
  if (!match) return null
  const binary = atob(match[2])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return { type: match[1].toLowerCase(), bytes }
}

/** Reads an image file, crops it to a centred square and returns it as a JPEG data URL. */
export async function fileToPhotoDataUrl(file) {
  const problem = photoFileProblem(file)
  if (problem) throw new Error(problem)

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error(t('photoErrors.unreadable'))
  }

  const { sx, sy, side } = centerCropSquare(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = PHOTO_SIZE
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff' // transparent PNGs would turn black as JPEG otherwise
  ctx.fillRect(0, 0, PHOTO_SIZE, PHOTO_SIZE)
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE)
  bitmap.close?.()
  return canvas.toDataURL('image/jpeg', PHOTO_QUALITY)
}
