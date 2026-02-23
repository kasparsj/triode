// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'

import EvalSandbox from '../../src/eval-sandbox.js'

afterEach(() => {
  delete window.foo
  delete window.speed
})

describe('eval sandbox global ownership', () => {
  it('stacks global owners and restores prior values on destroy', () => {
    window.foo = 'base'

    const parentA = { foo: 'a' }
    const parentB = { foo: 'b' }

    const sandboxA = new EvalSandbox(parentA, true, ['foo'])
    const sandboxB = new EvalSandbox(parentB, true, ['foo'])

    expect(window.foo).toBe('b')

    sandboxB.destroy()
    expect(window.foo).toBe('a')

    sandboxA.destroy()
    expect(window.foo).toBe('base')
  })

  it('syncs user properties from window in tick() when global mode is enabled', () => {
    const parent = { speed: 1 }
    const sandbox = new EvalSandbox(parent, true, ['speed'])

    window.speed = 2.5
    sandbox.tick()

    expect(parent.speed).toBe(2.5)

    sandbox.destroy()
  })
})
