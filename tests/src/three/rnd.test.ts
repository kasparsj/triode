import { describe, expect, it } from 'vitest'

import {
  bool,
  cache,
  cacheBool,
  cacheGauss,
  cacheGaussMinMax,
  cacheNum,
  choice,
  color,
  exp,
  gaussMinMax,
  gauss,
  int,
  num,
  arr,
  setfn,
} from '../../../src/three/rnd.js'

describe('three/rnd', () => {
  it('uses injectable random function for deterministic number generation', () => {
    setfn(() => 0.25)

    expect(num(0, 8)).toBe(2)
    expect(int(0, 3)).toBe(1)
    expect(bool(0.3)).toBe(true)
    expect(choice(['a', 'b', 'c', 'd'])).toBe('b')
  })

  it('caches generated values by key', () => {
    let value = 0
    setfn(() => {
      value += 0.1
      return value
    })

    const first = cache('unit-cache-key')
    const second = cache('unit-cache-key')

    expect(first).toBe(second)
    expect(cacheNum('unit-cache-num', 10, 20)).toBe(cacheNum('unit-cache-num', 10, 20))
    expect(cacheBool('unit-cache-bool', 0.5)).toBe(cacheBool('unit-cache-bool', 0.5))
  })

  it('supports deterministic gaussian sampling when y1 is explicitly provided', () => {
    expect(gauss(10, 2, 1)).toBe(12)
  })

  it('covers distribution helpers and object helpers deterministically', () => {
    setfn(() => 0.5)

    expect(exp(0, 10, 2)).toBe(2.5)
    expect(gaussMinMax(0, 10, 1)).toBe(10)
    expect(cacheGauss('gauss-cache', 5, 2)).toBe(cacheGauss('gauss-cache', 5, 2))
    expect(cacheGaussMinMax('gauss-minmax-cache', 0, 4)).toBe(
      cacheGaussMinMax('gauss-minmax-cache', 0, 4)
    )

    expect(arr(3)).toEqual([0, 0.5, 1])

    const generatedColor = color()
    expect(generatedColor.r).toBe(0.5)
    expect(generatedColor.g).toBe(0.5)
    expect(generatedColor.b).toBe(0.5)
  })
})
