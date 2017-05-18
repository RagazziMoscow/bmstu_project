var config = require("./../config/config");
var query = require('pg-query');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования


var database = config.workbase.database;
var host = config.workbase.host;
var port = config.workbase.port;
var adminUser = config.workbase.user;
var adminPassword = config.workbase.password;


query.connectionParameters = 'postgres://{0}:{1}@{4}:{2}/{3}'.format(adminUser,
  adminPassword,
  port,
  database,
  host);

var saveTemplate = function(tempalteData, userId, callback) {

  var name = tempalteData.name;
  var data = tempalteData.data;
  var dbname = tempalteData.database;
  var schema = tempalteData.schema;
  var table = tempalteData.table;
  var viewColumns = tempalteData.viewColumns;

  var sqlQuery = "insert into public.template" +
    "(name, data, database, schema, \"table\", view_columns, owner_id)" +
    "values" +
    "('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', {6});".format(name,
      data,
      dbname,
      schema,
      table,
      viewColumns,
      userId);

  query(sqlQuery, function(err, rows, result) {
    if (err) console.log(err);
    //console.log(rows);
    callback();
  });
}


module.exports.save = saveTemplate;


var templatesList = function(userId, callback) {


  var sqlQuery = "select template_id, name from public.template join public.\"user\"\n" +
    "on template.owner_id = \"user\".user_id\n" +
    "where \"user\".user_id = {0};".format(userId);

  query(sqlQuery, function(err, rows, result) {
    if (err) console.log(err);
    //console.log(rows);
    callback(rows);
  });

}

module.exports.list = templatesList;

var removeTemplate = function(template_id, callback) {

  var sqlQuery = "delete from public.template\n" +
    "where template_id = {0};".format(template_id);

  query(sqlQuery, function(err, rows, result) {
    if (err) console.log(err);
    //console.log(rows);
    callback();

  });
}


module.exports.remove = removeTemplate;

var loadTemplate = function(templateId, userId, callback) {

  var sqlQuery = "select template_id, name, data, database, schema, \"table\", view_columns\n" +
    "from public.template join public.\"user\"\n" +
    "on template.owner_id = \"user\".user_id\n" +
    "where template_id = {0} and user_id = {1};".format(templateId, userId);

  query(sqlQuery, function(err, rows, result) {
    if (err) console.log(err);
    //console.log(rows);
    callback(rows[0]);

  });
}

module.exports.load = loadTemplate;