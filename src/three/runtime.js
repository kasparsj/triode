const runtimes = new Set()
let activeRuntime = null
let runtimeScopeDepth = 0

const setActiveRuntime = (value) => {
  if (!value) {
    activeRuntime = null
    return null
  }
  runtimes.add(value)
  activeRuntime = value
  return value
}

const setRuntime = (value, { active = true } = {}) => {
  if (!value) {
    return clearRuntime()
  }
  runtimes.add(value)
  if (active || !activeRuntime) {
    activeRuntime = value
  }
  return value
}

const getRuntime = (fallbackRuntime) => {
  const runtime = fallbackRuntime || (runtimeScopeDepth > 0 ? activeRuntime : null)
  if (!runtime) {
    throw new Error(
      "Triode runtime is not initialized. Create a Triode instance before using 3D helpers."
    )
  }
  return runtime
}

const clearRuntime = (value) => {
  if (value) {
    runtimes.delete(value)
    if (activeRuntime === value) {
      const runtimeList = Array.from(runtimes)
      activeRuntime = runtimeList.length
        ? runtimeList[runtimeList.length - 1]
        : null
    }
    return
  }
  runtimes.clear()
  activeRuntime = null
}

const withRuntime = (runtime, fn) => {
  const prevRuntime = activeRuntime
  setActiveRuntime(runtime)
  runtimeScopeDepth += 1
  try {
    return fn()
  } finally {
    runtimeScopeDepth = Math.max(0, runtimeScopeDepth - 1)
    if (prevRuntime && runtimes.has(prevRuntime)) {
      activeRuntime = prevRuntime
    } else {
      activeRuntime = runtimes.has(runtime) ? runtime : null
    }
  }
}

const bindRuntimeModule = (moduleApi, runtime) => {
  const bound = {}
  Object.keys(moduleApi).forEach((key) => {
    const value = moduleApi[key]
    if (typeof value === 'function') {
      bound[key] = (...args) => withRuntime(runtime, () => value(...args))
    } else {
      bound[key] = value
    }
  })
  return bound
}

export {
  setRuntime,
  getRuntime,
  clearRuntime,
  setActiveRuntime,
  withRuntime,
  bindRuntimeModule,
}
