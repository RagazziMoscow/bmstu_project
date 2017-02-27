var config = require('./config/config');
var express = require('express');
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


var databases = require('./models/databases'); // Databases list


app.get("/", function(req, res) {
  res.redirect("/databases");
});

app.get('/databases', function(req, res) {

  databases.list(function(dbList) {
    //console.log('ce kavo', result);
    res.render('databases/dbList', {
      data: dbList
    });

  });


});

app.post("/dbschema", function(req, res) {
  //console.log(req.body.dbname);
  res.render("schema/dbschema", {
    data: req.body.dbname
  });
});



app.listen(config.server.port);
console.log("Сервер работает на порту " + config.server.port + "...")