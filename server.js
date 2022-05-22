const express = require('express')


const path = require('path');
require("dotenv/config");
const expressPort = 3000

const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join('views'));
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

app.use(express.static('./views'));


// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({extended: true})); 

app.use('/uploads', express.static('uploads'))
// define port for API to run on
const port = process.env.PORT || expressPort
const md5_pass_crack = require('./routes/md5_pass_crack')

app.use('/',md5_pass_crack);
app.use('/api/upload',md5_pass_crack);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app