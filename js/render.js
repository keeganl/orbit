// Initialize Firebase
var config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID
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


