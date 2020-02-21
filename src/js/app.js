import * as THREE from 'three';

const {mean, std} = require('mathjs');
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import dat from 'dat.gui';
import Dragdropper from "./dragdropper";

const SPLATSIZE = 3.0 / 128;

// let gui = new dat.GUI();

// let options = {
//   model: {
//     original: true,
//     rotated: false
//   }
// };
//
// let opt = gui.addFolder('Model');
// let optOrig = opt.add(options.model, 'original').listen();
// let optRot = opt.add(options.model, 'rotated').listen();
// opt.open();

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff, 0);
// renderer.sortObjects = false;

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
camera.position.set(1, 1, 2);
controls.update();

var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
let pointlight = new THREE.PointLight(0xffff99, 1, 100);
pointlight.position.set(5, 5, 5);
scene.add(pointlight);
let pointlight_b = new THREE.PointLight(0xff99ff, 1, 100);
pointlight_b.position.set(0, -5, -5);
scene.add(pointlight_b);

var axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// function Float32Concat(first, second) {
//   var firstLength = first.length,
//     result = new Float32Array(firstLength + second.length);
//
//   result.set(first);
//   result.set(second, firstLength);
//
//   return result;
// }

function createSplat(x, y, z, r, g, b, a, scale) {
  let geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale);
  geometry.lookAt(new THREE.Vector3(0, 0, 1000));
  geometry.translate(x, y, z);
  for (let i in geometry.faces) {
    geometry.faces[i].color = new THREE.Color(r / 255, g / 255, b / 255);
  }
  let numVertices = 36;
  // let alphas = new Float32Array(numVertices);
  let alphas = [];
  for (var i = 0; i < numVertices; i++) {
    alphas.push(a);
  }
  return {geo: geometry, alphas: alphas};
}

var loader = new THREE.FileLoader();
let parse = require('csv-parse/lib/sync');

let dataHolder = [];

function parseCSV(data) {
  let records = parse(data, {
    columns: false,
    cast: true
  });
  let geo = new THREE.Geometry();
  let counter = 0;
  let alphas = new Float32Array(9437184);
  var BreakException = {};

  try {
    records.slice().reverse().forEach(function (row) {
      let a = createSplat(row[0], row[1], row[2], row[3], row[4], row[5], row[6], SPLATSIZE);
      geo.merge(a.geo);
      for (var i = 0; i < 36; i++) {
        alphas[(counter * 36) + i] = a.alphas[i];
      }
      counter++;
      // if (counter === 128*128*3) throw BreakException
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  let buf = new THREE.BufferGeometry().fromGeometry(geo);
  buf.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

  dataHolder.forEach((dataH) => {
    scene.remove(dataH);
  });
  dataHolder.length = 0;

  [THREE.FrontSide].forEach((side) => {
    // let matNormal = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, vertexColors: THREE.FaceColors});
    let shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent,
      transparent: true,
      vertexColors: THREE.FaceColors,
      side: side,
      // blending: THREE.NormalBlending,
      alphaTest: 0.1,
      opacity: 0.5,
      // depthWrite: false,
      // depthTest: true
    });
    let meshNormal = new THREE.Mesh(buf, shaderMaterial);
    // meshNormal.visible = config;
    dataHolder.push(meshNormal);
    scene.add(meshNormal);
  });
  console.log("added", counter);
}

function openCSV(path) {
  //load a text file and output the result to the console
  loader.load(
    // resource URL
    path,
    function (data) {
      parseCSV(data);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (err) {
      console.error('An error happened');
    }
  );
}


// ======== TESTING START
//
// const boxWidth = .3;
// const boxHeight = .3;
// const boxDepth = .3;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
//
// function makeInstance(geometry, color, x, y, z) {
//   [THREE.BackSide, THREE.FrontSide].forEach((side) => {
//
//     for (let i in geometry.faces) {
//       geometry.faces[i].color = color;
//     }
//
//     let shaderMaterial = new THREE.ShaderMaterial({
//       vertexShader: document.getElementById('vertexshader').textContent,
//       fragmentShader: document.getElementById('fragmentshader').textContent,
//       transparent: true,
//       vertexColors: THREE.FaceColors,
//       // vertexColors: THREE.VertexColors,
//       side: side,
//       blending: THREE.NormalBlending,
//       alphaTest: 0.01,
//       // opacity: 0.5,
//       // depthWrite: true,
//       // depthTest: true
//     });
//
//     let buf = new THREE.BufferGeometry().fromGeometry(geometry);
//     let alphas = new Float32Array(new Array(36).fill(.7));
//     buf.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
//
//     const cube = new THREE.Mesh(buf, shaderMaterial);
//     scene.add(cube);
//
//     cube.position.set(x, y, z);
//   });
//
// }
//
// function hsl(h, s, l) {
//   return (new THREE.Color()).setHSL(h, s, l);
// }
//
//
// const d = 0.5;
// makeInstance(geometry, hsl(0 / 27, 1, .5), -d, -d, -d);
// makeInstance(geometry, hsl(1 / 27, 1, .5), 0, -d, -d);
// makeInstance(geometry, hsl(2 / 27, 1, .5), d, -d, -d);
//
// makeInstance(geometry, hsl(3 / 27, 1, .5), -d, 0, -d);
// makeInstance(geometry, hsl(4 / 27, 1, .5), 0, 0, -d);
// makeInstance(geometry, hsl(5 / 27, 1, .5), d, 0, -d);
//
// makeInstance(geometry, hsl(6 / 27, 1, .5), -d, d, -d);
// makeInstance(geometry, hsl(7 / 27, 1, .5), 0, d, -d);
// makeInstance(geometry, hsl(8 / 27, 1, .5), d, d, -d);
//
// makeInstance(geometry, hsl(9 / 27, 1, .5), -d, -d, 0);
// makeInstance(geometry, hsl(10 / 27, 1, .5), 0, -d, 0);
// makeInstance(geometry, hsl(11 / 27, 1, .5), d, -d, 0);
//
// makeInstance(geometry, hsl(12 / 27, 1, .5), -d, 0, 0);
// makeInstance(geometry, hsl(13 / 27, 1, .5), 0, 0, 0);
// makeInstance(geometry, hsl(14 / 27, 1, .5), d, 0, 0);
//
// makeInstance(geometry, hsl(15 / 27, 1, .5), -d, d, 0);
// makeInstance(geometry, hsl(16 / 27, 1, .5), 0, d, 0);
// makeInstance(geometry, hsl(17 / 27, 1, .5), d, d, 0);
//
// makeInstance(geometry, hsl(18 / 27, 1, .5), -d, -d, d);
// makeInstance(geometry, hsl(19 / 27, 1, .5), 0, -d, d);
// makeInstance(geometry, hsl(20 / 27, 1, .5), d, -d, d);
//
// makeInstance(geometry, hsl(21 / 27, 1, .5), -d, 0, d);
// makeInstance(geometry, hsl(22 / 27, 1, .5), 0, 0, d);
// makeInstance(geometry, hsl(23 / 27, 1, .5), d, 0, d);
//
// makeInstance(geometry, hsl(24 / 27, 1, .5), -d, d, d);
// makeInstance(geometry, hsl(25 / 27, 1, .5), 0, d, d);
// makeInstance(geometry, hsl(26 / 27, 1, .5), d, d, d);

// ======== TESTING END


let ds = new Dragdropper(parseCSV);

let animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};


animate();
