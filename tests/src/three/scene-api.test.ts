// @vitest-environment jsdom

import * as THREE from 'three'
import { describe, expect, it } from 'vitest'

import { clearSceneRuntime, getOrCreateScene } from '../../../src/three/scene.js'

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

describe('scene API chaining helpers', () => {
  it('instancedAdd() and layerAdd() preserve chain semantics', () => {
    const runtime = createRuntime()
    const scene = getOrCreateScene(createSceneOptions(runtime), { name: 'api-main' })

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial()
    const chainAfterInstanced = scene.instancedAdd(geometry, material, 3, {
      name: 'instanced-a',
    })
    const chainAfterLayer = scene.layerAdd(1)

    expect(chainAfterInstanced).toBe(scene)
    expect(chainAfterLayer).toBe(scene)
    expect(scene.children.length).toBe(1)
    expect(scene._layers.length).toBe(1)

    clearSceneRuntime(runtime)
  })

  it('at()/find() accept touch control options and still return expected objects', () => {
    const runtime = createRuntime()
    const scene = getOrCreateScene(createSceneOptions(runtime), { name: 'api-read' })

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial())
    mesh.name = 'mesh-a'
    scene.add(mesh)

    expect(scene.at(0, { touch: false })).toBe(mesh)
    expect(scene.find({ isMesh: true }, { touch: false })).toEqual([mesh])

    clearSceneRuntime(runtime)
  })
})

