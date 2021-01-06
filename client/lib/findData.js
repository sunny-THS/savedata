document.querySelector('#findButton').addEventListener('click', function (e) {
  document.querySelector('.findData').style.display = 'block';
  document.querySelector('.BlurData').style.filter = 'blur(4px)';
  document.querySelector('.BlurData').style.pointerEvents = 'none';
});
document.querySelector('#closeFind').addEventListener('click', function (e) {
  document.querySelector('.findData').style.display = 'none';
  document.querySelector('.BlurData').style.filter = 'blur(0px)';
  document.querySelector('.BlurData').style.pointerEvents = 'auto';
});
document.querySelector('#bf').addEventListener('click', function (e) {
  const folder = document.querySelector('#folder');
  socket.emit('ClientFindData', folder.value);
  document.querySelector('.findData').style.display = 'none';
  document.querySelector('.BlurData').style.filter = 'blur(0px)';
  document.querySelector('.BlurData').style.pointerEvents = 'auto';
});
