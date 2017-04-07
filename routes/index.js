var databases = require('./../models/databases'), // Databases list
  structure = require("./../models/structure"),
  dbschemas = require('./../models/schemas'),
  dbtables = require("./../models/tables");


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

    // очищаем сессию
    req.session.searchData = {};

    // устанавливаем в сессию базу данных
    req.session.searchData.database = req.body.dbname;
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

  app.get("/dbschemas", function(req, res) {

    var schemas = dbschemas(req.session.searchData.database);
    schemas.list(function(schemasList) {
      res.render("schemas/list", {
        data: {
          title: "Схемы",
          database: req.session.searchData.database,
          list: schemasList
        }
      });
    });
  });


  app.post("/tables", function(req, res) {

    // устанавливаем в сессию схему
    req.session.searchData.schema = req.body.schemaname;
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
        tables.list(req.session.searchData.database,
          req.session.searchData.schema,
          (tablesInfo) => {
            console.log(tablesInfo);
            res.render("structure/tables", {
              data: {
                title: "Таблицы",
                database: req.session.searchData.database,
                schema: req.session.searchData.schema,
                list: tablesInfo.entities,
                links: tablesInfo.links
              }
            });
          });

      }
    });
  });

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



  app.post("/columns", function(req, res) {

    var table = req.body.tablename;
    var dbStruct = structure(req.body.dbname, req.body.schemaname);
    dbStruct.getView((columns) => {

      req.session.searchData.viewColumns = columns;
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
    //console.log(req.session.searchData.database);

    var database = req.param("dbname") || req.session.searchData.database || null;
    var schema = req.param("schemaname") || req.session.searchData.schema || null;

    var searchDataIsSended = database && schema;
    if (searchDataIsSended) {

      var dbStruct = structure(database, schema);
      dbStruct.getView((columns) => {

        // устанавливаем в сессию поля
        req.session.searchDataюviewColumns = columns;
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



  app.get("/bigsearch", function(req, res) {

    //console.log(req.session.searchData);
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

    var dbStruct = structure(req.body.dbname, req.body.schemaname);

    // если надо, то удаляем представление
    if (Boolean(Number(req.body.answerValue))) {
      dbStruct.deleteView();
    }
    // очищаем сессию
    req.session.searchData.schema = null;
    req.session.searchData.table = null;
    req.session.viewColumns = null;

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