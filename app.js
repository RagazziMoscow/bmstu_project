var config = require('./config/config');
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

// using for ejs
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));


var databases = require('./models/databases'); // Databases list


app.get("/", function(req, res) {
  res.redirect("/databases");
});

app.get('/databases', function(req, res) {

  databases.list(function(dbList) {
    //console.log('ce kavo', dbList);
    //for(var i = 0; i<dbList)
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