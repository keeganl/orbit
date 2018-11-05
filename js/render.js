
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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("User is signed in.");
    console.log(user.uid);
    welcome.innerHTML = "";
    // welcome.innerHTML = "Hey, " + user.email;
    profile.style.display = "inline";
    logout.style.display = "inline";
    modalBtn.style.display = "none";

  } else {
    console.log("No user is signed in.");
  }
});

// Variables
// Accessing HTML elements
var body = document.querySelector("body");
var drawerbtn = document.querySelector(".drawerbtn");
var sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");
var fileIO = document.querySelector("#files");
var storageBtn = document.querySelector(".store");
// Database stuff
var filenames = [];
var users = [];
// Reference to the storage
const ref = firebase.storage().ref();
// Reference to the database
var database = firebase.database();
// User Auth
var login = document.getElementById("login");
var logout = document.getElementById("logout");
var signup = document.getElementById("sign");
const form = document.getElementById("form");
const emailRef = document.getElementById("email");
const passwordRef = document.getElementById("password");
const submitForm = document.getElementById("submit");
const welcome = document.getElementById("welcome");
const deleteBtn = document.querySelector(".deletebtn");
// Modal
var modalBtn = document.querySelector("#user");
var modal = document.querySelector("#modal");
var profileBtn = document.querySelector("#profile");
var profileModal = document.querySelector("#profile-modal");
var flag = true;


// Functions 
// Push sidebar content
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function drawerCheck() {
  if (sidebar.style.width == "0px" && main.style.marginLeft == "0px") {
    sidebar.style.width = "200px";
    main.style.marginLeft = "200px";
  } else {
    sidebar.style.width = "0px";
    main.style.marginLeft = "0px";
  }
}
// Push filenames to db with user id
function storeFilenames(filenames, users) {
  database.ref('files/').set({
    filenames: filenames
  });
  database.ref('users/').set({
    usernames: users
  })
  console.log("Success");
}
// Push file to firebase storage 
fileIO.onchange = () => {
  const file = document.querySelector("#input").files[0];
  var name = file.name;
  filenames.push(name);
  const metadata = {
    contentType: file.type
  };
  const task = ref.child(name).put(file, metadata);
  task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      //const URLref = url;
      if (name.length > 25) {
        var div = document.createElement("div");
        var title = document.createElement("p");
        var marquee = document.createElement("marquee")
        var clickURL = document.createElement("a");
        var urlWords = document.createTextNode(name);

        clickURL.appendChild(urlWords);
        clickURL.href = url;
        clickURL.target = "_blank";

        marquee.appendChild(clickURL);
        title.appendChild(marquee);
        div.appendChild(title);
        div.classList.add("item");
      }
      else {
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
      }

      var searchBar = document.querySelector(".search");
      searchBar.appendChild(div);
      //console.log(url);
      renderObject(url);
    })
    .catch(console.error);
  console.log(filenames);
  
}

function createUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      emailRef.classList.add("right");
      passwordRef.classList.add("right");
      var splitEmail = email.split("@");
      console.log(splitEmail);
      const username = splitEmail[0];
      var successCon = document.createElement("h1");
      var successMsg = document.createTextNode("🎉Welcome " + capitalizeFirstLetter(username) + " 🎉");
      successCon.appendChild(successMsg);
      successCon.classList.add("fadein");
      form.append(successCon);

      setTimeout(() => {
        emailRef.classList.remove("right");
        passwordRef.classList.remove("right");
        successCon.remove();
        form.reset();
        // welcome.innerHTML = "Hey, " + capitalizeFirstLetter(username);
        logout.style.display = "inline";
        profile.style.display = "inline";
        modalBtn.style.display = "none";
        modalExit();
      }, 2500);
      users.push(email);
      console.log(users);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });
}

function signInUser(email, password) {
  //console.log(flag);
  if (firebase.auth().currrentUser) {
    firebase.auth().signOut();
  } 
  else {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        emailRef.classList.add("right");
        passwordRef.classList.add("right");
        var splitEmail = email.split("@");
        console.log(splitEmail);
        const username = splitEmail[0];
        var successCon = document.createElement("h1");
        var successMsg = document.createTextNode("🎉Welcome back " + capitalizeFirstLetter(username) + " 🎉");
        successCon.appendChild(successMsg);
        successCon.classList.add("fadein");
        form.append(successCon);

        setTimeout(() => {
          emailRef.classList.remove("right");
          passwordRef.classList.remove("right");
          successCon.remove();
          form.reset();
          // welcome.innerHTML = "Hey, " + capitalizeFirstLetter(username);
          logout.style.display = "inline";
          profile.style.display = "inline";
          modalBtn.style.display = "none";
          modalExit();
        }, 2500);
        users.push(email);
        console.log(users);
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        if (errorCode === "auth/wrong-password") {
          wrongPassword();
        } else {
          bothBad();
        }
      });
  }
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
  }, 2000);
}

function badEmail() {
  var errorCon = document.createElement("h1");
  var errorMsg = document.createTextNode("Thats not a valid email! 👎");
  errorCon.appendChild(errorMsg);
  errorCon.classList.add("fadein");
  form.append(errorCon);
  emailRef.classList.add("wrong");
  setTimeout(() => {
    emailRef.classList.remove("wrong");
    errorCon.remove();
    emailRef.value = "";
  }, 2000);
}

