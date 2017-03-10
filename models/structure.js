var pg = require("pg");
var pgFunctionsModule = require("./db-structure-functions");

var structure = function(dbname, schemaname) {

  var interface = {

    dbProp: {
        database: dbname,
        schema: schemaname
      },

      createView: function() {

        var localConfig = {
          database: this.dbProp.database, //env var: PGDATABASE
          user: 'admin', //env var: PGUSER
          password: 'admin', //env var: PGPASSWORD
          host: 'localhost', // Server hosting the postgres database
          port: 5432 //env var: PGPORT
        };

        var query = pgFunctionsModule(this.dbProp.database, this.dbProp.schema).queryForView(function(query) {
          var result = {};
          var client = new pg.Client(localConfig);

          client.connect(function(err) {
            if (err) throw err;
            client.query(query, function(err, result) {
              if (err) throw err;

              // disconnect the client
              client.end(function(err) {
                if (err) throw err;
              });
              console.log(result);
              //callback(result.rows);
            });
          });

        });
        console.log(query);



      }
  }

  return interface;
}

module.exports = structure;