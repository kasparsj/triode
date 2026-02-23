const globalWarnings = new Set();

const getRuntimeWarnings = (runtime) => {
  if (runtime && runtime._deprecationWarnings instanceof Set) {
    return runtime._deprecationWarnings;
  }
  return globalWarnings;
};

const isLegacyRuntime = (runtime) =>
  !!(runtime && runtime.legacy === true);

const warnDeprecation = (runtime, code, message) => {
  if (isLegacyRuntime(runtime)) {
    return false;
  }
  const warnings = getRuntimeWarnings(runtime);
  if (warnings.has(code)) {
    return false;
  }
  warnings.add(code);
  try {
    console.warn(message);
  } catch (_error) {}
  return true;
};

export { warnDeprecation };
