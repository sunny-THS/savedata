const express = require('express');
const bodyParser = require('body-parser');
const monk = require('monk');
// const scrapes = require('./scrapes');

const app = express();
const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://admin:sv15853456@urldata.sukig.mongodb.net/URLData?retryWrites=true&w=majority';
const db = monk(uri);
const data = db.get('creators');
data.options.castIds = false;
// data.remove();

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
app.post('/upload', (req, res) => {
  console.log(req.body);
  data.insert(req.body);
  res.send(req.body);
});


app.listen(port, () => console.log(`Example app listening on port ${port}`));
