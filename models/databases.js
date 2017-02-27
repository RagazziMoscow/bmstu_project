var pg = require('pg');


var dataBases = {
  list: function(callback) {
    var result = {};
    var client = new pg.Client('postgres://admin:admin@localhost:5432/postgres');

    // connect to our database
    client.connect(function(err) {
      if (err) throw err;

      // execute a query on our database
      client.query('SELECT pg_database.datname as "Database",\n' +
        'pg_user.usename as "Owner" FROM pg_database, pg_user \n' +
        'WHERE pg_database.datdba = pg_user.usesysid \n' +
        'AND pg_user.usename != \'postgres\' \n' +

        'UNION \n' +
        'SELECT pg_database.datname as "Database",\n' +
        'NULL as "Owner" FROM pg_database \n' +
        'WHERE pg_database.datdba NOT IN (SELECT usesysid FROM pg_user) \n' +
        'ORDER BY "Database"',
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

};

module.exports = dataBases;