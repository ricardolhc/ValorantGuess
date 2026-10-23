const RECORD_KEY = 'valorant-guess-best'

export function readRecord() {
  try {
    const value = Number(localStorage.getItem(RECORD_KEY))
    return { best: Number.isSafeInteger(value) && value >= 0 ? value : 0, recordSaved: true }
  } catch {
    return { best: 0, recordSaved: false }
  }
}

export function saveRecord(value: number) {
  try { localStorage.setItem(RECORD_KEY, String(value)); return true } catch { return false }
}
