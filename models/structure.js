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


    getView: function(tableName, callback) {

        var returnView = callback; // коллбек для отдачи представления
        MAIN_TABLE = tableName;

        async.waterfall([
            getViewColumnsCount,
            ifAsync(countCreatedViewIsNull).
            then(createView).
            else(function(a, callback) {
              callback(null, 'dont care');
            }),
            getColumnsFromQueryResult
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

      }
  }

  return interface;

  function getViewColumnsCount(callback) {

    // получаем количество колонок представления
    // оно либо не равно нулю, и тогда представление существует
    // либо равно нулю, тогда создаём представление
    var client = new pg.Client(localConfig);
    var query = "select count(*)  from information_schema.columns\n" +
      "where table_name = 'all_join'";

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

  function countCreatedViewIsNull(countResult, callback) {

    // если представление ещё не создано, колонок нет
    callback(null, (countResult.rows[0].count == 0));


  }

  function createView(columnsResult, callback) {

    // если представления ещё нет
    var query = pgStructureFunc(localConfig.database, schemaname).
    queryForView(MAIN_TABLE)
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
            callback(null, createResult);

          });

        });

        return (viewColumns);

      });
  }

  function getColumnsFromQueryResult(columns, callback) {

    // когда представление уже существует
    // выбираем коллонки из запроса для представления
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
        //console.log(columnsResult);

        callback(null, columnsResult.rows);

      });


    });
  }
}

module.exports = structure;