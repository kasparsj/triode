import { describe, expect, it, vi } from 'vitest'

import { formatArguments } from '../../src/format-arguments.js'
import Output from '../../src/output.js'
import Source from '../../src/triode-source.js'

const createTransform = (inputs, userArgs = []) => {
  const src = vi.fn((value) => ({
    x: `src:x:${String(value)}`,
    xy: `src:xy:${String(value)}`,
    xyz: `src:xyz:${String(value)}`,
    xyzw: `src:xyzw:${String(value)}`,
  }))

  return {
    transform: {
      inputs,
    },
    userArgs,
    synth: {
      generators: {
        src,
      },
    },
    src,
  }
}

describe('format-arguments defaults and coercion', () => {
  it('keeps float defaults stable and decimalized', () => {
    const transform = createTransform([
      { name: 'frequency', type: 'float', default: 2 },
    ])

    const [formatted] = formatArguments(transform, 0)

    expect(formatted.value).toBe('2.')
    expect(formatted.type).toBe('float')
  })

  it('falls back to defaults for null and NaN scalar inputs', () => {
    const nullTransform = createTransform(
      [{ name: 'amount', type: 'float', default: 0.5 }],
      [null]
    )
    const nanTransform = createTransform(
      [{ name: 'amount', type: 'float', default: 0.5 }],
      [Number.NaN]
    )

    const [nullArg] = formatArguments(nullTransform, 1)
    const [nanArg] = formatArguments(nanTransform, 1)

    expect(nullArg.value).toBe('0.5')
    expect(nanArg.value).toBe('0.5')
  })

  it('coerces numeric vec inputs into explicit vec constructors', () => {
    const transform = createTransform(
      [{ name: 'offset', type: 'vec3', default: 0 }],
      [2]
    )

    const [formatted] = formatArguments(transform, 0)

    expect(formatted.value).toBe('vec3(2., 2., 2.)')
    expect(formatted.isUniform).toBe(false)
  })

  it('converts render targets to sampler uniforms', () => {
    const renderTarget = {
      isRenderTarget: true,
      texture: { id: 'texture' },
    }
    const transform = createTransform(
      [{ name: 'tex', type: 'sampler2D', default: null }],
      [renderTarget]
    )

    const [formatted] = formatArguments(transform, 4)

    expect(formatted.isUniform).toBe(true)
    expect(formatted.value).toBe(renderTarget.texture)
    expect(formatted.name).toBe('tex4')
  })

  it('keeps sampler coercion non-fatal for null values', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fallbackTexture = { id: 'fallback' }
    const transform = createTransform(
      [{ name: 'tex', type: 'sampler2D', default: fallbackTexture }],
      [null]
    )

    const [formatted] = formatArguments(transform, 2)

    expect(formatted.value).toBe(fallbackTexture)
    expect(formatted.isUniform).toBe(true)
    expect(formatted.name).toBe('tex2')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('maps Output and Source inputs through src() for vector accessors', () => {
    const outputRef = Object.create(Output.prototype)
    const sourceRef = Object.create(Source.prototype)
    const outputTransform = createTransform(
      [{ name: 'coord', type: 'vec2', default: 0 }],
      [outputRef]
    )
    const sourceTransform = createTransform(
      [{ name: 'coord', type: 'float', default: 0 }],
      [sourceRef]
    )

    const [outputArg] = formatArguments(outputTransform, 2)
    const [sourceArg] = formatArguments(sourceTransform, 3)

    expect(outputArg.value).toBe(`src:xy:${String(outputRef)}`)
    expect(outputArg.isUniform).toBe(false)

    expect(sourceArg.value).toBe(`src:x:${String(sourceRef)}`)
    expect(sourceArg.isUniform).toBe(false)
  })

  it('maps Output inputs to full src() when vec4 is requested', () => {
    const outputRef = Object.create(Output.prototype)
    const transform = createTransform(
      [{ name: 'color', type: 'vec4', default: 0 }],
      [outputRef]
    )

    const [formatted] = formatArguments(transform, 5)

    expect(formatted.value).toMatchObject({
      xyzw: `src:xyzw:${String(outputRef)}`,
    })
    expect(formatted.isUniform).toBe(false)
  })

  it('wraps function args as uniforms and preserves runtime on errors', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const transform = createTransform(
      [{ name: 'gain', type: 'float', default: 0.2 }],
      [() => 'not-a-number']
    )

    const [formatted] = formatArguments(transform, 7)

    expect(formatted.isUniform).toBe(true)
    expect(formatted.name).toBe('gain7')
    expect(formatted.value({}, {}, 0)).toBe(0.2)
    expect(warnSpy).toHaveBeenCalled()
  })

  it('handles thrown function inputs and vector-array coercion branches', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const throwingFnTransform = createTransform(
      [{ name: 'gain', type: 'float', default: 0.9 }],
      [() => {
        throw new Error('bad-user-fn')
      }]
    )
    const [throwingFnArg] = formatArguments(throwingFnTransform, 8)
    expect(throwingFnArg.value({}, {}, 0)).toBe(0.9)

    const vecTransform = createTransform(
      [{ name: 'offset', type: 'vec3', default: [0.1, 0.2, 0.3] }],
      [[() => 1, [4, 5], undefined]]
    )
    const [vecArg] = formatArguments(vecTransform, 9)
    expect(vecArg.value({}, { time: 0, bpm: 60 }, 0)).toEqual([1, 4, 0.3])

    const scalarArrayTransform = createTransform(
      [{ name: 'amp', type: 'float', default: 0 }],
      [[1, 2, 3]]
    )
    const [scalarArrayArg] = formatArguments(scalarArrayTransform, 3)
    expect(scalarArrayArg.value({}, { time: 2, bpm: 60 }, 0)).toBe(3)
    expect(warnSpy).toHaveBeenCalled()
  })

  it('avoids texture coercion crashes when vec input is nullish', () => {
    const transform = createTransform(
      [{ name: 'offset', type: 'vec3', default: null }],
      [null]
    )

    expect(() => formatArguments(transform, 6)).not.toThrow()
  })
})
