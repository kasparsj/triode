export interface TriodeOptions {
  pb?: unknown;
  width?: number;
  height?: number;
  numSources?: number;
  numOutputs?: number;
  makeGlobal?: boolean;
  autoLoop?: boolean;
  detectAudio?: boolean;
  enableStreamCapture?: boolean;
  webgl?: 1 | 2;
  canvas?: HTMLCanvasElement;
  css2DElement?: HTMLElement;
  css3DElement?: HTMLElement;
  precision?: "lowp" | "mediump" | "highp";
  onError?: TriodeRuntimeErrorHandler;
  liveMode?: TriodeLiveMode;
  clock?: TriodeClock;
  adapters?: Partial<TriodeRuntimeAdapters>;
  legacy?: boolean;
  extendTransforms?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export interface TriodeClock {
  now(): number;
  step(dt?: number, speed?: number): number;
  reset(nextTime?: number): number;
}

export interface TriodeRuntimeAdapters {
  createLoop(tick: (dt: number) => void): { start: () => void; stop?: () => void };
  createAudio(options: Record<string, unknown>): unknown;
  createVideoRecorder(stream: unknown): unknown;
  captureCanvasStream(canvas: HTMLCanvasElement, fps?: number): unknown;
  createOutput(index: number, runtime: TriodeRenderer): unknown;
  createSource(options: Record<string, unknown>): unknown;
  createGeneratorFactory(options: Record<string, unknown>): unknown;
  createSandbox(
    synth: TriodeSynthApi,
    makeGlobal: boolean,
    userProps: string[],
  ): unknown;
  createRenderer(options: Record<string, unknown>): unknown;
  createComposer(renderer: unknown): unknown;
  createCss2DRenderer(options: Record<string, unknown>): unknown;
  createCss3DRenderer(options: Record<string, unknown>): unknown;
  createShaderMaterial(options: Record<string, unknown>): unknown;
  createShaderPass(material: unknown): unknown;
}

export interface TriodeStats {
  fps: number;
}

export interface TriodeRuntimeErrorContext {
  context: "update" | "afterUpdate" | "tick" | string;
  time: number;
}

export type TriodeRuntimeErrorHandler = (
  error: unknown,
  context: TriodeRuntimeErrorContext,
) => void;
export type TriodeLiveMode = "restart" | "continuous";

export type TriodeModuleMethod = (...args: unknown[]) => unknown;
export type TriodeNumericTuple = [number, number] | [number, number, number];
export type TriodeControlModifier = "none" | "alt" | "shift" | "meta";

export interface TriodeCameraControlsOptions {
  enabled?: boolean;
  modifier?: TriodeControlModifier;
  domElement?: HTMLElement;
  target?: unknown;
  [key: string]: unknown;
}

export interface TriodeCameraOptions {
  type?: "perspective" | "ortho" | "orthographic";
  controls?: boolean | TriodeCameraControlsOptions;
  domElement?: HTMLElement;
  modifier?: TriodeControlModifier;
  enableZoom?: boolean;
  target?: unknown;
  [key: string]: unknown;
}

export type TriodeStageCameraPreset = "perspective" | "ortho" | "orthographic";

export interface TriodeStageCameraConfig extends TriodeCameraOptions {
  type?: TriodeStageCameraPreset;
  eye?: TriodeNumericTuple;
  target?: TriodeNumericTuple;
}

export interface TriodeStageConfig extends TriodeSceneAttributes {
  camera?: boolean | TriodeStageCameraPreset | TriodeStageCameraConfig;
  lights?: boolean | "basic" | "studio" | Record<string, unknown>;
  world?: boolean | "ground" | "atmosphere" | Record<string, unknown>;
  clear?:
    | number
    | {
        amount?: number;
        color?: number | string;
        [key: string]: unknown;
      };
  autoClear?:
    | number
    | {
        amount?: number;
        color?: number | string;
        [key: string]: unknown;
      };
  output?: unknown;
  render?: boolean | TriodeRenderCallOptions;
  out?: boolean | TriodeRenderCallOptions;
  cssRenderer?: TriodeTransformRenderOptions["cssRenderer"];
  renderTarget?: unknown;
  fx?: Record<string, unknown>;
  layers?: unknown;
}

export interface TriodeModuleApi {
  [key: string]: TriodeModuleMethod;
}

export interface TriodeTransformRenderOptions {
  cssRenderer?: "2d" | "3d" | "css2drenderer" | "css3drenderer" | false;
  renderTarget?: unknown;
  autoClear?: number | Record<string, unknown>;
  fx?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TriodeRenderCallOptions extends TriodeTransformRenderOptions {
  to?: unknown;
  output?: unknown;
  target?: unknown;
  css?: TriodeTransformRenderOptions["cssRenderer"];
}

export interface TriodeSceneAttributes {
  name?: string;
  key?: string;
  reuse?: boolean;
  background?: number | string;
  [key: string]: unknown;
}

export interface TriodeObjectOptions {
  name?: string;
  key?: string;
  reuse?: boolean;
  type?: string;
  instanced?: number;
  lineColor?: number | string;
  lineWidth?: number;
  lineMat?: unknown;
  material?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TriodeTransformDefinition {
  name: string;
  type: string;
  inputs?: Array<{
    name: string;
    type: string;
    default?: unknown;
  }>;
  glsl?: string;
  glsl300?: string;
  vert?: string;
  primitive?: string;
  returnType?: string;
  [key: string]: unknown;
}

export interface TriodeTransformChain {
  out(
    output?: unknown | TriodeRenderCallOptions,
    options?: TriodeTransformRenderOptions,
  ): TriodeTransformChain;
  render(
    output?: unknown | TriodeRenderCallOptions,
    options?: TriodeTransformRenderOptions,
  ): TriodeTransformChain;
  autoClear(amount?: number, color?: number, options?: Record<string, unknown>): TriodeTransformChain;
  clear(amount?: number, color?: number, options?: Record<string, unknown>): TriodeTransformChain;
  basic(options?: Record<string, unknown>): TriodeTransformChain;
  phong(options?: Record<string, unknown>): TriodeTransformChain;
  lambert(options?: Record<string, unknown>): TriodeTransformChain;
  material(
    typeOrOptions?: "basic" | "lambert" | "phong" | Record<string, unknown>,
    options?: Record<string, unknown>,
  ): TriodeTransformChain;
  st(source: TriodeTransformChain): TriodeTransformChain;
  tex(output?: unknown | TriodeRenderCallOptions, options?: Record<string, unknown>): unknown;
  texture(output?: unknown | TriodeRenderCallOptions, options?: Record<string, unknown>): unknown;
  texMat(output?: unknown, options?: Record<string, unknown>): unknown;
  [method: string]: unknown;
}

export type TriodeTransformFactory = (...args: unknown[]) => TriodeTransformChain;

export interface TriodeSceneApi {
  add(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  mesh(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  box(material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  sphere(material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  quad(material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  points(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  lines(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  lineStrip(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  lineLoop(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  /** @deprecated Use lineStrip(...) instead. */
  linestrip(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  /** @deprecated Use lineLoop(...) instead. */
  lineloop(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  line(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  circle(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  ellipse(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  triangle(geometry?: unknown, material?: unknown, options?: TriodeObjectOptions): TriodeSceneApi;
  lights(options?: Record<string, unknown>): TriodeSceneApi;
  world(options?: Record<string, unknown>): TriodeSceneApi;
  group(attributes?: TriodeSceneAttributes): TriodeSceneApi;
  layer(id: number, options?: Record<string, unknown>): unknown;
  lookAt(target: unknown, options?: Record<string, unknown>): TriodeSceneApi;
  out(output?: unknown | TriodeRenderCallOptions, options?: TriodeTransformRenderOptions): TriodeSceneApi;
  render(output?: unknown | TriodeRenderCallOptions, options?: TriodeTransformRenderOptions): TriodeSceneApi;
  autoClear(amount?: number, color?: number, options?: Record<string, unknown>): TriodeSceneApi;
  clear(amount?: number, color?: number, options?: Record<string, unknown>): TriodeSceneApi;
  at(index?: number): unknown;
  obj(index?: number): unknown;
  texture(output?: unknown | TriodeRenderCallOptions, options?: Record<string, unknown>): unknown;
  instanced(geometry: unknown, material: unknown, count: number, options?: TriodeObjectOptions): unknown;
  find(filter?: Record<string, unknown>): unknown[];
  empty(): boolean;
  [key: string]: unknown;
}

export interface TriodeTextureApi extends TriodeModuleApi {
  fbo(options?: Record<string, unknown>): unknown;
  data(data: ArrayLike<number> | number[], options?: Record<string, unknown>): unknown;
  load(url: string, onLoad?: (texture: unknown) => void, onError?: (error: unknown) => void): unknown;
}

export interface TriodeGeometryApi extends TriodeModuleApi {
  box(...args: number[]): unknown;
  sphere(...args: number[]): unknown;
  plane(...args: number[]): unknown;
  circle(...args: number[]): unknown;
  line(points: Array<unknown>): unknown;
  points(count: number): unknown;
  grid(...args: unknown[]): unknown;
  posFromEleAzi(elevation: number, azimuth: number, radius?: number): { x: number; y: number; z: number };
}

export interface TriodeGuiApi extends TriodeModuleApi {
  init(): Promise<void>;
  create(name?: string): Promise<unknown>;
  addFolder(
    name: string,
    settings: Record<string, unknown>,
    setupFn?: (folder: unknown, settings: Record<string, unknown>) => void,
    gui?: unknown,
  ): Promise<Record<string, unknown>>;
  lights(scene: TriodeSceneApi, camera: unknown, defaults?: Record<string, unknown>): Record<string, unknown>;
  world(scene: TriodeSceneApi, defaults?: Record<string, unknown>): Record<string, unknown>;
}

export interface TriodeSynthApi {
  time: number;
  bpm: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  fps?: number;
  stats: TriodeStats;
  speed: number;
  mouse: unknown;
  update: (dt: number) => void;
  onFrame: (callback: (dt: number, time: number) => void) => void;
  afterUpdate: (dt: number) => void;
  click: (event: Event) => void;
  mousedown: (event: Event) => void;
  mouseup: (event: Event) => void;
  mousemove: (event: Event) => void;
  keydown: (event: KeyboardEvent) => void;
  keyup: (event: KeyboardEvent) => void;
  onError?: TriodeRuntimeErrorHandler;
  liveMode: TriodeLiveMode;
  legacy: boolean;
  render: (output?: unknown) => void;
  liveGlobals: (enable?: boolean) => boolean;
  setResolution: (width: number, height: number) => void;
  hush: () => void;
  resetRuntime: () => void;
  tick: (dt: number, uniforms?: unknown) => void;
  shadowMap: (options?: Record<string, unknown>) => void;
  scene: (attributes?: TriodeSceneAttributes) => TriodeSceneApi;
  stage: (config?: TriodeStageConfig) => TriodeSceneApi;
  ortho: (eye?: TriodeNumericTuple, target?: TriodeNumericTuple, options?: TriodeCameraOptions) => unknown;
  perspective: (eye?: TriodeNumericTuple, target?: TriodeNumericTuple, options?: TriodeCameraOptions) => unknown;
  screenCoords: (width?: number, height?: number) => unknown;
  normalizedCoords: () => unknown;
  cartesianCoords: (width?: number, height?: number) => unknown;
  setFunction: (definition: TriodeTransformDefinition) => void;
  osc: TriodeTransformFactory;
  noise: TriodeTransformFactory;
  solid: TriodeTransformFactory;
  src: TriodeTransformFactory;
  tx: TriodeTextureApi;
  gm: TriodeGeometryApi;
  mt: TriodeModuleApi;
  cmp: TriodeModuleApi;
  rnd: TriodeModuleApi;
  nse: TriodeModuleApi;
  tex: TriodeTextureApi;
  geom: TriodeGeometryApi;
  mat: TriodeModuleApi;
  compose: TriodeModuleApi;
  random: TriodeModuleApi;
  noiseUtil: TriodeModuleApi;
  gui: TriodeGuiApi;
  arr: TriodeModuleApi;
  el: TriodeModuleApi;
  math: Record<string, (value: number, ...args: number[]) => number>;
  [key: string]: unknown;
}

declare class TriodeRenderer {
  constructor(options?: TriodeOptions);
  readonly synth: TriodeSynthApi;
  readonly liveMode: TriodeLiveMode;
  readonly legacy: boolean;
  readonly canvas: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  readonly o: unknown[];
  readonly s: unknown[];

  eval(code: string): void;
  getScreenImage(callback: (blob: Blob) => void): void;
  hush(): void;
  resetRuntime(): void;
  loadScript(url?: string, once?: boolean): Promise<void>;
  setResolution(width: number, height: number): void;
  tick(dt: number, uniforms?: unknown): void;
  shadowMap(options?: Record<string, unknown>): void;
  scene(attributes?: TriodeSceneAttributes): TriodeSceneApi;
  stage(config?: TriodeStageConfig): TriodeSceneApi;
  onFrame(callback: (dt: number, time: number) => void): void;
  liveGlobals(enable?: boolean): boolean;
  dispose(): void;
}

export {
  TriodeRenderer,
};

export type HydraOptions = TriodeOptions;
export type HydraStats = TriodeStats;
export type HydraRuntimeErrorContext = TriodeRuntimeErrorContext;
export type HydraRuntimeErrorHandler = TriodeRuntimeErrorHandler;
export type HydraLiveMode = TriodeLiveMode;
export type HydraModuleMethod = TriodeModuleMethod;
export type HydraNumericTuple = TriodeNumericTuple;
export type HydraControlModifier = TriodeControlModifier;
export type HydraCameraControlsOptions = TriodeCameraControlsOptions;
export type HydraCameraOptions = TriodeCameraOptions;
export type HydraStageCameraPreset = TriodeStageCameraPreset;
export type HydraStageCameraConfig = TriodeStageCameraConfig;
export type HydraStageConfig = TriodeStageConfig;
export type HydraModuleApi = TriodeModuleApi;
export type HydraTransformRenderOptions = TriodeTransformRenderOptions;
export type HydraRenderCallOptions = TriodeRenderCallOptions;
export type HydraSceneAttributes = TriodeSceneAttributes;
export type HydraObjectOptions = TriodeObjectOptions;
export type HydraTransformDefinition = TriodeTransformDefinition;
export type HydraTransformChain = TriodeTransformChain;
export type HydraTransformFactory = TriodeTransformFactory;
export type HydraSceneApi = TriodeSceneApi;
export type HydraTextureApi = TriodeTextureApi;
export type HydraGeometryApi = TriodeGeometryApi;
export type HydraGuiApi = TriodeGuiApi;
export type HydraSynthApi = TriodeSynthApi;
export type HydraRenderer = TriodeRenderer;

export default TriodeRenderer;

declare global {
  interface Window {
    Triode?: typeof TriodeRenderer;
    triodeSynth?: TriodeRenderer;
    Hydra?: typeof TriodeRenderer;
    hydraSynth?: TriodeRenderer;
    loadScript?: (url?: string, once?: boolean) => Promise<void>;
    getCode?: () => void;
  }
}
