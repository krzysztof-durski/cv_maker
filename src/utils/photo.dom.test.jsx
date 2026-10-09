import { describe, it, expect, afterEach, vi } from 'vitest'
import { fileToPhotoDataUrl, PHOTO_SIZE, PHOTO_QUALITY } from './photo'
import { stubImagePipeline } from '../testing/imageMocks'

const file = (type = 'image/png', size = 10) => {
  const f = new File(['x'], 'me', { type })
  Object.defineProperty(f, 'size', { value: size })
  return f
}

describe('fileToPhotoDataUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns a JPEG data URL of the standard size and quality', async () => {
    const { toDataURL } = stubImagePipeline({ dataUrl: 'data:image/jpeg;base64,DONE' })
    expect(await fileToPhotoDataUrl(file())).toBe('data:image/jpeg;base64,DONE')
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg', PHOTO_QUALITY)
  })

  it('crops the middle square of a landscape picture into the output square', async () => {
    const { ctx } = stubImagePipeline({ width: 1000, height: 600 })
    await fileToPhotoDataUrl(file())
    expect(ctx.drawImage).toHaveBeenCalledWith(expect.anything(), 200, 0, 600, 600, 0, 0, PHOTO_SIZE, PHOTO_SIZE)
  })

  it('crops the middle square of a portrait picture', async () => {
    const { ctx } = stubImagePipeline({ width: 600, height: 1000 })
    await fileToPhotoDataUrl(file())
    expect(ctx.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 200, 600, 600, 0, 0, PHOTO_SIZE, PHOTO_SIZE)
  })

  it('paints white first so transparent pictures do not turn black', async () => {
    const { ctx } = stubImagePipeline()
    await fileToPhotoDataUrl(file())
    expect(ctx.fillStyle).toBe('#fff')
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, PHOTO_SIZE, PHOTO_SIZE)
    expect(ctx.fillRect.mock.invocationCallOrder[0]).toBeLessThan(ctx.drawImage.mock.invocationCallOrder[0])
  })

  it('releases the decoded picture', async () => {
    const { bitmap } = stubImagePipeline()
    await fileToPhotoDataUrl(file())
    expect(bitmap.close).toHaveBeenCalled()
  })

  it('refuses files that are not pictures, without trying to read them', async () => {
    stubImagePipeline()
    await expect(fileToPhotoDataUrl(file('application/pdf'))).rejects.toThrow(/JPG, PNG, WebP or GIF/)
    expect(createImageBitmap).not.toHaveBeenCalled()
  })

  it('refuses huge files', async () => {
    stubImagePipeline()
    await expect(fileToPhotoDataUrl(file('image/png', 16 * 1024 * 1024))).rejects.toThrow(/too large/)
  })

  it('says so when the picture is damaged', async () => {
    stubImagePipeline()
    createImageBitmap.mockRejectedValue(new Error('decode failed'))
    await expect(fileToPhotoDataUrl(file())).rejects.toThrow(/couldn't be read as a picture/)
  })
})
