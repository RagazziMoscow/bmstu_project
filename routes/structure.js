var structure = require("./../models/structure");
var dbtables = require("./../models/tables");

module.exports.tablesList = function(req, res) {

  dbStruct = structure(req.body.dbname, req.body.schemaname);
  var tables = dbtables;
  dbStruct.checkViewExisting(function(view) {

    if (view) {

      // если представление существует
      // то удаляем его


      /*
      // то делаем перенаправление на страницу с выбором полей
      res.redirect("/columns?dbname=" + req.body.dbname +
        "&schemaname=" + req.body.schemaname);

      */
      dbStruct.deleteView(function() {

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

      });


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
  //console.log(req.session.searchData);
};

module.exports.createView = function(req, res) {

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

};

/*
module.exports.loadView = function(req, res) {

  var database = req.query.dbname || null;
  var schema = req.query.schemaname || null;

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
};

*/