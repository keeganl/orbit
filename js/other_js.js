function handleFileSelect(evt) {
  var files = evt.target.files; // FIlelist object
  // files is a Filelist of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push(
      '<li><strong>', escape(f.name),
      '</strong> (', f.type || 'n/a', ') - ',
      f.size, ' bytes, last modified: ',
      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
      '</li>'
    );

    var fileCon = document.createElement("div");
    var fileNameEl = document.createElement("p");
    var fileName = document.createTextNode(f.name);
    fileNameEl.appendChild(fileName);

    var fileTypeEl = document.createElement("p");
    var fileType = document.createTextNode(f.type);
    fileTypeEl.appendChild(fileType);

    var fileSizeEl = document.createElement("p");
    var fileSize = document.createTextNode(f.size);
    fileSizeEl.appendChild(fileSize);
    
    fileCon.appendChild(fileNameEl, fileTypeEl, fileSizeEl);
    fileCon.classList.add("item");

    var plus = document.getElementById("create");
    var parent = document.querySelector(".sidebar");
    parent.insertBefore(fileCon, plus);

    //console.log(output);
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);







// // Three JS 
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