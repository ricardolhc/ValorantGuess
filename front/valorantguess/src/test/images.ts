import { vi } from 'vitest'

export function mockImages() {
  let autoLoad = true
  const pending = new Set<{ onload: (() => void) | null; onerror: (() => void) | null }>()
  vi.stubGlobal('Image', class {
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    decoding = ''
    decode = async () => {}
    set src(value: string) {
      if (!value) return
      pending.add(this)
      if (autoLoad) queueMicrotask(() => { pending.delete(this); this.onload?.() })
    }
  })
  return {
    pause() { autoLoad = false },
    resolve() { for (const image of pending) image.onload?.(); pending.clear() },
    reject() { for (const image of pending) image.onerror?.(); pending.clear() },
  }
}
