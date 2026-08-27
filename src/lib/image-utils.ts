/**
 * Resizes and compresses an image file to a Base64 data URL using HTML5 Canvas.
 * @param file The image File to compress
 * @param maxWidth Max width in pixels (e.g. 1200 for cover, 256 for avatar)
 * @param maxHeight Max height in pixels (e.g. 400 for cover, 256 for avatar)
 * @param quality Quality from 0.1 to 1.0 (default: 0.8)
 */
export async function compressImageToBase64(
  file: File,
  maxWidth = 1000,
  maxHeight = 400,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate new dimensions keeping aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(event.target?.result as string)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        // Try WebP first for optimal compression, fallback to JPEG
        try {
          const webpData = canvas.toDataURL("image/webp", quality)
          if (webpData.startsWith("data:image/webp")) {
            resolve(webpData)
            return
          }
        } catch {
          // Fallback
        }

        const jpegData = canvas.toDataURL("image/jpeg", quality)
        resolve(jpegData)
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}
