var auth = require('./auth');
var databases = require('./../models/databases'), // Databases list
  structure = require("./../models/structure"),
  dbschemas = require('./../models/schemas'),
  dbtables = require("./../models/tables"),
  passport = require('passport');


module.exports = function(app) {



  app.get("/", function(req, res) {
    res.redirect("/databases");
  });

  app.get('/databases', function(req, res) {

    databases.list(function(dbList) {

      res.render('databases/list', {
        data: {
          title: "Подключённые БД",
          list: dbList
        }
      });

    });


  });



  app.post("/dbschemas", function(req, res) {

    var schemas = dbschemas(req.body.dbname);
    schemas.list(function(schemasList) {
      //console.log(schemasList);
      res.render("schemas/list", {
        data: {
          title: "Схемы",
          database: req.body.dbname,
          list: schemasList
        }
      });
    });

  });
  /*
    app.get("/dbschemas", function(req, res) {

      var schemas = dbschemas(req.body.dbname);

      schemas.list(function(schemasList) {
        res.render("schemas/list", {
          data: {
            title: "Схемы",
            database: req.body.dbname,
            list: schemasList
          }
        });
      });

    });
  */

  app.post("/tables", function(req, res) {

    dbStruct = structure(req.body.dbname, req.body.schemaname);
    var tables = dbtables;
    dbStruct.checkViewExisting(function(view) {

      if (view) {

        // если представление существует
        // то делаем перенаправление на страницу с выбором полей
        res.redirect("/columns?dbname=" + req.body.dbname +
          "&schemaname=" + req.body.schemaname);
      } else {

        // если представления нет
        tables.list(req.body.dbname,
          req.body.schemaname,
          (tablesInfo) => {
            //console.log(tablesInfo);
            res.render("structure/tables", {
              data: {
                title: "Таблицы",
                database: req.body.dbname,
                schema: req.body.schemaname,
                list: tablesInfo.entities,
                links: tablesInfo.links
              }
            });
          });

      }
    });
    console.log(req.session.searchData);
  });



  /*
    app.get("/tables", function(req, res) {

      var tables = dbtables;
      var database = req.session.searchData.database || null;
      var schema = req.session.searchData.schema || null;
      var searchDataIsSended = database && schema;

      if (searchDataIsSended) {

        dbStruct = structure(database, schema);
        dbStruct.checkViewExisting(function(view) {

          if (view) {

            // если представление существует
            res.redirect("/columns?dbname=" + req.session.searchData.database +
              "&schemaname=" + req.session.searchData.schema);
          } else {

            // если представления нет
            tables.list(req.session.searchData.database,
              req.session.searchData.schema,
              (tables) => {
                res.render("structure/tables", {
                  data: {
                    title: "Таблицы",
                    database: req.session.searchData.database,
                    schema: req.session.searchData.schema,
                    list: tables
                  }
                });
              });

          }
        });

      } else {

        res.render('structure/tables', {
          data: {
            title: "Таблицы"
          }
        });

      }
    });

  */

  app.post("/columns", function(req, res) {

    var table = req.body.tablename;
    var dbStruct = structure(req.body.dbname, req.body.schemaname);

    dbStruct.getView((columns) => {
      //req.session.searchData.viewColumns = columns;
      res.render("structure/columns", {
        data: {
          title: "Структура",
          database: req.body.dbname,
          schema: req.body.schemaname,
          table: table,
          columns: columns
        }
      });

    }, table);

  });

  app.get("/columns", function(req, res) {

    var database = req.param("dbname") || null;
    var schema = req.param("schemaname") || null;

    var searchDataIsSended = database && schema;
    if (searchDataIsSended) {

      var dbStruct = structure(database, schema);
      dbStruct.getView((columns) => {

        // устанавливаем в сессию поля
        //req.session.searchData.viewColumns = columns;
        res.render("structure/columns", {
          data: {
            title: "Структура",
            database: database,
            schema: schema,
            columns: columns
          }
        });
      });

    } else {

      res.render("structure/columns", {
        data: {
          title: "Структура"
        }
      });

    }
  });



  app.post("/bigsearch", function(req, res) {

    var search = require("./../bigsearch");

    // пересечение всех колонок с типами данных с тем, что отметили
    var searchData = search.select(req);
    req.session.viewColumns = searchData;

    res.render("bigsearch/bigsearch", {
      data: {
        title: "Поиск",
        searchData: {
          database: req.body.dbname,
          schema: req.body.schemaname,
          viewColumns: searchData
        }
      }
    });

  });

  app.post("/search-data", function(req, res) {
    /*
        var dbStruct = structure(req.body.dbname, req.body.schemaname);
        dbStruct.getView((columns) => {
          res.json({
            viewColumns: columns
          });
        });
    */
    res.json({
      viewColumns: req.session.viewColumns
    });
  });

  app.post("/query-data", function(req, res) {

    var search = require("./../bigsearch");
    var conditions = req.body.request;

    var searchDataParams = {
      database: JSON.parse(req.body.searchData).database,
      schema: JSON.parse(req.body.searchData).schema
    };

    var columns = JSON.parse(req.body.searchData).viewColumns;
    search.search(conditions, columns, searchDataParams, (searchResults) => {
      res.json({
        data: {
          rows: searchResults
        }
      });

    });

  });

  app.get("/completion", function(req, res) {
    res.render("bigsearch/completion", {
      data: {
        title: "Завершение поиск",
        searchData: {
          database: req.param("dbname"),
          schema: req.param("schemaname")
        }
      }
    });
  });

  app.post("/search-complete", function(req, res) {
    var dbStruct = structure(req.body.dbname, req.body.schemaname);
    // если надо, то удаляем представление
    if (Boolean(Number(req.body.answerValue))) {
      dbStruct.deleteView();
    }
    res.redirect("/databases");
  });

  app.get("/signin", auth.signin);

  app.get("/signup", auth.signup);


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