const toFiniteNumber = (value, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const createClock = ({ initialTime = 0 } = {}) => {
  let time = toFiniteNumber(initialTime, 0)
  return {
    now() {
      return time
    },
    step(dt = 0, speed = 1) {
      time += toFiniteNumber(dt, 0) * 0.001 * toFiniteNumber(speed, 1)
      return time
    },
    reset(nextTime = 0) {
      time = toFiniteNumber(nextTime, 0)
      return time
    },
  }
}

const coerceClock = (clock) => {
  if (
    clock &&
    typeof clock.now === 'function' &&
    typeof clock.step === 'function' &&
    typeof clock.reset === 'function'
  ) {
    return clock
  }
  return createClock()
}

export { createClock, coerceClock }
