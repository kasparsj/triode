// @vitest-environment jsdom

import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import HydraRenderer from '../../src/hydra-synth.js'
import TriodeRenderer from '../../src/triode-synth.js'

describe('public API surface', () => {
  it('preserves package export contract for the main entrypoint', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')
    )

    expect(packageJson.type).toBe('module')
    expect(packageJson.exports['.']).toEqual({
      types: './src/index.d.ts',
      import: './src/package-entry.js',
      require: './dist/triode.js',
    })
  })

  it('keeps Hydra compatibility alias bound to the same runtime', () => {
    expect(HydraRenderer).toBe(TriodeRenderer)
    expect(globalThis.Triode).toBe(TriodeRenderer)
    expect(globalThis.Hydra).toBe(TriodeRenderer)
  })

  it('retains expected public instance methods', () => {
    const expectedMethods = [
      'eval',
      'getScreenImage',
      'hush',
      'resetRuntime',
      'loadScript',
      'setResolution',
      'shadowMap',
      'scene',
      'stage',
      'onFrame',
      'liveGlobals',
      'tick',
      'dispose',
    ]

    expectedMethods.forEach((name) => {
      expect(typeof TriodeRenderer.prototype[name]).toBe('function')
    })
  })
})
