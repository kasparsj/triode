// @vitest-environment jsdom

import * as THREE from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  beginSceneEval,
  clearSceneRuntime,
  endSceneEval,
  getOrCreateScene,
} from '../../../src/three/scene.js'

const createRuntime = () => ({
  liveMode: 'continuous',
  renderer: {
    shadowMap: {
      enabled: false,
    },
  },
})

const createSceneOptions = (runtime: any) => ({
  runtime,
  defaultOutput: {
    _camera: new THREE.PerspectiveCamera(),
  },
  defaultUniforms: {},
  utils: {},
})

afterEach(() => {
  // Runtime stores are keyed by runtime object; each test clears its own runtime.
})

describe('scene live reconcile (continuous mode)', () => {
  it('prunes untouched children across eval cycles', () => {
    const runtime = createRuntime()
    const options = createSceneOptions(runtime)

    beginSceneEval(runtime, 'stage().mesh().render()')
    const scene = getOrCreateScene(options, { name: 'main' })
    scene.add(new THREE.Object3D())
    endSceneEval(runtime)

    expect(scene.children.length).toBe(1)

    beginSceneEval(runtime, 'stage().render()')
    const sameScene = getOrCreateScene(options, { name: 'main' })
    endSceneEval(runtime)

    expect(sameScene).toBe(scene)
    expect(sameScene.children.length).toBe(0)

    clearSceneRuntime(runtime)
  })

  it('removes untouched scene roots and recreates them on next access', () => {
    const runtime = createRuntime()
    const options = createSceneOptions(runtime)

    beginSceneEval(runtime, 'scene("main"); scene("aux")')
    const mainScene = getOrCreateScene(options, { name: 'main' })
    const auxScene = getOrCreateScene(options, { name: 'aux' })
    endSceneEval(runtime)

    beginSceneEval(runtime, 'scene("main")')
    const sameMain = getOrCreateScene(options, { name: 'main' })
    endSceneEval(runtime)

    expect(sameMain).toBe(mainScene)

    const recreatedAux = getOrCreateScene(options, { name: 'aux' })
    expect(recreatedAux).not.toBe(auxScene)

    clearSceneRuntime(runtime)
  })

  it('disposes geometry/material resources of removed objects', () => {
    const runtime = createRuntime()
    const options = createSceneOptions(runtime)

    const geometry = {
      isBufferGeometry: true,
      dispose: vi.fn(),
    }
    const material = {
      dispose: vi.fn(),
    }

    beginSceneEval(runtime, 'stage().mesh(geom, mat).render()')
    const stageScene = getOrCreateScene(options, { name: 'resource-scene' })
    stageScene.mesh(geometry as any, material as any, { name: 'resource-mesh' })
    endSceneEval(runtime)

    beginSceneEval(runtime, 'stage().render()')
    getOrCreateScene(options, { name: 'resource-scene' })
    endSceneEval(runtime)

    expect(geometry.dispose).toHaveBeenCalledTimes(1)
    expect(material.dispose).toHaveBeenCalledTimes(1)

    clearSceneRuntime(runtime)
  })
})
