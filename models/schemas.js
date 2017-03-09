var pg = require('pg');

var schemas = function(databaseName) {

  var schemaList = {

    list: function(callback) {

      var localConfig = {
        database: databaseName, //env var: PGDATABASE
        user: 'admin', //env var: PGUSER
        password: 'admin', //env var: PGPASSWORD
        host: 'localhost', // Server hosting the postgres database
        port: 5432 //env var: PGPORT
      };


      var result = {};
      var client = new pg.Client(localConfig);
      client.connect(function(err) {
        if (err) throw err;
        client.query('select distinct(t1.nspname) from pg_namespace t1\n' +
          'left join information_schema.tables t2 on t1.nspname = t2.table_schema\n' +
          'where table_type = \'BASE TABLE\'' +
          'and nspname not in (\'pg_catalog\',\'information_schema\')',
          function(err, result) {
            if (err) throw err;

            // disconnect the client
            client.end(function(err) {
              if (err) throw err;
            });
            //console.log(result.rows);
            callback(result.rows);
          });
      });
    }
  }
  return schemaList;
};

module.exports = schemas;