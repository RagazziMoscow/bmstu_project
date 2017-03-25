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

    // очищаем сессию
    req.session.searchData = null;
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

  app.get("/dbschemas", function(req, res) {
    var schemas = require("./../models/schemas")(req.session.searchData.database);
    schemas.list(function(schemasList) {
      res.render("schemas/dbschemaslist", {
        data: {
          title: "Схемы",
          database: req.session.searchData.database,
          list: schemasList
        }
      });
    });
  });

  app.post("/tables", function(req, res) {

    var tables = require("./../models/tables");
    tables.list(req.body.dbname, req.body.schemaname, (tables)=> {
      res.render("structure/tables", {
        data: {
          title: "Таблицы",
          database: req.body.dbname,
          schema: req.body.schemaname,
          list: tables
        }
      });
    });
  });



  app.post("/structure", function(req, res) {

    var dbStruct = structure(req.body.dbname, req.body.schemaname);

    if (req.session.searchData) console.log(req.session.searchData);

    dbStruct.getView((columns) => {

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
    console.log(req.session.searchData);
    res.render("bigsearch/bigsearch", {
      data: {
        title: "Поиск",
        searchData: req.session.searchData
      }
    });
  });

  app.post("/search-data", function(req, res) {
    res.json(req.session.searchData);
  });

  app.post("/query-data", function(req, res) {
    var search = require("./../models/search");
    console.log(search.getSQL(req.request));
    res.send("cekavo");
  });

  app.get("/completion", function(req, res) {
    res.render("bigsearch/completion", {
      data: {
        title: "Завершение поиск",
        searchData: req.session.searchData
      }
    });
  });

  app.post("/search-complete", function(req, res) {
    //console.log("Завершение поиска");
    //console.log(Boolean(Number(req.body.answerValue)));

    var dbStruct = structure(req.body.dbname, req.body.schemaname);

    // если надо, то удаляем представление
    if (Boolean(Number(req.body.answerValue))) {
      dbStruct.deleteView();
    }
    req.session.searchData = null;

    res.redirect("/databases");
  });

  app.get("/logout", function(req, res) {
    res.status(200).send("logout");
  });

  app.get("/cekavo", function(req, res) {
    res.status(200).send("1312 чё каво");
  });

  app.get('*', function(req, res) {
    res.status(404).send("Sorry cant find that!");
  });

}