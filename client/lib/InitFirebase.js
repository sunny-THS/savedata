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
  if (!localStorage.username) {
    localStorage.username = prompt('Xin mời nhập tên','');
  }
  if (!sessionStorage.pw) {
    var pw;
    do {
      pw = prompt('Hãy nhập mật khẩu', '');
      if (pw != 'adminsavedata') {
        alert('Mật Khẩu Không Chính Xác');
        if (!confirm('Bạn Muốn Tiếp Tục Đăng Nhập?')) break;
      }
    } while (pw != 'adminsavedata');
    sessionStorage.pw = pw;
  }
});
