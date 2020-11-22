const express = require('express');
const bodyParser = require('body-parser');
const monk = require('monk');
const fileUpload = require('express-fileupload')
var http = require('http');
if (process.env.NODE_ENV !== 'production')
  require('dotenv').config()

const app = express();
const server = http.createServer(app)
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const uri = process.env.MONGOURI;
const db = monk(uri);
const uploadFile = db.get('uploadFile');
// uploadFile.remove();
server.listen(port, () => console.log(`Example app listening on port ${port}`));

app.use(express.static('client'));
app.use(fileUpload())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*'); // disabled for security local
  res.header("Access-Control-Allow-Headers", 'Content-Type');
  next();
});

app.get('/data', (req, res) => {
  uploadFile
  .find()
  .then(data => {
    res.send(data);
  });
})

app.post('/upload', (req, res) => {
  res.redirect('/');
});

io.on('connection', (socket) => {
  socket.on('ClientRemoveData', (data_) => {
    io.sockets.emit('ServerRemoveData', data_);
  });

  socket.on('ClientSendData', (data_ofClient) => {
    var is_duplicate = false;
    uploadFile
    .find()
    .then(data => {
      data.forEach(item => {
        if (item.name == data_ofClient.name) {
          is_duplicate = true;
        }
      });
      if (!is_duplicate) {
        uploadFile.insert(data_ofClient)
          .then(() => {
            // cap nhap lai du lieu
            uploadFile
            .find()
            .then(data => {
              io.sockets.emit('data', data);
            });
          })
          .catch(err => console.log(err));
      }else {
        uploadFile.update({name : data_ofClient.name}, {$set : data_ofClient})
          .then(() => {
            // cap nhap lai du lieu
            uploadFile
            .find()
            .then(data => {
              io.sockets.emit('data', data);
            });
          });
      }
    });
  });

  uploadFile
  .find()
  .then(data => {
    socket.emit('data', data);
  });
});
