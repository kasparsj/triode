// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import * as scene from '../../src/three/scene.js'
import TriodeRenderer from '../../src/triode-synth.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('triode-synth live coding behavior', () => {
  it('wraps eval in begin/end scene eval during continuous live mode', () => {
    const beginSpy = vi
      .spyOn(scene, 'beginSceneEval')
      .mockImplementation(() => undefined)
    const endSpy = vi
      .spyOn(scene, 'endSceneEval')
      .mockImplementation(() => undefined)

    const runtime = {
      liveMode: 'continuous',
      sandbox: {
        eval: vi.fn(() => {
          throw new Error('user-code-failure')
        }),
      },
    }

    expect(() => TriodeRenderer.prototype.eval.call(runtime, 'stage().render()')).toThrow(
      'user-code-failure'
    )
    expect(beginSpy).toHaveBeenCalledWith(runtime, 'stage().render()')
    expect(endSpy).toHaveBeenCalledWith(runtime)
  })

  it('onFrame wires callback to update() and keeps chain-safe sandbox state', () => {
    const callback = vi.fn()
    const runtime = {
      synth: {
        time: 42,
      },
      sandbox: {
        set: vi.fn(),
      },
    }

    TriodeRenderer.prototype.onFrame.call(runtime, callback)

    runtime.synth.update(16)

    expect(callback).toHaveBeenCalledWith(16, 42)
    expect(runtime.sandbox.set).toHaveBeenCalledWith('update', runtime.synth.update)
  })

  it('stage() normalizes camera/world/lights/render options and returns the stage scene', () => {
    const stageScene = {
      lights: vi.fn(),
      world: vi.fn(),
      clear: vi.fn(),
      render: vi.fn(),
    }

    const runtime = {
      scene: vi.fn(() => stageScene),
      output: {
        perspective: vi.fn(),
        ortho: vi.fn(),
      },
    }
    runtime._applyStageCamera = TriodeRenderer.prototype._applyStageCamera
    runtime._applyStageLights = TriodeRenderer.prototype._applyStageLights
    runtime._applyStageWorld = TriodeRenderer.prototype._applyStageWorld
    runtime._applyStageClear = TriodeRenderer.prototype._applyStageClear

    const result = TriodeRenderer.prototype.stage.call(runtime, {
      camera: 'perspective',
      lights: 'studio',
      world: 'atmosphere',
      clear: { amount: Number.NaN, color: 0x101010 },
      render: {
        to: 'main-output',
        target: 'post-target',
        css: '3d',
        fx: { film: true },
        layers: ['layer-a'],
      },
      name: 'stage-scene',
    })

    expect(runtime.scene).toHaveBeenCalledWith({ name: 'stage-scene' })
    expect(runtime.output.perspective).toHaveBeenCalledTimes(1)
    expect(stageScene.lights).toHaveBeenCalledWith({ all: true })
    expect(stageScene.world).toHaveBeenCalledWith({ ground: true, fog: true })
    expect(stageScene.clear).toHaveBeenCalledWith(1, 0x101010, {
      amount: Number.NaN,
      color: 0x101010,
    })
    expect(stageScene.render).toHaveBeenCalledWith(
      'main-output',
      expect.objectContaining({
        renderTarget: 'post-target',
        cssRenderer: '3d',
        fx: { film: true },
        layers: ['layer-a'],
      })
    )
    expect(result).toBe(stageScene)
  })
})

