const socket = io();

socket.on('data', (res) => {
  var ctr = document.querySelector('.container');
  while (ctr.hasChildNodes()) {
    ctr.removeChild(ctr.firstChild);
  }
  res.forEach(data => {
    ShowData(data);
  });
  document.querySelector('.submit_').disabled = true;
  document.querySelector('form').reset();
  document.querySelector('#filename').textContent = 'Choose a file...'
});
var name_File = [];
var firebaseConfig = {
  apiKey: "AIzaSyCxT1kJldnxGzhC9JTYpdnTKSs-VcZjJEQ",
  authDomain: "savedata-sd.firebaseapp.com",
  projectId: "savedata-sd",
  storageBucket: "savedata-sd.appspot.com",
  messagingSenderId: "414583324682",
  appId: "1:414583324682:web:d5cec1814d4d5c663c5ff3",
  measurementId: "G-RD0CTDVY9R"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

document.addEventListener("DOMContentLoaded", event => {
  var app = firebase.app();
});

function newEl(type, attrs = {}) {
  const el = document.createElement(type);
  for (let attr in attrs) {
    const val = attrs[attr];
    if (attr == 'innerText') el.innerText = val;
    else el.setAttribute(attr, val);
  }
  return el;
}

function ShowData(val) {
  const ctr = document.querySelector('.container');
  const card = newEl('div', {
    class: 'card'
  });
  var el;
  if (val.type == "image/png" || val.type == "image/jpeg") {
    el = newEl('img', {
      src: val.url_data,
      width: '300px',
      onclick: `window.open('${val.url_data}', '_blank');`,
      alt: val.name
    });
  } else {
    el = newEl('span', {
      innerText: val.name,
      onclick: `openFile(this.textContent, '${val.url_data}');`
    });
  }
  card.appendChild(el);
  ctr.appendChild(card);
  ctr.scrollTop = ctr.scrollHeight;
}

document.querySelector('.submit_').addEventListener('click', function(e) {
  const inputFile = document.querySelector('.inputfile');
  const files = inputFile.files;
  uploadFile(files);
});

function uploadFile(files) {
  var titlePage = document.querySelector('title');
  const date = new Date(Date.now());

  Array.prototype.forEach.call(files, function(file) {
    const nameFile = file.name;
    const Itemfile = file;
    const storageRef = firebase.storage().ref();
    const filesRef = storageRef.child(nameFile).put(Itemfile);

    filesRef.on('state_changed', snapshot => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      titlePage.textContent = `Upload is ${progress}% done`;
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          titlePage.textContent = 'Upload is paused';
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, error => {
      // Handle unsuccessful uploads
      console.error(error);
    }, () => {
      // Handle successful uploads on complete
      titlePage.textContent = 'Save data';
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      filesRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
        const setupFile = {
          name: file.name,
          type: file.type == "" ? 'application/octet-stream' : file.type,
          date: date.toLocaleString('en-GB'),
          url_data: downloadURL
        }
        socket.emit('ClientSendData', setupFile);
      });
    });
  });
}
