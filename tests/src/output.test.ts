// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'

const {
  MockEffectComposer,
  MockClearPass,
  MockTriodeFadePass,
  MockTriodeMaterialPass,
  MockTriodeRenderPass,
  fxAdd,
  layersRender,
} = vi.hoisted(() => {
  const fxAdd = vi.fn((options) => {
    if (options && options.composer) {
      options.composer.addPass({
        dispose: vi.fn(),
        marker: 'fx-pass',
      })
    }
  })

  const layersRender = vi.fn()

  class MockClearPass {
    render = vi.fn()
    dispose = vi.fn()
  }

  class MockTriodeFadePass {
    dispose = vi.fn()
    constructor(autoClear, uniforms) {
      this.autoClear = autoClear
      this.uniforms = uniforms
    }
  }

  class MockTriodeMaterialPass {
    dispose = vi.fn()
    constructor(options) {
      Object.assign(this, options)
    }
  }

  class MockTriodeRenderPass {
    dispose = vi.fn()
    constructor(scene, camera, options) {
      this.scene = scene
      this.camera = camera
      Object.assign(this, options)
    }
  }

  const createRenderTarget = (name = 'rt') => ({
    isRenderTarget: true,
    name,
    texture: { name: `${name}.texture` },
    clone() {
      return createRenderTarget(`${name}.clone`)
    },
    setSize: vi.fn(),
    dispose: vi.fn(),
  })

  class MockEffectComposer {
    constructor(renderer, renderTarget = createRenderTarget('composer')) {
      this.renderer = renderer
      this.renderTarget1 = renderTarget
      this.renderTarget2 = renderTarget.clone()
      this.writeBuffer = this.renderTarget1
      this.readBuffer = this.renderTarget2
      this.passes = []
      this.renderToScreen = false
      this.setSize = vi.fn()
      this.render = vi.fn()
      this.dispose = vi.fn()
    }

    addPass(pass) {
      this.passes.push(pass)
    }
  }

  return {
    MockEffectComposer,
    MockClearPass,
    MockTriodeFadePass,
    MockTriodeMaterialPass,
    MockTriodeRenderPass,
    fxAdd,
    layersRender,
  }
})

vi.mock('three/examples/jsm/postprocessing/EffectComposer.js', () => ({
  EffectComposer: MockEffectComposer,
}))

vi.mock('three/examples/jsm/postprocessing/ClearPass.js', () => ({
  ClearPass: MockClearPass,
}))

vi.mock('../../src/three/TriodePass.js', () => ({
  TriodeFadePass: MockTriodeFadePass,
  TriodeMaterialPass: MockTriodeMaterialPass,
  TriodeRenderPass: MockTriodeRenderPass,
}))

vi.mock('../../src/three/fx.js', () => ({
  add: fxAdd,
}))

vi.mock('../../src/three/layers.js', () => ({
  render: layersRender,
}))

import Output from '../../src/output.js'

describe('output adapter interactions', () => {
  it('builds render passes via _set() and preserves explicit renderTarget at terminal pass', () => {
    const controls = {
      update: vi.fn(),
      dispose: vi.fn(),
    }
    const layer = {
      compile: vi.fn(),
      getMixPass: vi.fn(() => ({ marker: 'layer-mix' })),
      dispose: vi.fn(),
    }

    const output = {
      stop: vi.fn(),
      composer: new MockEffectComposer({}),
      uniforms: { time: { value: 0 } },
      layers: [],
      controls: [],
      synth: { renderer: {}, css2DRenderer: { render: vi.fn() } },
      _camera: { userData: { controls } },
      _autoClear: { amount: 0.5, color: 0 },
    }

    Output.prototype._set.call(
      output,
      [
        {
          scene: { empty: () => false },
          camera: { userData: { controls } },
          layers: [layer],
          fx: { bloom: true },
          autoClear: { amount: 0.5 },
          renderTarget: { id: 'manual-target' },
        },
      ],
      { cssRenderer: '2d' }
    )

    expect(output.stop).toHaveBeenCalledTimes(1)
    expect(output.controls).toContain(controls)
    expect(output.layers).toContain(layer)
    expect(layer.compile).toHaveBeenCalledTimes(1)
    expect(fxAdd).toHaveBeenCalledTimes(1)

    const passes = output.composer.passes
    expect(passes.some((pass) => pass instanceof MockTriodeFadePass)).toBe(true)
    const renderPass = passes.find((pass) => pass instanceof MockTriodeRenderPass)
    const terminalPass = passes[passes.length - 1]

    expect(renderPass.renderTarget).toBeNull()
    expect(terminalPass.renderTarget).toEqual({ id: 'manual-target' })
    expect(output.cssRenderer).toBe('css2DRenderer')
  })

  it('runs tick/render/clearNow and routes CSS/layer rendering', () => {
    const cssRenderer = {
      render: vi.fn(),
    }

    const output = {
      controls: [{ update: vi.fn() }],
      layers: [{ id: 1 }],
      composer: new MockEffectComposer({}),
      cssRenderer: 'css2DRenderer',
      synth: { css2DRenderer: cssRenderer },
      render: Output.prototype.render,
    }

    output.composer.passes.push({
      scene: { id: 'scene' },
      camera: { id: 'camera' },
    })

    Output.prototype.tick.call(output)

    expect(output.controls[0].update).toHaveBeenCalledTimes(1)
    expect(output.composer.render).toHaveBeenCalledTimes(1)
    expect(layersRender).toHaveBeenCalledWith(output.layers)
    expect(cssRenderer.render).toHaveBeenCalledWith(
      output.composer.passes[0].scene,
      output.composer.passes[0].camera
    )

    const clearResult = Output.prototype.clearNow.call(output)
    expect(clearResult).toBe(output)
  })

  it('creates offscreen textures in renderTexture() without real renderer resources', () => {
    const previousTexComposer = {
      dispose: vi.fn(),
    }

    const output = {
      composer: new MockEffectComposer({}),
      synth: { renderer: {} },
      createFbo: vi.fn(() => ({
        isRenderTarget: true,
        texture: { id: 'offscreen-texture' },
        clone: vi.fn(() => ({
          isRenderTarget: true,
          texture: { id: 'offscreen-clone' },
          clone: vi.fn(),
          setSize: vi.fn(),
          dispose: vi.fn(),
        })),
        setSize: vi.fn(),
        dispose: vi.fn(),
      })),
      render: vi.fn(),
      stop: vi.fn(),
      texComposer: previousTexComposer,
    }

    output.composer.passes.push({ dispose: vi.fn() }, { dispose: vi.fn() })

    const texture = Output.prototype.renderTexture.call(output, {
      render: true,
      stop: true,
      disposePrev: true,
      width: 512,
      height: 512,
    })

    expect(output.createFbo).toHaveBeenCalledWith({ width: 512, height: 512 })
    expect(output.render).toHaveBeenCalledTimes(1)
    expect(output.stop).toHaveBeenCalledTimes(1)
    expect(previousTexComposer.dispose).toHaveBeenCalledTimes(1)
    expect(texture).toEqual({ id: 'offscreen-clone' })
  })
})
