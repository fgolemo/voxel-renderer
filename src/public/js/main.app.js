(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ \"./node_modules/three/examples/jsm/controls/OrbitControls.js\");\n/* harmony import */ var dat_gui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dat.gui */ \"./node_modules/dat.gui/build/dat.gui.module.js\");\n/* harmony import */ var _dragdropper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dragdropper */ \"./src/js/dragdropper.js\");\n\n\nvar _require = __webpack_require__(/*! mathjs */ \"./node_modules/mathjs/main/esm/index.js\"),\n    mean = _require.mean,\n    std = _require.std;\n\n // import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';\n\n\n\nvar SPLATSIZE = 4.0 / 128; // let gui = new dat.GUI();\n// let options = {\n//   model: {\n//     original: true,\n//     rotated: false\n//   }\n// };\n//\n// let opt = gui.addFolder('Model');\n// let optOrig = opt.add(options.model, 'original').listen();\n// let optRot = opt.add(options.model, 'rotated').listen();\n// opt.open();\n\nvar scene = new three__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\nvar camera = new three__WEBPACK_IMPORTED_MODULE_0__[\"PerspectiveCamera\"](75, window.innerWidth / window.innerHeight, 0.1, 1000);\nvar renderer = new three__WEBPACK_IMPORTED_MODULE_0__[\"WebGLRenderer\"]({\n  alpha: true\n});\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);\nrenderer.setClearColor(0xffffff, 0);\nrenderer.sortObjects = false;\nvar controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__[\"OrbitControls\"](camera, renderer.domElement);\ncontrols.enableDamping = true;\ncontrols.dampingFactor = 0.25;\ncontrols.enableZoom = true;\ncamera.position.set(1, 1, 2);\ncontrols.update(); // var geometry = new THREE.SphereGeometry(.5, 32, 32);\n// var material = new THREE.MeshLambertMaterial({color: 0xffff00});\n// var sphere = new THREE.Mesh(geometry, material);\n// scene.add(sphere);\n\nvar light = new three__WEBPACK_IMPORTED_MODULE_0__[\"AmbientLight\"](0x404040); // soft white light\n\nscene.add(light);\nvar directionalLight = new three__WEBPACK_IMPORTED_MODULE_0__[\"DirectionalLight\"](0xffffff, 0.5);\nscene.add(directionalLight);\nvar pointlight = new three__WEBPACK_IMPORTED_MODULE_0__[\"PointLight\"](0xffff00, 1, 100);\npointlight.position.set(5, 5, 5);\nscene.add(pointlight);\nvar pointlight_b = new three__WEBPACK_IMPORTED_MODULE_0__[\"PointLight\"](0xff00ff, 1, 100);\npointlight_b.position.set(0, -5, -5);\nscene.add(pointlight_b);\nvar axesHelper = new three__WEBPACK_IMPORTED_MODULE_0__[\"AxesHelper\"](1);\nscene.add(axesHelper);\n\nfunction Float32Concat(first, second) {\n  var firstLength = first.length,\n      result = new Float32Array(firstLength + second.length);\n  result.set(first);\n  result.set(second, firstLength);\n  return result;\n}\n\nfunction createSplat(x, y, z, r, g, b, a, scale) {\n  var geometry = new three__WEBPACK_IMPORTED_MODULE_0__[\"BoxGeometry\"](1 * scale, 1 * scale, 1 * scale); // let geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale);\n  // geometry.lookAt(new THREE.Vector3(0, 0, 1000));\n\n  geometry.translate(x, y, z); // geometry.translate(x-.5, y-.5, z);\n\n  for (var _i in geometry.faces) {\n    geometry.faces[_i].color = new three__WEBPACK_IMPORTED_MODULE_0__[\"Color\"](r / 255, g / 255, b / 255); // geometry.faces[i].color = new THREE.Color(r,g, b);\n  } // let numVertices = geometry.attributes.position.count;\n\n\n  var numVertices = 36; // let alphas = new Float32Array(numVertices);\n\n  var alphas = [];\n\n  for (var i = 0; i < numVertices; i++) {\n    alphas.push(a);\n  } // for (var i = 0; i < numVertices; i++) {\n  //   alphas[i] = a;\n  // }\n  // geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );\n  // splat.castShadow = true;\n  // splat.receiveShadow = false;\n\n\n  return {\n    geo: geometry,\n    alphas: alphas\n  };\n}\n\nvar loader = new three__WEBPACK_IMPORTED_MODULE_0__[\"FileLoader\"]();\n\nvar parse = __webpack_require__(/*! csv-parse/lib/sync */ \"./node_modules/csv-parse/lib/sync.js\");\n\nvar dataHolder = [];\n\nfunction parseCSV(data) {\n  var records = parse(data, {\n    columns: false,\n    cast: true\n  });\n  var geo = new three__WEBPACK_IMPORTED_MODULE_0__[\"Geometry\"]();\n  var counter = 0;\n  var minx = 10000;\n  var maxx = -10000;\n  var miny = 10000;\n  var maxy = -10000;\n  var minz = 10000;\n  var maxz = -10000;\n  var zs = []; // records.forEach(function (row) {\n  //   maxx = Math.max(maxx, row[0]);\n  //   minx = Math.min(minx, row[0]);\n  //\n  //   maxy = Math.max(maxy, row[1]);\n  //   miny = Math.min(miny, row[1]);\n  //\n  //   maxz = Math.max(maxz, row[2]);\n  //   minz = Math.min(minz, row[2]);\n  //   zs.push(row[2]);\n  // });\n  // let meanZ = mean(zs);\n  // let stdZ = std(zs);\n  // let alphas = [];\n\n  var alphas = new Float32Array(9437184);\n  records.forEach(function (row) {\n    // let x_norm = 1 - ((row[0] - minx) / (maxx - minx));\n    // let y_norm = (row[1] - miny) / (maxy - miny);\n    // // let z_norm = (row[2] - meanZ) / (stdZ) + minz;\n    // let z_norm = (row[2] - minz) / (maxz - minz);\n    // let a = createSplat(y_norm, x_norm, z_norm, row[3], row[4], row[5], 1, SPLATSIZE);\n    var a = createSplat(row[0], row[1], row[2], row[3], row[4], row[5], row[6], SPLATSIZE); // geo.merge((new THREE.Geometry()).fromBufferGeometry(a));\n\n    geo.merge(a.geo); // alphas = alphas.concat(a.alphas);\n\n    for (var i = 0; i < 36; i++) {\n      alphas[counter * 36 + i] = a.alphas[i];\n    }\n\n    counter++;\n  }); // console.log(\"max x: \"+maxx+\", max y: \"+maxy+\", min/max z: \"+minz+\"/\"+maxz);\n\n  var buf = new three__WEBPACK_IMPORTED_MODULE_0__[\"BufferGeometry\"]().fromGeometry(geo); // let numVertices = buf.attributes.position.count;\n  // console.log(\"vertices:\"+numVertices);\n  // console.log(\"alphas:\"+alphas.length);\n\n  buf.setAttribute('alpha', new three__WEBPACK_IMPORTED_MODULE_0__[\"BufferAttribute\"](alphas, 1));\n  dataHolder.forEach(function (dataH) {\n    scene.remove(dataH);\n  });\n  dataHolder.length = 0;\n  [three__WEBPACK_IMPORTED_MODULE_0__[\"BackSide\"], three__WEBPACK_IMPORTED_MODULE_0__[\"FrontSide\"]].forEach(function (side) {\n    // let matNormal = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, vertexColors: THREE.FaceColors});\n    var shaderMaterial = new three__WEBPACK_IMPORTED_MODULE_0__[\"ShaderMaterial\"]({\n      vertexShader: document.getElementById('vertexshader').textContent,\n      fragmentShader: document.getElementById('fragmentshader').textContent,\n      transparent: true,\n      vertexColors: three__WEBPACK_IMPORTED_MODULE_0__[\"FaceColors\"],\n      side: side,\n      // lights: true,\n      // blending: THREE.NormalBlending,\n      depthTest: false,\n      fog: false\n    });\n    var meshNormal = new three__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"](buf, shaderMaterial); // meshNormal.visible = config;\n\n    dataHolder.push(meshNormal);\n    scene.add(meshNormal);\n  });\n  console.log(\"added\", counter); // meshHolder[name] = meshNormal;\n}\n\nfunction openCSV(path) {\n  //load a text file and output the result to the console\n  loader.load( // resource URL\n  path, function (data) {\n    parseCSV(data);\n  }, function (xhr) {\n    console.log(xhr.loaded / xhr.total * 100 + '% loaded');\n  }, function (err) {\n    console.error('An error happened');\n  });\n} // openCSV('/data/face_ortho.csv', \"normal\");\n// optOrig.onFinishChange(function (value) {\n//   meshHolder[\"normal\"].visible = value;\n// });\n\n\nvar ds = new _dragdropper__WEBPACK_IMPORTED_MODULE_3__[\"default\"](parseCSV);\n\nvar animate = function animate() {\n  requestAnimationFrame(animate); // cube.rotation.x += 0.01;\n  // cube.rotation.y += 0.01;\n\n  renderer.render(scene, camera);\n};\n\nanimate();\n\n//# sourceURL=webpack:///./src/js/app.js?");

