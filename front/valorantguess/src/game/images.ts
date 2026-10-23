export function loadAbilityImage(url: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException('Cancelled', 'AbortError')); return }
    const image = new Image()
    image.decoding = 'async'
    const finish = (error?: Error) => {
      clearTimeout(timeout)
      signal.removeEventListener('abort', abort)
      image.onload = null
      image.onerror = null
      if (error) { image.src = ''; reject(error) } else resolve()
    }
    const abort = () => finish(new DOMException('Cancelled', 'AbortError'))
    const timeout = setTimeout(() => finish(new Error('Image timed out')), 15000)
    signal.addEventListener('abort', abort, { once: true })
    image.onload = () => {
      image.decode().then(() => finish(), () => finish(new Error('Invalid image')))
    }
    image.onerror = () => finish(new Error('Image unavailable'))
    image.src = url
  })
}
