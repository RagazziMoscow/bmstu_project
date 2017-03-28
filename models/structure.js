var config = require("./../config/config");
var async = require('async');
var ifAsync = require('if-async');
var pg = require("pg");
var pgStructureFunc = require("./db-structure-functions");


var MAIN_TABLE = "";

var structure = function(dbname, schemaname) {


  var localConfig = {
    database: dbname, //env var: PGDATABASE
    user: config.database.user, //env var: PGUSER
    password: config.database.password, //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: config.database.port //env var: PGPORT
  };



  var interface = {


    getView: function(callback, tableName) {

        tableName = tableName || "";
        var returnView = callback; // коллбек для отдачи представления
        MAIN_TABLE = tableName;

        async.waterfall([
            checkView,
            ifAsync(viewDoesNotExist).
            then(createView),
            getColumnsFromQueryResult
          ],
          function(err, result) {

            // отдаём представление
            returnView(result);
          });
      },

      deleteView: function() {
        var query = "set search_path to " + schemaname + ";\n" +
          "drop view all_join;"
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

      checkViewExisting: function(callback) {
        var redirectAction = callback;

        async.waterfall([
            checkView,
            ifAsync(viewDoesNotExist).
            then(function(result, callback) {
              callback(null, false);
            }).
            else(function(result, callback) {
              callback(null, true);
            }),
          ],
          function(err, result) {
            //console.log("представление", result);
            redirectAction(result);
          });
      }
  }

  return interface;

  function checkView(callback) {

    // получаем, существует представление all_join, или нет
    // если нет, то создаём его
    var client = new pg.Client(localConfig);
    var query = "set search_path to " + schemaname + ";\n" +
      "select count(*) from information_schema.tables\n" +
      "where table_name = 'all_join';";

    // подключение
    client.connect(function(err) {
      if (err) throw err;

      client.query(query, function(err, countResult) {
        if (err) throw err;

        client.end(function(err) {
          if (err) throw err;
        });

        callback(null, countResult);

      });


    });
  }

  function viewDoesNotExist(countResult, callback) {

    // если представление ещё не создано, колонок нет
    // то вернёт true
    callback(null, (countResult.rows[0].count == 0));
  }

  function createView(columnsResult, callback) {

    // если представления ещё нет
    // создаём его
    var query = pgStructureFunc(localConfig.database, schemaname).
    queryForView(MAIN_TABLE).
    then((result) => {
      /*
      var viewColumns = [];
      viewColumns = result.columns;
      */
      var client = new pg.Client(localConfig);
      client.connect(function(err) {
        if (err) throw err;

        client.query(result.query, function(err, createResult) {
          if (err) throw err;

          // disconnect the client
          client.end(function(err) {
            if (err) throw err;
          });

          callback(null, createResult);
        });

      });

      //return (viewColumns);

    });
  }

  function getColumnsFromQueryResult(columns, callback) {

    // когда представление уже существует
    // выбираем коллонки из запроса для представления
    var client = new pg.Client(localConfig);
    var query = "set search_path to " + schemaname + ";\n" +
      "select column_name from information_schema.columns\n" +
      "where table_name = 'all_join';";

    // подключение
    client.connect(function(err) {
      if (err) throw err;

      // выполняем запрос колонок
      client.query(query, function(err, columnsResult) {
        if (err) throw err;

        client.end(function(err) {
          if (err) throw err;
        });
        //console.log(columnsResult);

        callback(null, columnsResult.rows);

      });


    });
  }
}

module.exports = structure;