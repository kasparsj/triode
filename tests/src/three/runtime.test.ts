import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  bindRuntimeModule,
  clearRuntime,
  getRuntime,
  setRuntime,
  withRuntime,
} from '../../../src/three/runtime.js'

afterEach(() => {
  clearRuntime()
})

describe('three/runtime', () => {
  it('throws when runtime is requested outside runtime scope', () => {
    expect(() => getRuntime()).toThrow(
      'Triode runtime is not initialized. Create a Triode instance before using 3D helpers.'
    )
  })

  it('resolves runtime inside withRuntime and restores previous active runtime', () => {
    const runtimeA = { id: 'A' }
    const runtimeB = { id: 'B' }

    setRuntime(runtimeA)
    setRuntime(runtimeB)

    const inside = withRuntime(runtimeA, () => getRuntime())
    expect(inside).toBe(runtimeA)

    const nested = withRuntime(runtimeB, () =>
      withRuntime(runtimeA, () => getRuntime())
    )
    expect(nested).toBe(runtimeA)
  })

  it('binds module methods to runtime scope while preserving values', () => {
    const runtime = { id: 'runtime' }
    const method = vi.fn((arg) => {
      expect(getRuntime()).toBe(runtime)
      return `ok:${arg}`
    })

    const moduleApi = {
      method,
      constant: 42,
    }

    const bound = bindRuntimeModule(moduleApi, runtime)

    expect(bound.constant).toBe(42)
    expect(bound.method('x')).toBe('ok:x')
    expect(method).toHaveBeenCalledWith('x')
  })
})
