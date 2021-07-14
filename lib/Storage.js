// https://storage-data.herokuapp.com
const urlFetch = 'https://storage-data.herokuapp.com';
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

function newEl(type, attrs = {}) {
  const el = document.createElement(type);
  for (let attr in attrs) {
    const val = attrs[attr];
    if (attr == 'innerText') el.innerText = val;
    else el.setAttribute(attr, val);
  }
  return el;
}
// function ListFolders(val) {
//   const folders = document.querySelector('#folders');
//   const folder = newEl('option', { value: `${val}` });
//   folders.appendChild(folder);
// }

async function getFiles() {
  return await fetch(`${urlFetch}/data`)
    .then(res => {
      if(res.ok)
        return res.json();
      return res.json().then(err => {
        throw new Error(err.message);
      })
    }).then(data => {
      return data;
      // get files
    }).catch(err => {
      console.log(err);
      return null;
    });
}

async function ShowData() {
  const ctr = document.querySelector('.container');
  while (ctr.firstChild)
    ctr.removeChild(ctr.lastChild);

  await getFiles().then(item => {
    item.forEach((data, i) => {
      const card = newEl('div', { class: 'card' });
      var el;
      if (data.type == "image/png" || data.type == "image/jpeg") {
        el = newEl('img', {
          src: data.link,
          width: '300px',
          onclick: `window.open('${data.link}', '_blank');`,
          alt: data.name,
          title: `${data.name}`
        });
      } else {
        el = newEl('span', {
          innerText: data.name,
          onclick: `location.href = '${data.link}';`,
          title: `${data.name}`
        });
      }
      card.appendChild(el);
      ctr.appendChild(card);
      // ctr.scrollTop = ctr.scrollHeight;
    });
  });
}
document.querySelector('.submit_').addEventListener('click', function(e) {
  const inputFile = document.querySelector('.inputfile');
  const files = inputFile.files;
  document.querySelector('.uploadData').style.display = 'none';
  document.querySelector('.loading').style.display = 'block';
  document.querySelector('.btnToggle').disabled = true;
  uploadFile(files);
  inputFile.value = null;
  document.querySelector('#filename').innerText = 'Choose a file...';
  document.querySelector('.submit_').disabled = true;
});

async function uploadFile(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('file', file);
  }
  const option = {
    method: 'post',
    body: formData
  }
  await fetch(`${urlFetch}/data/upload`, option)
    .then(res => {
      if(res.ok)
        return res.json();
      return res.json().then(err => {
        Toast.fire({
          icon: 'error',
          title: err.message
        });
      })
    }).then(data => {
      document.querySelector('.uploadData').style.display = 'block';
      document.querySelector('.loading').style.display = 'none';
      document.querySelector('.btnToggle').disabled = false;
      Toast.fire({
        icon: 'success',
        title: data.message
      })
    }).catch(err => {
      Toast.fire({
        icon: 'error',
        title: err.message
      });
    })
}
