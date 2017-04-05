var config = require("./../config/config");
var pgStructureFunc = require("./../pg-structure-func");
var pg = require("pg");

/*
module.exports.list = function(dbname, schemaname, callback) {


  var localConfig = {
    database: dbname, //env var: PGDATABASE
    user: config.database.user, //env var: PGUSER
    password: config.database.password, //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: config.database.port //env var: PGPORT
  };

  var query = "select table_name from information_schema.tables\n" +
    "where table_schema = '" + schemaname +
    "' and table_type = 'BASE TABLE';"

  var client = new pg.Client(localConfig);
  client.connect(function(err) {
    if (err) throw err;
    client.query(query, function(err, tablesResult) {
      if (err) throw err;

      //console.log(tables);

      client.end(function(err) {
        if (err) throw err;
      });

      callback(tablesResult.rows);

    });
  });


}
*/

module.exports.list = function(dbname, schemaname, callback) {

  var localConfig = {
    database: dbname, //env var: PGDATABASE
    user: config.database.user, //env var: PGUSER
    password: config.database.password, //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: config.database.port //env var: PGPORT
  };


  var viewAction = callback;
  var relations = pgStructureFunc(localConfig.database, schemaname).
  relationsInfo().
  then((result) => {
    viewAction(result);
  });

}