function badPassword() {
  var errorCon = document.createElement("h1");
  var errorMsg = document.createTextNode("You entered a weak password! 👎");
  errorCon.appendChild(errorMsg);
  errorCon.classList.add("fadein");
  form.append(errorCon);
  passwordRef.classList.add("wrong");
  setTimeout(() => {
    passwordRef.classList.remove("wrong");
    errorCon.remove();
    passwordRef.value = "";
  }, 2000);
}

function wrongPassword() {
  var errorCon = document.createElement("h1");
  var errorMsg = document.createTextNode("You entered the wrong password! 👎");
  submitForm.disabled;
  errorCon.appendChild(errorMsg);
  errorCon.classList.add("fadein");
  form.append(errorCon);
  passwordRef.classList.add("wrong");
  setTimeout(() => {
    passwordRef.classList.remove("wrong");
    errorCon.remove();
    passwordRef.value = "";
  }, 2000);

}

function bothBad() {
  var errorCon = document.createElement("h1");
  var errorMsg = document.createTextNode("Both fields are incorrect! 😕");
  errorCon.appendChild(errorMsg);
  errorCon.classList.add("fadein");
  form.append(errorCon);
  emailRef.classList.add("wrong");
  passwordRef.classList.add("wrong");
  setTimeout(() => {
    emailRef.classList.remove("wrong");
    passwordRef.classList.remove("wrong");
    errorCon.remove();
    emailRef.value = "";
    passwordRef.value = "";
  }, 2000);
}

// Deleting the files in the Firebase 
function deleteAll(all) {
  all.delete().then(function () {
    console.log("Files deleted.");
  }).catch(function (error) {
    console.log("error");
  })
}




// Event listeners
body.onload = () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
}
deleteBtn.onclick = () => {
  deleteAll(all);
};

drawerbtn.onclick = () => {
  drawerCheck();
};

storageBtn.onclick = () => {
  storeFilenames(filenames, users);
  console.log(filenames);
  console.log(users);
};

modalBtn.onclick = () => {
  modal.style.display = "block";
}

profileBtn.onclick = () => {
  profileModal.style.display = "block";
};

window.onclick = (e) => {
  if(e.target == modal) {
    modal.style.display = "none";
  }
  else if (e.target == profileModal) {
    profileModal.style.display = "none";
  }
}

function modalExit() {
  modal.style.display = "none";
}

login.onclick = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User is signed in.");
    } else {
      console.log("No user is signed in.");
    }
  });
  if (signup.classList.contains("borderbot")) {
    signup.classList.remove("borderbot");
  }

  // if (firebase.auth().currentUser) {
  //   firebase.auth().signOut();
  // } 
  // else {
    login.classList.add("borderbot");
    submitForm.onclick = () => {
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
      if (email == "" || password == "") {
        noInfo();
        return;
      } else if ((!email.includes("@") || !email.includes(".com" || ".net")) && password.length < 6) {
        bothBad();
        return;
      } else if (!email.includes("@") || !email.includes(".com" || ".net")) {
        badEmail();
        return;
      } else if (password.length < 6) {
        badPassword();
        return;
      } else {
        signInUser(email, password);      
      }
    };
  //}
}

signup.onclick = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User is signed in.");
    } else {
      console.log("No user is signed in.");
    }
  });
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
    else if ((!email.includes("@") || (!email.includes(".com" || ".net"))) && (password.length < 6)) {
      bothBad();
      return;
    }
    else if ((!email.includes("@")) || (!email.includes(".com" || ".net"))) {
      badEmail();
      return;
    }
    else if (password.length < 6) {
      badPassword();
      return;
    }
    else {
      createUser(email, password);
    }
  }

}

logout.onclick = () => {
  firebase.auth().signOut().then(function () {
    console.log("Sign-out successful.");
    welcome.innerHTML = "Welcome to Orbit";
    modalBtn.style.display = "inline";
    logout.style.display = "none";
    profile.style.display = "none";
  }).catch(function (error) {
    console.log(error);
  });
}





// Three JS 

function renderObject(url) {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  // create a camera, which defines where we're looking at.
  // create a render and set the size
  var webGLRenderer = new THREE.WebGLRenderer( {alpha: true} );
  webGLRenderer.setClearColor(0x000000, 0);
  webGLRenderer.setSize(600, 400);
  webGLRenderer.shadowMapEnabled = true;
  // position and point the camera to the center of the scene
  camera.position.x = 150;
  camera.position.y = 150;
  camera.position.z = 150;
  camera.lookAt(new THREE.Vector3(0, 40, 0));
  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 100, 100);
  scene.add(spotLight);
  // add the output of the renderer to the html element
  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);
  // call the render function
  var step = 0;
  // setup the control gui
  var group = [];
  var loader = new THREE.STLLoader();
  var group = new THREE.Object3D();
  loader.load(
    url,
    function(geometry) {
      console.log(geometry);
      var mat = new THREE.MeshLambertMaterial({ color: "#FDCA40" });
      group = new THREE.Mesh(geometry, mat);
      group.rotation.x = -0.5 * Math.PI;
      scene.add(group);
    }
  );
  render();
  function render() {
    if (group) {
      group.rotation.z += 0.006;
    }
    // render using requestAnimationFrame
   requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}

