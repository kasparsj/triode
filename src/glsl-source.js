// SPDX-License-Identifier: AGPL-3.0-only
// Derived in part from hydra-synth/src/glsl-source.js (https://github.com/hydra-synth/hydra-synth).
import generateGlsl from './generate-glsl.js'
import utilityGlsl from './glsl/utility-functions.js'
import {replaceGenType} from "./types.js"
import {TriodeFragmentShader, TriodeVertexShader} from "./lib/TriodeShader.js";
import {TriodeUniform} from "./three/TriodeUniform.js";
import {cameraMixin, autoClearMixin, sourceMixin} from "./lib/mixins.js";
import * as mt from "./three/mt.js";

var GlslSource = function (obj, options) {
  this.init(options);
  this.transforms = [obj];
  this.type = 'GlslSource';
  this.defaultUniforms = options.defaultUniforms;
  this.utils = Object.assign({}, utilityGlsl, options.utils);
  this._material = {};
  return this;
}

Object.assign(GlslSource.prototype, cameraMixin, sourceMixin, autoClearMixin);

GlslSource.prototype.addTransform = function (obj)  {
  this.transforms.push(obj)
}

GlslSource.prototype.createShaderInfo = function() {
  return generateGlsl(this);
}

GlslSource.prototype.createPass = function(shaderInfo, options = {}) {
  if (!options.uniforms) {
    const shaderUni = {}
    shaderInfo.uniforms.forEach((uniform) => { shaderUni[uniform.name] = uniform.value });
    options.uniforms = Object.assign({}, this.defaultUniforms, shaderUni);
  }
  options.uniforms = Object.assign({}, {
    prevBuffer: { value: null },
  }, TriodeUniform.wrapUniforms(options.uniforms));
  const transform = this.transforms[0];
  if (shaderInfo.combine) {
    if (transform) {
      Object.assign(options, {
        frag: new TriodeFragmentShader(Object.assign({}, transform.transform, {
          // todo: quickfix
          useUV: true,
        }), shaderInfo, this.utils),
        userArgs: transform.userArgs,
      });
    }
    // todo: quickfix
    delete options.renderTarget;
    return Object.assign({
      vert: new TriodeVertexShader({
        glslName: 'combine',
      }, shaderInfo, [], { useCamera: false }),
      viewport: this._viewport,
      autoClear: this._autoClear,
    }, options);
  }

  if (transform) {
    Object.assign(options, {
      frag: new TriodeFragmentShader(transform.transform, shaderInfo, this.utils),
      vert: new TriodeVertexShader(transform.transform, shaderInfo, this.utils, { useCamera: true }),
      primitive: transform.transform.primitive,
      userArgs: transform.userArgs,
    });
    if (this._material) {
      Object.assign(options, {
        material: Object.assign({lights: !!(this._material.isMeshLambertMaterial || this._material.isMeshPhongMaterial)}, this._material),
      });
    }
  }
  return Object.assign({
    camera: this._camera,
    viewport: this._viewport,
    autoClear: this._autoClear,
    fx: this._fx,
  }, options);
}

GlslSource.prototype.material = function(options) {
  if (typeof options === 'string') {
    const type = options.toLowerCase();
    const materialOptions = arguments.length > 1 ? arguments[1] : {};
    switch (type) {
      case 'basic':
        this._material = Object.assign({}, mt.basicProps, materialOptions);
        break;
      case 'lambert':
        this._material = Object.assign({}, mt.lambertProps, materialOptions);
        break;
      case 'phong':
        this._material = Object.assign({}, mt.phongProps, materialOptions);
        break;
      default:
        this._material = Object.assign({}, materialOptions);
        break;
    }
    return this;
  }
  this._material = Object.assign({}, options);
  return this;
}

GlslSource.prototype.basic = function(options = {}) {
  this.material('basic', options);
  return this;
}

GlslSource.prototype.phong = function(options = {}) {
  this.material('phong', options);
  return this;
}

GlslSource.prototype.lambert = function(options = {}) {
  this.material('lambert', options);
  return this;
}

GlslSource.prototype.st = function(source) {
  const self = this;
  source.transforms.map((transform) => {
    if (transform.transform.type === 'genType') {
      transform.transform = replaceGenType(transform.transform, 'coord')
    }
    self.transforms.push(transform);
  });
  return this;
}

const glslProps = ['x', 'y', 'z', 'xy', 'xz', 'yx', 'yz', 'zx', 'zy', 'xyz', 'xyzw', 'xxx', 'yyy', 'zzz'];
glslProps.map((prop) => {
  Object.defineProperty(GlslSource.prototype, prop, {
    get() {
      this.getter = prop;
      return this;
    }
  });
});

export default GlslSource
