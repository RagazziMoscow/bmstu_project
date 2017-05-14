var config = require("./../config/config");
var query = require('pg-query');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования

var database = config.workbase.database;
var host = config.workbase.host;
var port = config.workbase.port;
var adminUser = config.workbase.user;
var adminPassword = config.workbase.password;


var verify = function(login, password, callback) {

  query.connectionParameters = 'postgres://{0}:{1}@{4}:{2}/{3}'.format(adminUser,
    adminPassword,
    port,
    database,
    host);

  var sqlQuery = "SELECT * FROM public.user WHERE login='{0}' AND password='{1}';".format(login, password);
  query(sqlQuery, function(err, rows, result) {
    if (err) console.log(err);
    console.log(rows);
    callback(rows[0]);
  });

};

module.exports.verify = verify;


var check = function(login, callback) {

  query.connectionParameters = 'postgres://{0}:{1}@{4}:{2}/{3}'.format(adminUser,
    adminPassword,
    port,
    database,
    host);

  var sqlQuery = "SELECT login from public.user WHERE login={0};".format(login);
  query(sqlQuery, function(err, rows, result) {
    if (err) console.log(err);
    callback((rows[0] = []));
  });
};

module.exports.check = check;



var createUser = function(login, password, name, email, phone, callback) {

  var sqlQuery = "INSERT INTO 'user' (login, password, user_name, email, phone) VALUES ({0}, {1}, {2}, {3}, {4});".format(login,
    password,
    name,
    email,
    phone);


  query(sqlQuery, function(err, rows, result) {
    if (err) console.log(err);
    callback();
  });


}

module.exports.create = createUser;