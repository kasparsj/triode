import { describe, expect, it } from 'vitest'

import GlslSource from '../../src/glsl-source.js'

const createSource = () =>
  new GlslSource(
    {
      name: 'mock',
      transform: {
        name: 'mock',
        glslName: 'mock',
        type: 'src',
        inputs: [],
        glsl: 'return vec4(1.0);',
      },
      userArgs: [],
      synth: {},
    },
    {
      defaultOutput: { _set: () => {} },
      defaultUniforms: {},
      utils: {},
    }
  )

describe('glsl source chain semantics', () => {
  it('material helpers return self and set expected material presets', () => {
    const source = createSource()

    expect(source.material('basic', { wireframe: true })).toBe(source)
    expect(source._material.isMeshBasicMaterial).toBe(true)
    expect(source._material.wireframe).toBe(true)

    expect(source.lambert({ flatShading: true })).toBe(source)
    expect(source._material.isMeshLambertMaterial).toBe(true)

    expect(source.phong({ shininess: 12 })).toBe(source)
    expect(source._material.isMeshPhongMaterial).toBe(true)
    expect(source._material.shininess).toBe(12)
  })

  it('st() appends transforms in order and converts genType to coord', () => {
    const source = createSource()
    const other = createSource()

    other.transforms = [
      {
        name: 'genSample',
        transform: {
          name: 'genSample',
          glslName: 'genSample',
          type: 'genType',
          inputs: [],
          glsl: 'return vec4(1.0);',
          coord: {
            name: 'genSample',
            glslName: 'genSample',
            inputs: [],
            glsl: 'return _st;',
          },
        },
        userArgs: [],
      },
    ]

    source.st(other)

    const appended = source.transforms[source.transforms.length - 1]
    expect(appended.transform.type).toBe('coord')
    expect(appended.transform.returnType).toBe('vec2')
  })

  it('vector component getters preserve chain identity', () => {
    const source = createSource()

    expect(source.xy).toBe(source)
    expect(source.getter).toBe('xy')

    expect(source.xyz).toBe(source)
    expect(source.getter).toBe('xyz')
  })
})
