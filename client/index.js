// with ES6 import
const socket = io();
socket.on('data', (res) => {
  var ctr = document.querySelector('.container');
  while (ctr.hasChildNodes()) {
      ctr.removeChild(ctr.firstChild);
  }
  console.log(res);
  res.forEach(data => {
    ShowData(data);
  });
});
socket.on('ServerSendData', (res) => {
  ShowData(JSON.parse(res));
});

function SendData(files) {
  var counter = -1, file;
  const date = new Date(Date.now());
  while (file = files[++counter]) {
    const lastModifiedDate_ = new Date(file.lastModified);
    var reader = new FileReader();
    reader.onloadend = (function(file) {
      return function() {
        const setupFile = {
          name: file.name,
          type: file.type,
          date: date.toLocaleString('en-GB'),
          lastModifiedDate: lastModifiedDate_.toLocaleString('en-GB'),
          url_data: this.result
        }
        console.log(setupFile.url_data);
        socket.emit('ClientSendData', JSON.stringify(setupFile));
      }
    })(file);
    reader.readAsDataURL(file);
  }
}

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
  var url;
  if (val.type == "image/png" || val.type == "image/jpeg") {
    url = newEl('img', {
      src: val.url_data,
      width: '300px'
    });
  } else {
    url = newEl('a', {
      href: val.url_data,
      innerText: val.name,
      target: '_blank',
      download: val.name,
    });
  }
  card.appendChild(url);
  ctr.appendChild(card);
  ctr.scrollTop = ctr.scrollHeight;
}


var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function(input) {
  var label = input.nextElementSibling,
    labelVal = label.innerHTML;

  input.addEventListener('change', function(e) {
    const bol = confirm("Do you save your files?");
    if (bol) {
      console.log('success');
      SendData(this.files);
    } else {
      console.log('exit');
    }
    e.target.value = '';

    var fileName = '';
    if (this.files && this.files.length > 1)
      fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
    else
      fileName = e.target.value.split('\\').pop();

    if (fileName)
      label.querySelector('span').innerHTML = fileName;
    else
      label.innerHTML = labelVal;
  });
});
