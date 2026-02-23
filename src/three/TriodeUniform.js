import Output from "../output.js";
import Source from "../triode-source.js";

class TriodeUniform
{
    static all = {};

    static get(name, group = 'default') {
        const entry = this.all[group] ? this.all[group][name] : null;
        if (entry) {
            return entry;
        }
        if (group === "triode" && this.all.hydra) {
            return this.all.hydra[name] || null;
        }
        if (group === "hydra" && this.all.triode) {
            return this.all.triode[name] || null;
        }
        return null;
    }

    constructor(name, value, cb, group) {
        this._value = value;
        this.name = name;
        this.cb = cb;
        if (group) {
            if (typeof TriodeUniform.all[group] === 'undefined') TriodeUniform.all[group] = {};
            if (typeof(TriodeUniform.all[group][name]) !== 'undefined') {
                delete TriodeUniform.all[group][name];
            }
            TriodeUniform.all[group][name] = this;
        }
    }

    get value() {
        if (this.cb) {
            this._value = this.cb.call(this);
        }
        return this._value;
    }

    static wrapUniforms(uniforms) {
        const props = () => {
            return {
                time: TriodeUniform.get('time', 'triode').value,
                bpm: TriodeUniform.get('bpm', 'triode').value,
            };
        };
        return Object.keys(uniforms).reduce((acc, key) => {
            acc[key] = typeof(uniforms[key]) === 'string' ? parseFloat(uniforms[key]) : uniforms[key];
            if (typeof acc[key] === 'function') {
                const func = acc[key];
                acc[key] = new TriodeUniform(key, null, ()=>func(null, props()));
            }
            else if (acc[key] instanceof Output || acc[key] instanceof Source) {
                const o = acc[key];
                acc[key] = new TriodeUniform(key, null, ()=>o.getTexture());
            }
            else if (typeof acc[key].value === 'undefined') acc[key] = { value: acc[key] }
            return acc;
        }, {});
    }
}

export { TriodeUniform, TriodeUniform as HydraUniform };
