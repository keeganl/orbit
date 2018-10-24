// Initialize Firebase
var config = {
  apiKey: "AIzaSyACD0KmxIdl70FeFtVXG1hIKMkL-N1uIEc",
  authDomain: "orbit-343b4.firebaseapp.com",
  databaseURL: "https://orbit-343b4.firebaseio.com",
  projectId: "orbit-343b4",
  storageBucket: "orbit-343b4.appspot.com",
  messagingSenderId: "952406705209"
};

firebase.initializeApp(config);

var drawerbtn = document.querySelector(".drawerbtn");
var sidebar = document.querySelector(".sidebar")
var main = document.querySelector(".main");

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

var fileIO = document.getElementById("files");

fileIO.onchange = () => {
  const ref = firebase.storage().ref();
  const file = document.querySelector("#input").files[0];
  const name = (+new Date()) + "-" + file.name;
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
}



