function SendData() {
  const file = document.querySelector('#f');
  const Files = file.files;
  var r = new FileReader();
  r.onload = function () {
    const setupFile = {
      name: Files[0].name,
      type: Files[0].type,
      url_data: r.result
    }
    fetch('../upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(setupFile)
    }).then(res => res.json())
      .then(data =>
        {
          ShowData(data);
          const ctr = document.querySelector('.container');
          ctr.scrollTop = ctr.scrollHeight;
        });
  }
  r.readAsDataURL(Files[0]); // set url data
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
  console.log(val.type);
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
}
async function loadData() {
  const res = await fetch('../data');
  const data = await res.json();
  console.log(data);

  data.forEach(data_ => {
    ShowData(data_);
  });
  return data;
}
loadData();
