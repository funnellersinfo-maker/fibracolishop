/* ─── Declaraciones globales para Meta Pixel ─── */
interface Window {
  fbq: (...args: unknown[]) => void
  _fbq: (...args: unknown[]) => void
  __metaTest: () => void
  __metaDebug: boolean
}
