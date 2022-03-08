const urlFetch = 'http://localhost:5002';

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

// async function getFiles() {
//   return await fetch(`${urlFetch}/data`)
//     .then(res => {
//       if(res.ok)
//         return res.json();
//       return res.json().then(err => {
//         throw new Error(err.message);
//       })
//     }).then(data => {
//       return data;
//       // get files
//     }).catch(err => {
//       console.log(err);
//       return null;
//     });
// }

// async function ShowData() {
//   await getFiles().then(item => {
//     item.forEach((data, i) => {
//       const ctr = document.querySelector('.container');
//       const card = newEl('div', { class: 'card' });
//       var el;
//       if (data.type == "image/png" || data.type == "image/jpeg") {
//         el = newEl('img', {
//           src: data.link,
//           width: '300px',
//           onclick: `window.open('${data.link}', '_blank');`,
//           alt: data.name,
//           title: `${data.name}`
//         });
//       } else {
//         el = newEl('span', {
//           innerText: data.name,
//           onclick: `location.href = '${data.link}';`,
//           title: `${data.name}`
//         });
//       }
//       card.appendChild(el);
//       ctr.appendChild(card);
//       ctr.scrollTop = ctr.scrollHeight;
//     });
//   });
// }
// ShowData()
document.querySelector('.submit_').addEventListener('click', function(e) {
  const inputFile = document.querySelector('.inputfile');
  const files = inputFile.files;
  uploadFile(files);
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
  await fetch(`${urlFetch}/storage/uploadFile`, option)
    .then(res => {
      if(res.ok)
        return res.json();
      return res.json().then(err => {
        throw new Error(err.message);
      })
    }).then(data => {
      console.log(data);
      // File uploaded successfully
    }).catch(err => console.log(err))
}
