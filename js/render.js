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
var sidebar = document.querySelector(".sidebar")
var main = document.querySelector(".main");
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
      console.log(url);
    })
    .catch(console.error);
  var div = document.createElement("div");
  var title = document.createElement("p");
  var body = document.createTextNode(name + metadata.contentType);
  title.appendChild(body);
  div.appendChild(title);
  div.classList.add("item");

  var fileTag = document.querySelector("#titletag");
  fileTag.appendChild(div);
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

var submitForm = document.getElementById("submit");
submitForm.onclick = () => {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  if (email == " " || password == "") {
    var errorCon = document.createElement("h1")
    var errorMsg = document.createTextNode("Hey you forgot some information! 😯");
    errorCon.appendChild(errorMsg);
    errorCon.classList.add("fadein");
    var form = document.getElementById("form");
    var emailRef = document.getElementById("email");
    var passwordRef = document.getElementById("password");
    form.append(errorCon);
    emailRef.classList.add("wrong");
    passwordRef.classList.add("wrong");
    return;    
  }
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}


