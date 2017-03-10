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
app.set('views', path.join(__dirname, 'views'));
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



app.post("/dbschemas", function(req, res) {

  //console.log(req.body.dbname);
  var schemas = require('./models/schemas')(req.body.dbname);
  schemas.list(function(schemasList) {
    console.log(schemasList);
    res.render("schemas/dbschemaslist", {
      data: {
        database: req.body.dbname,
        list: schemasList
      }
    });
  });

});

var structure = require("./models/structure");

app.post("/structure", function(req, res) {



  //console.log(structure(dbProp.database, dbProp.schema).queryForView());
  structure(req.body.dbname, req.body.schemaname).createView();
  res.render("structure/dbstructure", {
    data: {
      database: req.body.dbname,
      schema: req.body.schemaname
    }
  });
});


var port = config.server.port;
app.listen(port);
console.log(chalk.yellow("Сервер работает на порту ") + chalk.red.bold(port) + "...");