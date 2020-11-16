// with ES6 import
const socket = io();
socket.on('data', (res) => {
  console.log(res);
  res.forEach(data => {
    ShowData(data);
  });
});
socket.on('ServerSendData', (res) => {
  ShowData(JSON.parse(res));
});
socket.on('ServerRemoveData', (res) => {
  var ctr = document.querySelector('.container');
  while (ctr.hasChildNodes()) {
      ctr.removeChild(ctr.firstChild);
  }
});
function SendData() {
  const file = document.querySelector('#f');
  const Files = file.files;
  for (var i = 0; i < Files.length; i++) {
    const url = URL.createObjectURL(Files[i])
    const setupFile = {
      name: Files[i].name,
      type: Files[i].type,
      url_data: url
    }
    socket.emit('ClientSendData', JSON.stringify(setupFile));
  }
}
function RemoveDataAll() {
  socket.emit('ClientRemoveData', '');
}
function newEl(type, attrs={}) {
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
  const card = newEl('div', {class: 'card'});
  var url;
  if (val.type == "image/png" || val.type == "image/jpeg") {
    url = newEl('img', {
      src: val.url_data,
      width: '300px'
    });
  }else {
    url = newEl('a', {
      href: val.url_data,
      innerText: val.name,
      target: '_blank'
    });
  }
  card.appendChild(url);
  ctr.appendChild(card);
  ctr.scrollTop = ctr.scrollHeight;
}
