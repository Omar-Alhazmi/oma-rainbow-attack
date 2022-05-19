const express = require('express')
const  md5_pass_crack = require('./routes/md5_pass_crack');


const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
require("dotenv/config");
const reactPort =  3000
const expressPort = 5000


const app = express()
app.use(bodyParser.json())

// this parses requests sent by `$.ajax`, which use a different content type
app.use(bodyParser.urlencoded({ extended: true }))


app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${reactPort}`}))
app.use('/uploads',express.static('uploads'))
// define port for API to run on
const port = process.env.PORT || expressPort

app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
  });

  app.use(md5_pass_crack);
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'), function(err) {
      if (err) {
        res.status(404).send("We think you are lost!");
      }
    })
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 

module.exports = app