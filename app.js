var config = require('./config/config');
var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var app = express();


app.use(express.static(__dirname + '/public'));


var templating = require('consolidate');
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set(__dirname + '/views', __dirname + ''); // + '/views'

app.use(bodyParser.urlencoded({
  extended: true
}));



var databases = require('./models/databases');

app.get('/', function(req, res) {

  databases.list(function(result) {
    console.log('ce kavo', result);
    res.render('databases/dbList', {data: result});

  });


});


app.listen(config.server.port);
console.log("Сервер работает на порту " + config.server.port + "...")