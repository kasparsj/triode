// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'

import { initCanvas } from '../../src/canvas.js'

const createRuntime = () => ({
  _disposed: false,
  setResolution: vi.fn(),
  synth: {
    click: vi.fn(),
    mousedown: vi.fn(),
    mouseup: vi.fn(),
    mousemove: vi.fn(),
    keydown: vi.fn(),
    keyup: vi.fn(),
  },
})

describe('canvas input routing and lifecycle behavior', () => {
  it('binds input listeners only once per canvas and routes to latest runtime', () => {
    const canvas = document.createElement('canvas')
    const runtimeA = createRuntime()
    const runtimeB = createRuntime()

    initCanvas(canvas, runtimeA)

    const canvasAddSpy = vi.spyOn(canvas, 'addEventListener')
    const documentAddSpy = vi.spyOn(document, 'addEventListener')

    initCanvas(canvas, runtimeB)

    expect(canvasAddSpy).not.toHaveBeenCalled()
    expect(documentAddSpy).not.toHaveBeenCalled()

    canvas.dispatchEvent(new MouseEvent('click'))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))

    expect(runtimeA.synth.click).not.toHaveBeenCalled()
    expect(runtimeB.synth.click).toHaveBeenCalledTimes(1)
    expect(runtimeB.synth.keydown).toHaveBeenCalledTimes(1)

    runtimeB._disposed = true
    canvas.dispatchEvent(new MouseEvent('mousedown'))
    expect(runtimeB.synth.mousedown).not.toHaveBeenCalled()
  })

  it('exposes HiDPI helper and forwards computed resolution', () => {
    const canvas = document.createElement('canvas')
    const runtime = createRuntime()

    const initialized = initCanvas(canvas, runtime)
    initialized.setHiDPI(2)

    expect(runtime.setResolution).toHaveBeenCalledWith(
      window.innerWidth * 2,
      window.innerHeight * 2
    )
  })
})
