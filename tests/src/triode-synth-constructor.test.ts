// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import TriodeRenderer from '../../src/triode-synth.js'
import { createClock } from '../../src/lib/clock.js'

const createOutputStub = (index: number) => ({
  id: index,
  uniforms: {},
  _camera: { userData: {} },
  tick: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn(),
  stop: vi.fn(),
  getTexture: vi.fn(() => ({ id: `o${index}-texture` })),
  ortho: vi.fn(),
  perspective: vi.fn(),
  screenCoords: vi.fn(),
  normalizedCoords: vi.fn(),
  cartesianCoords: vi.fn(),
})

const createAdapters = () => {
  const outputs: ReturnType<typeof createOutputStub>[] = []
  const sources: Array<{
    clear: ReturnType<typeof vi.fn>
    resize: ReturnType<typeof vi.fn>
    tick: ReturnType<typeof vi.fn>
  }> = []

  const renderer = {
    clear: vi.fn(),
    autoClear: false,
    shadowMap: { enabled: false },
    dispose: vi.fn(),
    getPixelRatio: vi.fn(() => 1),
    getSize: vi.fn(() => ({ width: 320, height: 180 })),
  }

  const composer = {
    passes: [] as any[],
    addPass: vi.fn(function addPass(pass) {
      this.passes.push(pass)
    }),
    render: vi.fn(),
    dispose: vi.fn(),
  }

  const css2DRenderer = {
    domElement: document.createElement('div'),
    setSize: vi.fn(),
    render: vi.fn(),
  }

  const css3DRenderer = {
    domElement: document.createElement('div'),
    setSize: vi.fn(),
    render: vi.fn(),
  }

  const sandbox = {
    eval: vi.fn(),
    set: vi.fn(),
    tick: vi.fn(),
    destroy: vi.fn(),
    add: vi.fn(),
    makeGlobal: false,
  }

  const loop = {
    start: vi.fn(),
    stop: vi.fn(),
  }

  const streamTracks = [{ stop: vi.fn() }]
  const captureStream = {
    getTracks: vi.fn(() => streamTracks),
  }

  const audio = {
    tick: vi.fn(),
  }

  const mediaRecorder = {
    state: 'inactive',
    stop: vi.fn(),
  }

  const solidOut = vi.fn(() => undefined)
  const solid = vi.fn(() => ({ out: solidOut }))
  const generatorFactory = {
    generators: { solid },
    defaultOutput: null,
    defaultUniforms: {},
    utils: {},
    setFunction: vi.fn(),
  }

  const adapters = {
    createLoop: vi.fn(() => loop),
    createAudio: vi.fn(() => audio),
    createVideoRecorder: vi.fn(() => ({ mediaRecorder })),
    captureCanvasStream: vi.fn(() => captureStream),
    createOutput: vi.fn((index) => {
      const output = createOutputStub(index)
      outputs.push(output)
      return output
    }),
    createSource: vi.fn(() => {
      const source = {
        clear: vi.fn(),
        resize: vi.fn(),
        tick: vi.fn(),
      }
      sources.push(source)
      return source
    }),
    createGeneratorFactory: vi.fn((options) => {
      generatorFactory.defaultOutput = options.defaultOutput
      generatorFactory.defaultUniforms = options.defaultUniforms
      options.changeListener({
        type: 'add',
        method: 'solid',
        synth: generatorFactory,
      })
      return generatorFactory
    }),
    createSandbox: vi.fn(() => sandbox),
    createRenderer: vi.fn(() => renderer),
    createComposer: vi.fn(() => composer),
    createCss2DRenderer: vi.fn(() => css2DRenderer),
    createCss3DRenderer: vi.fn(() => css3DRenderer),
    createShaderMaterial: vi.fn((options) => options),
    createShaderPass: vi.fn(() => ({ enabled: false })),
  }

  return {
    adapters,
    outputs,
    sources,
    renderer,
    composer,
    css2DRenderer,
    css3DRenderer,
    sandbox,
    loop,
    streamTracks,
    captureStream,
    audio,
    mediaRecorder,
    solid,
    solidOut,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('triode-synth constructor adapters', () => {
  it('initializes runtime through adapters without real WebGL/audio', () => {
    const setup = createAdapters()
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 360
    const clock = createClock({ initialTime: 12 })

    const triode = new TriodeRenderer({
      canvas,
      adapters: setup.adapters,
      clock,
      precision: 'highp',
      autoLoop: true,
      detectAudio: true,
      enableStreamCapture: true,
      makeGlobal: false,
      numSources: 2,
      numOutputs: 2,
    })

    expect(setup.adapters.createRenderer).toHaveBeenCalledTimes(1)
    expect(setup.adapters.createComposer).toHaveBeenCalledTimes(1)
    expect(setup.adapters.createCss2DRenderer).toHaveBeenCalledTimes(1)
    expect(setup.adapters.createCss3DRenderer).toHaveBeenCalledTimes(1)
    expect(setup.adapters.createOutput).toHaveBeenCalledTimes(2)
    expect(setup.adapters.createSource).toHaveBeenCalledTimes(2)
    expect(setup.adapters.createGeneratorFactory).toHaveBeenCalledTimes(1)
    expect(setup.adapters.createSandbox).toHaveBeenCalledTimes(1)
    expect(setup.adapters.createAudio).toHaveBeenCalledTimes(1)
    expect(setup.adapters.captureCanvasStream).toHaveBeenCalledWith(canvas, 25)
    expect(setup.adapters.createVideoRecorder).toHaveBeenCalledTimes(1)
    expect(setup.adapters.createLoop).toHaveBeenCalledTimes(1)
    expect(setup.loop.start).toHaveBeenCalledTimes(1)

    expect(triode.synth.time).toBe(12)
    expect(triode.synth.a).toBe(setup.audio)
    expect(triode.captureStream).toBe(setup.captureStream)

    triode.dispose()
  })

  it('supports deterministic tick/reset/hush on a real adapter-backed instance', () => {
    const setup = createAdapters()
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 180

    const triode = new TriodeRenderer({
      canvas,
      adapters: setup.adapters,
      precision: 'highp',
      autoLoop: false,
      detectAudio: true,
      enableStreamCapture: false,
      makeGlobal: false,
      numSources: 1,
      numOutputs: 1,
      clock: createClock({ initialTime: 1 }),
    })

    triode.synth.update = vi.fn()
    triode.synth.afterUpdate = vi.fn()
    triode.tick(500)

    expect(setup.sandbox.set).toHaveBeenCalledWith('time', 1.5)
    expect(triode.synth.time).toBe(1.5)
    expect(triode.synth.update).toHaveBeenCalledTimes(1)
    expect(triode.synth.afterUpdate).toHaveBeenCalledTimes(1)
    expect(setup.outputs[0].tick).toHaveBeenCalledTimes(1)
    expect(setup.sources[0].tick).toHaveBeenCalledWith(1.5)

    triode.setResolution(800, 600)
    expect(setup.outputs[0].resize).toHaveBeenCalledWith(800, 600)
    expect(setup.sources[0].resize).toHaveBeenCalledWith(800, 600)
    expect(setup.css2DRenderer.setSize).toHaveBeenCalledWith(800, 600)
    expect(setup.css3DRenderer.setSize).toHaveBeenCalledWith(800, 600)

    triode.hush()
    expect(setup.sources[0].clear).toHaveBeenCalledTimes(1)
    expect(setup.solid).toHaveBeenCalled()
    expect(setup.solidOut).toHaveBeenCalled()

    const imageCallback = vi.fn()
    triode.getScreenImage(imageCallback)
    expect(triode.saveFrame).toBe(true)
    expect(triode.imageCallback).toBe(imageCallback)

    triode._render(setup.outputs[0] as any)
    expect(triode.output).toBe(setup.outputs[0])
    expect(triode.isRenderingAll).toBe(false)

    triode._render()
    expect(triode.isRenderingAll).toBe(true)

    triode.shadowMap({ enabled: true, type: 'pcf-soft' } as any)
    expect(setup.renderer.shadowMap).toMatchObject({
      enabled: true,
      type: 'pcf-soft',
    })

    triode.resetRuntime()
    expect(triode.synth.time).toBe(0)
    expect(setup.sandbox.set).toHaveBeenCalledWith('time', 0)

    triode.dispose()
    expect(setup.loop.stop).not.toHaveBeenCalled()
  })

  it('disposes adapter resources idempotently without leaking dom nodes', () => {
    const setup = createAdapters()
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 225

    const triode = new TriodeRenderer({
      canvas,
      adapters: setup.adapters,
      precision: 'highp',
      autoLoop: true,
      detectAudio: true,
      enableStreamCapture: true,
      makeGlobal: false,
      numSources: 1,
      numOutputs: 1,
    })

    triode.dispose()
    triode.dispose()

    expect(setup.loop.stop).toHaveBeenCalledTimes(1)
    expect(setup.outputs[0].dispose).toHaveBeenCalledTimes(1)
    expect(setup.sources[0].clear).toHaveBeenCalledTimes(1)
    expect(setup.composer.dispose).toHaveBeenCalledTimes(1)
    expect(setup.renderer.dispose).toHaveBeenCalledTimes(1)
    expect(setup.sandbox.destroy).toHaveBeenCalledTimes(1)
    expect(setup.streamTracks[0].stop).toHaveBeenCalledTimes(1)
    expect(document.body.contains(setup.css2DRenderer.domElement)).toBe(false)
    expect(document.body.contains(setup.css3DRenderer.domElement)).toBe(false)
  })
})