/***/ }),

/***/ "./src/js/dragdropper.js":
/*!*******************************!*\
  !*** ./src/js/dragdropper.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Dragdropper; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Dragdropper =\n/*#__PURE__*/\nfunction () {\n  function Dragdropper(parser) {\n    _classCallCheck(this, Dragdropper);\n\n    this.parser = parser; // check if filereader is available\n\n    if (typeof window.FileReader === 'undefined') {\n      console.error(\"Filereader not supported\");\n    }\n\n    this.drop = this.drop.bind(this);\n    document.addEventListener(\"drop\", this.drop);\n    document.addEventListener(\"dragover\", function (event) {\n      // prevent default to allow drop\n      event.preventDefault();\n    }, false);\n  }\n\n  _createClass(Dragdropper, [{\n    key: \"drop\",\n    value: function drop(e) {\n      var _this = this;\n\n      e.preventDefault();\n      var file = e.dataTransfer.files[0];\n      var reader = new FileReader();\n\n      reader.onload = function (event) {\n        var lines = event.target.result.split(\"\\n\"); // this.splatScene.updateSplats(lines);\n\n        _this.parser(event.target.result);\n      };\n\n      reader.readAsText(file);\n      return false;\n    }\n  }]);\n\n  return Dragdropper;\n}(); // 0.0,0.0,3.2062671184539795,0.3873279392719269,0.4789067208766937,0.2007342427968979\n\n\n\n\n//# sourceURL=webpack:///./src/js/dragdropper.js?");

/***/ }),

/***/ 0:
/*!*****************************!*\
  !*** multi ./src/js/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/js/app.js */\"./src/js/app.js\");\n\n\n//# sourceURL=webpack:///multi_./src/js/app.js?");

/***/ }),

/***/ 1:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ }),

/***/ 2:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ })

},[[0,"runtime","vendors"]]]);