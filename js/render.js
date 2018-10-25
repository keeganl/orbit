// Initialize Firebase
var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId
};

firebase.initializeApp(config);

// Accessing HTML elements
var drawerbtn = document.querySelector(".drawerbtn");
var sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");
var fileIO = document.querySelector("#files");


var provider = new firebase.auth.GithubAuthProvider();
provider.addScope("repo");

firebase.auth().signInWithPopup(provider).then(function (result) {
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function (error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

// Push sidebar content
function drawerCheck() {
  if (sidebar.style.width == "0px" && main.style.marginLeft == "0px") {
    sidebar.style.width = "200px";
    main.style.marginLeft = "200px";
  } else {
    sidebar.style.width = "0px";
    main.style.marginLeft = "0px";
  }
}

drawerbtn.onclick = () => {
  drawerCheck();
};

// Push file to firebase db
fileIO.onchange = () => {
  const ref = firebase.storage().ref();
  const file = document.querySelector("#input").files[0];
  const name = file.name;
  const metadata = {
    contentType: file.type
  };
  const task = ref.child(name).put(file, metadata);
  task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      var div = document.createElement("div");
      var title = document.createElement("p");
      var clickURL = document.createElement("a");
      var urlWords = document.createTextNode(name);

      clickURL.appendChild(urlWords);
      clickURL.href = url;
      clickURL.target = "_blank";
      
      title.appendChild(clickURL);
      div.appendChild(title);
      div.classList.add("item");

      var searchBar = document.querySelector(".search");
      searchBar.appendChild(div);
      console.log(url);
    })
    .catch(console.error);
}

// Modal
var modalBtn = document.querySelector("#user");
var modal = document.querySelector("#modal");

modalBtn.onclick = () => {
  modal.style.display = "block";
}

window.onclick = (e) => {
  if(e.target == modal) {
    modal.style.display = "none";
  }
}

function modalExit() {
  modal.style.display = "none";
}

var login = document.getElementById("login");
var signup = document.getElementById("sign");
const form = document.getElementById("form");
const emailRef = document.getElementById("email");
const passwordRef = document.getElementById("password");
const submitForm = document.getElementById("submit");
const welcome = document.getElementById("welcome")

function createUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });
  emailRef.classList.add("right");
  passwordRef.classList.add("right");
  var successCon = document.createElement("h1");
  var successMsg = document.createTextNode("🎉Thanks for signing up!🎉");
  successCon.appendChild(successMsg);
  successCon.classList.add("fadein");
  form.append(successCon);
  setTimeout(() => {
    emailRef.classList.remove("right");
    passwordRef.classList.remove("right");
    successCon.remove();
    form.reset();
    modalExit();
  }, 3500)
  
}

function signInUser(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });
  emailRef.classList.add("right");
  passwordRef.classList.add("right");
  var splitEmail = email.split("@"); 
  console.log(splitEmail);
  const username = splitEmail[0];
  var successCon = document.createElement("h1");
  var successMsg = document.createTextNode("🎉Welcome back " + username + " 🎉");
  successCon.appendChild(successMsg);
  successCon.classList.add("fadein");
  form.append(successCon);
  setTimeout(() => {
    emailRef.classList.remove("right");
    passwordRef.classList.remove("right");
    successCon.remove();
    form.reset();
    welcome.innerHTML = "Hey, " + username;
    modalExit();
  }, 3500);
  
}

function noInfo() {
  var errorCon = document.createElement("h1");
  var errorMsg = document.createTextNode("Hey you forgot some information! 😯");
  errorCon.appendChild(errorMsg);
  errorCon.classList.add("fadein");
  form.append(errorCon);
  emailRef.classList.add("wrong");
  passwordRef.classList.add("wrong");
  setTimeout(() => {
    emailRef.classList.remove("wrong");
    passwordRef.classList.remove("wrong");
    errorCon.remove();
  }, 3500);
}

login.onclick = () => {
  if (signup.classList.contains("borderbot")) {
    signup.classList.remove("borderbot");
  }
  login.classList.add("borderbot");
  submitForm.onclick = () => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if ((email == "") || (password == "")) {
      noInfo();
      return;
    }
    signInUser(email, password);
  }
}

signup.onclick = () => {
  if (login.classList.contains("borderbot")) {
    login.classList.remove("borderbot");
  }
  signup.classList.add("borderbot"); 
  submitForm.onclick = () => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if ((email == "") || (password == "")) {
      noInfo();
      return;
    }
    createUser(email, password);
  }
}

// // Three JS 

function init() {
  // var stats = initStats();
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  // create a render and set the size
  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x000, 1.0));
  webGLRenderer.setSize(400, 400);
  webGLRenderer.shadowMapEnabled = true;
  // position and point the camera to the center of the scene
  camera.position.x = 150;
  camera.position.y = 150;
  camera.position.z = 150;
  camera.lookAt(new THREE.Vector3(0, 40, 0));
  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(150, 150, 150);
  scene.add(spotLight);
  // add the output of the renderer to the html element
  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);
  // call the render function
  var step = 0;
  // setup the control gui
  // var controls = new function () {
  //   // we need the first child, since it's a multimaterial
  // };
  var group;
  //var gui = new dat.GUI();
  // model from http://www.thingiverse.com/thing:69709
  var loader = new THREE.STLLoader();
  var group = new THREE.Object3D();
  loader.load(
    "./assets/models/Duck.stl",
    function(geometry) {
      console.log(geometry);
      var mat = new THREE.MeshLambertMaterial({ color: 0x4C4747 });
      group = new THREE.Mesh(geometry, mat);
      group.rotation.x = -0.5 * Math.PI;
      group.scale.set(1, 1, 1);
      scene.add(group);
    }
  );
  render();
  function render() {
    //stats.update();
    if (group) {
      group.rotation.z += 0.006;
      // group.rotation.x+=0.006;
    }
    // render using requestAnimationFrame
   requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
  // function initStats() {
  //   var stats = new Stats();
  //   stats.setMode(0); // 0: fps, 1: ms
  //   // Align top-left
  //   stats.domElement.style.position = 'absolute';
  //   stats.domElement.style.left = '0px';
  //   stats.domElement.style.top = '0px';
  //   document.getElementById("Stats-output").appendChild(stats.domElement);
  //   return stats;
  // }
}
window.onload = init;