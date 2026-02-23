if (typeof window === 'undefined' || typeof document === 'undefined') {
  throw new Error(
    'triode is browser-only at runtime. Import it from a browser context (script tag or browser bundler entry).'
  )
}

await import('../dist/triode.js')

const Triode =
  globalThis.Triode ||
  (typeof window !== "undefined" ? window.Triode : undefined) ||
  globalThis.Hydra ||
  (typeof window !== "undefined" ? window.Hydra : undefined);

export default Triode
