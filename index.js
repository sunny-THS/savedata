const express = require('express');
const bodyParser = require('body-parser');
const monk = require('monk');
var http = require('http');
// const scrapes = require('./scrapes');
if (process.env.NODE_ENV !== 'production')
  require('dotenv').config()

const app = express();
const server = http.createServer(app)
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const uri = process.env.MONGOURI;
const db = monk(uri);
const data = db.get('creators');
data.options.castIds = false;
// data.remove();
server.listen(port, () => console.log(`Example app listening on port ${port}`));

app.use(express.static('client'));
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
  socket.on('ClientSendData', (data_) => {
    console.log(data_);
    data.insert(JSON.parse(data_));
    io.sockets.emit('ServerSendData', data_);
  });
  socket.on('ClientRemoveData', (data_) => {
    data.remove();
    io.sockets.emit('ServerRemoveData', data_);
  });

  data
  .find()
  .then(creator => {
    socket.emit('data', creator);
  });
});
