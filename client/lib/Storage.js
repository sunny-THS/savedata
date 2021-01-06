const socket = io();

socket.on('ServerSendResFind', (res) => {
  let ctr = document.querySelector('.container');
  while (ctr.hasChildNodes()) {
    ctr.removeChild(ctr.firstChild);
  }
  res.forEach(data => {
    ShowData(data);
  });
});

socket.on('data', (res) => {
  let ctr = document.querySelector('.container');
  let fol = document.querySelector('#folders');
  while (fol.hasChildNodes()) {
    fol.removeChild(fol.firstChild);
  }
  while (ctr.hasChildNodes()) {
    ctr.removeChild(ctr.firstChild);
  }
  res.forEach(data => {
    ShowData(data);
  });
  res.distinct(obj=>obj.folder).forEach(data => {
    if (data.folder != 'root')
      ListFolders(data.folder);
  });
  document.querySelector('.submit_').disabled = true;
  document.querySelector('form').reset();
  document.querySelector('#filename').textContent = 'Choose a file...'
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
function ListFolders(val) {
  const folders = document.querySelector('#folders');
  const folder = newEl('option', { value: `${val}` });
  folders.appendChild(folder);
}
function ShowData(val) {
  const ctr = document.querySelector('.container');
  const card = newEl('div', { class: 'card' });
  var el;
  if (val.type == "image/png" || val.type == "image/jpeg") {
    el = newEl('img', {
      src: val.url_data,
      width: '300px',
      onclick: `window.open('${val.url_data}', '_blank');`,
      alt: val.name,
      title: val.name
    });
  } else {
    el = newEl('span', {
      innerText: val.name,
      onclick: `location.href = '${val.url_data}';`
    });
  }
  card.appendChild(el);
  ctr.appendChild(card);
  ctr.scrollTop = ctr.scrollHeight;
}

document.querySelector('.submit_').addEventListener('click', function(e) {
  const inputFile = document.querySelector('.inputfile');
  const files = inputFile.files;
  let p = prompt('Hãy nhập mật khẩu', '');
  if (p == 'adminsavedata')
    uploadFile(files);
  else alert('Mật Khẩu Không Chính Xác\nXin Mời Nhập Lại');
});

function uploadFile(files) {
  var titlePage = document.querySelector('title');
  const date = new Date(Date.now()); // get datetime now
  const username = prompt('Xin mời nhập tên','');

  Array.prototype.forEach.call(files, function(file) {
    const nameFile = file.name;
    const Itemfile = file;
    const storageRef = firebase.storage().ref();
    const filesRef = storageRef.child(`${username}/${nameFile}`).put(Itemfile);

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
      alert(error);
    }, () => {
      // Handle successful uploads on complete
      titlePage.textContent = 'Save data';
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      filesRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
        const setupFile = {
          name: file.name,
          type: file.type == '' ? 'application/octet-stream' : file.type,
          date: date.toLocaleString('en-GB'),
          folder: username == '' ? 'root' : username,
          url_data: downloadURL
        }
        socket.emit('ClientSendData', setupFile);
      });
    });
  });
}
