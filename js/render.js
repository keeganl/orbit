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
