import { describe, expect, it, vi } from 'vitest'

import {
  createDefaultRuntimeAdapters,
  defaultRuntimeAdapters,
  resolveRuntimeAdapters,
} from '../../../src/lib/runtime-adapters.js'

describe('runtime adapters', () => {
  it('exposes expected adapter factory methods', () => {
    const methods = [
      'createLoop',
      'createAudio',
      'createVideoRecorder',
      'captureCanvasStream',
      'createOutput',
      'createSource',
      'createGeneratorFactory',
      'createSandbox',
      'createRenderer',
      'createComposer',
      'createCss2DRenderer',
      'createCss3DRenderer',
      'createShaderMaterial',
      'createShaderPass',
    ]

    methods.forEach((name) => {
      expect(typeof defaultRuntimeAdapters[name]).toBe('function')
    })
  })

  it('creates independent default adapter objects and supports targeted overrides', () => {
    const first = createDefaultRuntimeAdapters()
    const second = createDefaultRuntimeAdapters()
    expect(first).not.toBe(second)

    const createLoop = vi.fn()
    const resolved = resolveRuntimeAdapters({ createLoop })

    expect(resolved.createLoop).toBe(createLoop)
    expect(resolved.createAudio).toBe(defaultRuntimeAdapters.createAudio)
  })
})
