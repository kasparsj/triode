import loop from "raf-loop";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

import Output from "../output.js";
import Source from "../triode-source.js";
import Sandbox from "../eval-sandbox.js";
import { GeneratorFactory } from "../generator-factory.js";
import Audio from "./audio.js";
import VidRecorder from "./video-recorder.js";

const createDefaultRuntimeAdapters = () => ({
  createLoop: (tick) => loop(tick),
  createAudio: (options) => new Audio(options),
  createVideoRecorder: (stream) => new VidRecorder(stream),
  captureCanvasStream: (canvas, fps = 25) => canvas.captureStream(fps),
  createOutput: (index, runtime) => new Output(index, runtime),
  createSource: (options) => new Source(options),
  createGeneratorFactory: (options) => new GeneratorFactory(options),
  createSandbox: (synth, makeGlobal, userProps) =>
    new Sandbox(synth, makeGlobal, userProps),
  createRenderer: ({ webgl, options }) =>
    webgl === 1
      ? new THREE.WebGL1Renderer(options)
      : new THREE.WebGLRenderer(options),
  createComposer: (renderer) => new EffectComposer(renderer),
  createCss2DRenderer: (options) => new CSS2DRenderer(options),
  createCss3DRenderer: (options) => new CSS3DRenderer(options),
  createShaderMaterial: (options) => new THREE.ShaderMaterial(options),
  createShaderPass: (material) => new ShaderPass(material),
});

const defaultRuntimeAdapters = createDefaultRuntimeAdapters();

const resolveRuntimeAdapters = (overrides = {}) =>
  Object.assign({}, defaultRuntimeAdapters, overrides || {});

export {
  createDefaultRuntimeAdapters,
  defaultRuntimeAdapters,
  resolveRuntimeAdapters,
};