describe('triode-synth deterministic tick and non-fatal errors', () => {
  it('tick() advances synth time from injected clock and reports callback failures', () => {
    const updateError = new Error('update-failed')
    const afterUpdateError = new Error('after-update-failed')

    const runtime = {
      _disposed: false,
      sandbox: {
        tick: vi.fn(),
        set: vi.fn(),
      },
      detectAudio: false,
      synth: {
        time: 0,
        speed: 2,
        fps: undefined,
        stats: { fps: 0 },
        update: vi.fn(() => {
          throw updateError
        }),
        afterUpdate: vi.fn(() => {
          throw afterUpdateError
        }),
      },
      timeSinceLastUpdate: 0,
      s: [{ tick: vi.fn() }],
      o: [{ tick: vi.fn() }],
      isRenderingAll: false,
      renderAll: { enabled: true },
      renderFbo: { enabled: false },
      composer: { render: vi.fn() },
      saveFrame: false,
      canvasToImage: vi.fn(),
      _handleRuntimeError: vi.fn(),
      clock: {
        step: vi.fn(() => 4.2),
      },
    }

    TriodeRenderer.prototype.tick.call(runtime, 500)

    expect(runtime.clock.step).toHaveBeenCalledWith(500, 2)
    expect(runtime.synth.time).toBe(4.2)
    expect(runtime.sandbox.set).toHaveBeenCalledWith('time', 4.2)
    expect(runtime.synth.stats.fps).toBe(2)
    expect(runtime.s[0].tick).toHaveBeenCalledWith(4.2)
    expect(runtime.o[0].tick).toHaveBeenCalledTimes(1)
    expect(runtime.composer.render).toHaveBeenCalledTimes(1)
    expect(runtime.renderFbo.enabled).toBe(true)
    expect(runtime.renderAll.enabled).toBe(false)
    expect(runtime._handleRuntimeError).toHaveBeenNthCalledWith(
      1,
      updateError,
      'update'
    )
    expect(runtime._handleRuntimeError).toHaveBeenNthCalledWith(
      2,
      afterUpdateError,
      'afterUpdate'
    )
  })

  it('tick() traps top-level runtime errors and keeps loop alive', () => {
    const runtimeError = new Error('tick-failed')
    const runtime = {
      _disposed: false,
      sandbox: {
        tick: vi.fn(() => {
          throw runtimeError
        }),
      },
      _handleRuntimeError: vi.fn(),
      detectAudio: false,
      synth: {
        time: 0,
        speed: 1,
        stats: { fps: 0 },
      },
      timeSinceLastUpdate: 0,
      s: [],
      o: [],
      renderAll: { enabled: false },
      renderFbo: { enabled: false },
      composer: { render: vi.fn() },
      saveFrame: false,
      clock: {
        step: vi.fn(() => 0),
      },
    }

    expect(() => TriodeRenderer.prototype.tick.call(runtime, 16)).not.toThrow()
    expect(runtime._handleRuntimeError).toHaveBeenCalledWith(runtimeError, 'tick')
  })

  it('_handleRuntimeError forwards actionable context and survives handler failures', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const error = new Error('boom')
    const onError = vi.fn(() => {
      throw new Error('handler-failure')
    })
    const runtime = {
      synth: {
        time: 7,
        onError,
      },
      _runtimeErrorHandler: null,
      _getRuntimeErrorHandler: TriodeRenderer.prototype._getRuntimeErrorHandler,
    }

    expect(() =>
      TriodeRenderer.prototype._handleRuntimeError.call(runtime, error, 'update')
    ).not.toThrow()

    expect(onError).toHaveBeenCalledWith(error, {
      context: 'update',
      time: 7,
    })
    expect(warnSpy).toHaveBeenCalled()
  })
})

