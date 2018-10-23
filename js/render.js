var drawerbtn = document.querySelector(".drawerbtn");
var sidebar = document.querySelector(".sidebar")
var main = document.querySelector(".main");


drawerbtn.onclick = () => {
  if ((sidebar.style.width == "0px") && (main.style.marginLeft == "0px")) {
    sidebar.style.width = "200px";
    main.style.marginLeft = "200px";

  } else {
    sidebar.style.width = "0px";
    main.style.marginLeft = "0px";
  }
}








const THREE = require("three");
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x1E2022);
var w = main.offsetWidth;
var h = main.offsetHeight;
var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);


var color = new THREE.Color("hsl(0, 100%, 71%)");

var renderer = new THREE.WebGLRenderer({ alpha: false });
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