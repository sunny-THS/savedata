document.querySelector('.btnToggle').addEventListener('click', (e) => {
  const textBtn = document.querySelector('.btnToggle').value;
  const btnToggle = document.querySelector('.btnToggle');

  if (textBtn=='Data') {
    ShowData();
    btnToggle.value = 'Upload Data';
    document.querySelector('.uploadData').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
  }
  else {
    btnToggle.value = 'Data';
    document.querySelector('.uploadData').style.display = 'block';
    document.querySelector('.container').style.display = 'none';
  }
})
