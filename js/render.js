const THREE = require("three");
var scene = new THREE.Scene();
var main = document.querySelector(".main");
var w = main.offsetWidth;
var h = main.offsetHeight;
var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);


var color = new THREE.Color("hsl(0, 100%, 71%)");

var renderer = new THREE.WebGLRenderer();
renderer.setSize(w - 200, h - 200);
main.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(2, 1, 1);
var material = new THREE.MeshBasicMaterial({color});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);


camera.position.z = 5;

var animate = () => {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();