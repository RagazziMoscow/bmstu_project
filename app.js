var config = require('./config/config');
var chalk = require('chalk');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(express.static(__dirname + '/public'));


/*
var handlebars = require('handlebars'),
    layouts = require('handlebars-layout');

layouts.register(handlebars);


var templating = require('consolidate');
app.engine('hbs', templating.handlebars);
app.engine('ejs', templating.;
app.set('view engine', 'hbs');


app.set(__dirname + '/views', __dirname + ''); // + '/views'

*/
var path = require('path');
// using for ejs
app.engine('ejs', require('ejs-locals'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));


var router = require("./routes")(app);





var port = config.server.port;
app.listen(port);
console.log(chalk.yellow("Сервер работает на порту ") + chalk.red.bold(port) + "...");