var path = require('path'),
  databases = require('./../models/databases'), // Databases list
  structure = require("./../models/structure");


module.exports = function(app) {



  app.get("/", function(req, res) {
    res.redirect("/databases");
  });

  app.get('/databases', function(req, res) {

    databases.list(function(dbList) {
      //console.log('ce kavo', dbList);
      //for(var i = 0; i<dbList)
      res.render('databases/dbList', {
        data: {
          title: "Подключённые БД",
          list: dbList
        }
      });

    });


  });



  app.post("/dbschemas", function(req, res) {

    //console.log(req.body.dbname);
    //req.session.db = req.body.dbname;
    var schemas = require('./../models/schemas')(req.body.dbname);
    schemas.list(function(schemasList) {
      //console.log(schemasList);
      res.render("schemas/dbschemaslist", {
        data: {
          title: "Схемы",
          database: req.body.dbname,
          list: schemasList
        }
      });
    });

  });



  app.post("/structure", function(req, res) {
    var dbStruct = structure(req.body.dbname, req.body.schemaname);
    //console.log(req.session.db);
    //dbStruct.deleteView();

    if (req.session.searchData) console.log(req.session.searchData);

    dbStruct.createView((columns) => {

      //console.log(columns);
      req.session.searchData = {
        database: req.body.dbname,
        schema: req.body.schemaname,
        viewColumns: columns
      };

      res.render("structure/dbstructure", {
        data: {
          title: "Структура",
          database: req.body.dbname,
          schema: req.body.schemaname,
          columns: columns
        }
      });
    });

  });

  app.get("/bigsearch", function(req, res) {
    res.render("bigsearch/bigsearch", {
      data: {
        title: "Поиск"
      }
    });
  });

  app.get("/cekavo", function(req, res) {
    res.status(200).send("1312 чё каво");
  });

  app.get('*', function(req, res) {
    res.status(404).send("Sorry cant find that!");
  });

}