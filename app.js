var config = require('./config/config');
var chalk = require('chalk');
var express = require('express');

var app = express();




var middleware = require('./middleware')(app, express);
var auth = require("./middleware/auth")(app);
var router = require("./routes")(app);





var port = config.server.port;
app.listen(port);
console.log(chalk.yellow("Сервер работает на порту ") + chalk.red.bold(port) + "...");