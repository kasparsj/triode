import Triode from "../src/triode-synth.js";

function init() {
  const triode = new Triode({ detectAudio: false, makeGlobal: true });
  const H = triode.synth;
  window.triodeSynth = triode;
  window.hydraSynth = triode;

  H.perspective([2, 2, 3], [0, 0, 0], { controls: true });

  // create geometry and material
  const geom = H.gm.box();
  const mat = H.osc().rotate(H.noise(1).mult(45)).phong();

  // compose scene
  const sc = H.scene().lights().mesh(geom, mat).out();

  const animate = () => {
    const box = sc.at(0);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
  };

  // In makeGlobal mode, EvalSandbox pulls `update` from window on each tick.
  window.update = animate;
  H.update = animate;
}

window.onload = init;
