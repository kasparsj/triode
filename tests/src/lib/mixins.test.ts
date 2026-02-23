import { describe, expect, it, vi } from 'vitest'

import { autoClearMixin, sourceMixin } from '../../../src/lib/mixins.js'

describe('lib/mixins source chaining', () => {
  it('out() compiles and writes passes to default output when output is omitted', () => {
    const defaultOutput = {
      _set: vi.fn(),
    }
    const source = {
      defaultOutput,
      output: null,
      compile: vi.fn(() => ['pass']),
    }

    const result = sourceMixin.out.call(source)

    expect(result).toBe(source)
    expect(source.output).toBe(defaultOutput)
    expect(source.compile).toHaveBeenCalledTimes(1)
    expect(defaultOutput._set).toHaveBeenCalledWith(['pass'], {})
  })

  it('normalizes render option object signatures in out/render', () => {
    const targetOutput = {
      _set: vi.fn(),
    }
    const source = {
      defaultOutput: targetOutput,
      output: null,
      compile: vi.fn(() => ['pass']),
      out: sourceMixin.out,
    }

    sourceMixin.render.call(
      source,
      {
        to: targetOutput,
        target: 'rt',
        css: '2d',
        autoClear: 0.5,
      },
      { fx: { bloom: true } }
    )

    expect(targetOutput._set).toHaveBeenCalledWith(
      ['pass'],
      expect.objectContaining({
        renderTarget: 'rt',
        cssRenderer: '2d',
        autoClear: 0.5,
        fx: { bloom: true },
      })
    )
  })

  it('tex() lazily renders once and returns render texture output', () => {
    const output = {
      renderTexture: vi.fn(() => 'texture-result'),
    }
    const source = {
      output: null,
      out: vi.fn((_output, options) => {
        source.output = output
        return source
      }),
    }

    const texture = sourceMixin.tex.call(source, undefined, { stop: false })

    expect(source.out).toHaveBeenCalledTimes(1)
    expect(output.renderTexture).toHaveBeenCalledWith({ stop: false })
    expect(texture).toBe('texture-result')
  })
})

describe('lib/mixins auto clear defaults', () => {
  it('autoClear() and clear() keep chain semantics and defaults', () => {
    const value = {
      autoClear: autoClearMixin.autoClear,
    }

    const autoResult = autoClearMixin.autoClear.call(value)
    expect(autoResult).toBe(value)
    expect(value._autoClear).toEqual({ amount: 1, color: 0 })

    const clearResult = autoClearMixin.clear.call(value, 0.25, 0x101010, {
      premultiplyAlpha: true,
    })
    expect(clearResult).toBe(value)
    expect(value._autoClear).toEqual({
      amount: 0.25,
      color: 0x101010,
      premultiplyAlpha: true,
    })
  })
})
