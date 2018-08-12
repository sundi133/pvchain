var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

//Require the Router we defined in blocks.js
var blocks = require('./ws_blocks.js');

//Use the Router on the sub route /blocks
app.use('/block', blocks);

app.get('/', function(req, res){
   res.send("PV Blockchain Server is Up !");
});


app.listen(8000);