describe('triode-synth reset/dispose/hot-reload controls', () => {
  it('resetRuntime() clears frame state and resets deterministic clock', () => {
    const clearSceneSpy = vi
      .spyOn(scene, 'clearSceneRuntime')
      .mockImplementation(() => undefined)
    const runtime = {
      _disposed: false,
      hush: vi.fn(),
      synth: {
        time: 22,
        stats: { fps: 120 },
      },
      sandbox: {
        set: vi.fn(),
      },
      timeSinceLastUpdate: 40,
      _time: 99,
      clock: {
        reset: vi.fn(() => 0),
      },
    }

    TriodeRenderer.prototype.resetRuntime.call(runtime)

    expect(runtime.hush).toHaveBeenCalledTimes(1)
    expect(clearSceneSpy).toHaveBeenCalledWith(runtime)
    expect(runtime.clock.reset).toHaveBeenCalledWith(0)
    expect(runtime.synth.time).toBe(0)
    expect(runtime.timeSinceLastUpdate).toBe(0)
    expect(runtime._time).toBe(0)
    expect(runtime.synth.stats.fps).toBe(0)
    expect(runtime.sandbox.set).toHaveBeenCalledWith('time', 0)
  })

  it('liveGlobals() toggles makeGlobal state and helper installation', () => {
    const runtime = {
      makeGlobal: false,
      synth: {
        foo: 1,
        bar: 2,
      },
      sandbox: {
        makeGlobal: false,
        add: vi.fn(),
        destroy: vi.fn(),
      },
      _installGlobalHelpers: vi.fn(),
      _installMathHelpers: vi.fn(),
      _restoreGlobalHelpers: vi.fn(),
      _restoreMathHelpers: vi.fn(),
    }

    const enabled = TriodeRenderer.prototype.liveGlobals.call(runtime, true)
    expect(enabled).toBe(true)
    expect(runtime.makeGlobal).toBe(true)
    expect(runtime.sandbox.makeGlobal).toBe(true)
    expect(runtime.sandbox.add).toHaveBeenCalledTimes(2)
    expect(runtime._installGlobalHelpers).toHaveBeenCalledTimes(1)
    expect(runtime._installMathHelpers).toHaveBeenCalledTimes(1)

    const disabled = TriodeRenderer.prototype.liveGlobals.call(runtime, false)
    expect(disabled).toBe(false)
    expect(runtime.makeGlobal).toBe(false)
    expect(runtime.sandbox.makeGlobal).toBe(false)
    expect(runtime.sandbox.destroy).toHaveBeenCalledTimes(1)
    expect(runtime._restoreGlobalHelpers).toHaveBeenCalledTimes(1)
    expect(runtime._restoreMathHelpers).toHaveBeenCalledTimes(1)
  })

  it('dispose() is idempotent and clears stream/renderer/runtime references', () => {
    const css2 = document.createElement('div')
    const css3 = document.createElement('div')
    document.body.appendChild(css2)
    document.body.appendChild(css3)

    const trackStop = vi.fn()
    const recorderStop = vi.fn()

    const loopStop = vi.fn()
    const runtime = {
      _disposed: false,
      _loop: { stop: loopStop },
      synth: {
        vidRecorder: {
          mediaRecorder: {
            state: 'recording',
            stop: recorderStop,
          },
        },
      },
      captureStream: {
        getTracks: () => [{ stop: trackStop }],
      },
      s: [{ clear: vi.fn() }],
      o: [{ dispose: vi.fn() }],
      composer: { dispose: vi.fn() },
      renderer: { dispose: vi.fn() },
      css2DRenderer: { domElement: css2 },
      css3DRenderer: { domElement: css3 },
      sandbox: { destroy: vi.fn() },
      _restoreGlobalHelpers: vi.fn(),
      _restoreMathHelpers: vi.fn(),
      canvas: {
        _triodeInputRuntime: null,
        _hydraInputRuntime: null,
      },
    }
    runtime.canvas._triodeInputRuntime = runtime
    runtime.canvas._hydraInputRuntime = runtime

    TriodeRenderer.prototype.dispose.call(runtime)
    TriodeRenderer.prototype.dispose.call(runtime)

    expect(runtime._disposed).toBe(true)
    expect(loopStop).toHaveBeenCalledTimes(1)
    expect(recorderStop).toHaveBeenCalledTimes(1)
    expect(trackStop).toHaveBeenCalledTimes(1)
    expect(runtime.s[0].clear).toHaveBeenCalledTimes(1)
    expect(runtime.o[0].dispose).toHaveBeenCalledTimes(1)
    expect(runtime.composer.dispose).toHaveBeenCalledTimes(1)
    expect(runtime.renderer.dispose).toHaveBeenCalledTimes(1)
    expect(runtime.sandbox.destroy).toHaveBeenCalledTimes(1)
    expect(runtime.canvas._triodeInputRuntime).toBeNull()
    expect(runtime.canvas._hydraInputRuntime).toBeNull()
    expect(document.body.contains(css2)).toBe(false)
    expect(document.body.contains(css3)).toBe(false)
  })
})
