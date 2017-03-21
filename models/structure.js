var config = require("./../config/config");
var async = require('async');
var ifAsync = require('if-async');
var pg = require("pg");
var pgFunctionsModule = require("./db-structure-functions");

var structure = function(dbname, schemaname) {


  var localConfig = {
    database: dbname, //env var: PGDATABASE
    user: config.database.user, //env var: PGUSER
    password: config.database.password, //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432 //env var: PGPORT
  };

  var interface = {


    getView: function(callback) {

        var returnView = callback; // коллбек для отдачи представления

        //var viewColumns = []; // колонки представления



        async.waterfall([
            getViewColumnsCount,
            ifAsync(checkColumnsCount).
            then(createView).
            else(getColumnsFromQueryResult)
          ],
          function(err, result) {

            // отдаём представление
            returnView(result);
          });



      },

      deleteView: function() {
        var query = "set search_path to " + schemaname + ";\ndrop view all_join;"
        var client = new pg.Client(localConfig);
        client.connect(function(err) {
          if (err) throw err;
          client.query(query, function(err, result) {
            if (err) throw err;

            client.end(function(err) {
              if (err) throw err;
            });
            //console.log(result);

          });
        });

      },

      getViewColumns: function() {

        //console.log('ce kavo');

        /*
                var query = "select column_name from information_schema.columns\n" +
                  "where table_name = 'all_join';"
                //console.log(localConfig);
                var result = {};

                var client = new pg.Client(localConfig);
                client.connect(function(err) {
                  if (err) throw err;
                  client.query(query, function(err, result) {
                    if (err) throw err;

                    client.end(function(err) {
                      if (err) throw err;
                    });
                    console.log(result.rows);

                  });
                });
        */
        //console.log(pgFunctionsModule())


      }
  }

  return interface;

  function getViewColumnsCount(callback) {

    // получаем количество колонок представления
    // оно либо не равно нулю, и тогда представление существует
    // либо равно нулю, тогда создаём представление
    var client = new pg.Client(localConfig);
    var query = "select column_name from information_schema.columns\n" +
      "where table_name = 'all_join';";

    // подключение
    client.connect(function(err) {
      if (err) throw err;

      //console.log("Запрос колонок");
      // выполняем запрос колонок
      client.query(query, function(err, columnsResult) {
        if (err) throw err;

        client.end(function(err) {
          if (err) throw err;
          //console.log("Запрос выполнен", columnsResult);
        });

        callback(null, columnsResult);

      });


    });
  }

  function checkColumnsCount(columnsResult, callback) {

    // представление не создано, колонок нет
    callback(null, (columnsResult.rowCount == 0));


  }

  function createView(columnsResult, callback) {

    // если представления ещё нет
    var query = pgFunctionsModule(localConfig.database, schemaname).
    queryForView()
      .then((result) => {

        var viewColumns = [];
        viewColumns = result.columns;
        //console.log("Созданные колонки", viewColumns);


        var client = new pg.Client(localConfig);
        client.connect(function(err) {
          if (err) throw err;
          client.query(result.query, function(err, createResult) {
            if (err) throw err;

            // disconnect the client
            client.end(function(err) {
              if (err) throw err;
            });

            //console.log(createResult);

          });

        });

        return (viewColumns);

      })
      .then((columns) => {

        // отдаём представление с колонками представления
        callback(null, columns);
      });
  }

  function getColumnsFromQueryResult(columnsResult, callback) {

    // когда представление уже существует
    // выбираем коллонки из запроса для представления
    var viewColumns = [];
    columnsResult.rows.forEach((item) => {
      viewColumns.push(item.column_name);
    });


    // отдаём представление с колонками представленя
    callback(null, viewColumns);
  }
}



module.exports = structure;