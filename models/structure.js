var config = require("./../config/config");
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


    createView: function(callback) {

        //return new Promise((resolve, reject) => {

          var viewColumns = []; // колонки представления
          var query = "select column_name from information_schema.columns\n" +
            "where table_name = 'all_join';"

          var result = {};

          var client = new pg.Client(localConfig);

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

              // представление не создано, колонок нет
              if (columnsResult.rowCount == 0) {

                //resolve(['1312', 'cekavo']);

                //console.log("Представления ещё нет");


                // если представления ещё нет
                var query = pgFunctionsModule(localConfig.database, schemaname).
                queryForView()
                  .then((result) => {

                    viewColumns = result.columns;
                    console.log("Созданные колонки", viewColumns);


                    var client = new pg.Client(localConfig);
                    client.connect(function(err) {
                      if (err) throw err;
                      client.query(result.query, function(err, createResult) {
                        if (err) throw err;

                        // disconnect the client
                        client.end(function(err) {
                          if (err) throw err;
                        });
                        console.log(createResult);

                      });

                    });

                    return (viewColumns);

                  })
                  .then((columns) => {

                    // отдаём представление с колонками представления
                    callback(columns);
                  });


              } else {

                // когда представление уже существует
                // выбираем коллонки из запроса для представления
                columnsResult.rows.forEach((item) => {
                  viewColumns.push(item.column_name);
                });

                // отдаём представление с колонками представленя
                callback(viewColumns);
              }


            });


          });


        //});
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
}

module.exports = structure;