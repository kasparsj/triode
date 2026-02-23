import { describe, expect, it } from 'vitest'

import { coerceClock, createClock } from '../../../src/lib/clock.js'

describe('lib/clock', () => {
  it('advances time deterministically using dt and speed', () => {
    const clock = createClock({ initialTime: 1 })

    expect(clock.now()).toBe(1)
    expect(clock.step(500, 2)).toBe(2)
    expect(clock.step(250, 0.5)).toBe(2.125)
  })

  it('coerces invalid dt/speed/reset values to safe defaults', () => {
    const clock = createClock({ initialTime: 3 })

    expect(clock.step(Number.NaN, 1)).toBe(3)
    expect(clock.step(1000, Number.POSITIVE_INFINITY)).toBe(4)
    expect(clock.reset(Number.NaN)).toBe(0)
  })

  it('accepts custom clocks with now/step/reset and falls back otherwise', () => {
    const customClock = {
      now: () => 10,
      step: () => 11,
      reset: () => 0,
    }

    expect(coerceClock(customClock)).toBe(customClock)

    const fallback = coerceClock({ now: () => 1 })
    expect(typeof fallback.now).toBe('function')
    expect(typeof fallback.step).toBe('function')
    expect(typeof fallback.reset).toBe('function')
  })
})
