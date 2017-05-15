var config = require('./../config/config');
var pg = require('pg');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования


module.exports.list = function(callback) {

  var user = config.database.user;
  var password = config.database.password;
  var host = config.database.host;
  var port = config.database.port;
  var client = new pg.Client('postgres://{0}:{1}@{2}:{3}/postgres'.format(user,
    password,
    host,
    port));
  var databasesListQuery = "select datname, usename from pg_database\n" +
    "left join pg_user on pg_database.datdba = pg_user.usesysid\n" +
    "where pg_user.usename = 'admin'\n" +
    "and datname != 'workbase';";

  // connect to our database
  client.connect(function(err) {
    if (err) throw err;

    client.query(databasesListQuery, function(err, result) {
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