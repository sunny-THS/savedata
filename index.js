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
  data
    .find()
    .then(creator => {
      res.send(creator); // get from db
    })
})



io.on('connection', (socket) => {
  socket.on('ClientRemoveData', (data_) => {
    data.remove();
    io.sockets.emit('ServerRemoveData', data_);
  });

  uploadFile
  .find()
  .then(creator => {
    socket.emit('data', creator);
  });

  app.post('/upload', (req, res) => {
    var data;
    const file_ = req.files.file;
    const date = new Date(Date.now());
    if (file_.length === undefined) {
      data = {
        name: file_.name,
        type: file_.mimetype,
        date: date.toLocaleString('en-GB'),
        url_data: `data:${file_.mimetype};base64,${file_.data.toString('base64')}`
      }
    }else {
      file_.forEach(file => {
        data = {
          name: file.name,
          type: file.mimetype,
          date: date.toLocaleString('en-GB'),
          url_data: `data:${file.mimetype};base64,${file.data.toString('base64')}`
        }
      });
    }
    uploadFile.insert(data)
      .then(res => {
        io.sockets.emit('ServerSendData', res);
      })
      .catch(err => console.log(err));
    socket.broadcast.emit('alert', 'success');
    res.redirect('/');
  });
});
