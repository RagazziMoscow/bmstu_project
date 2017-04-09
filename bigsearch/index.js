var config = require('./../config/config');
var query = require('pg-query');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования

function getSQL(conditionsArrayString, columnsArray) {
  var columnsString = columnsArray.join(', ');
  var conditionsArray = JSON.parse(conditionsArrayString);
  var sqlQuery = "";

  // обход по группам
  for (group of conditionsArray) {
    sqlQuery += "(\n";

    // обход по дескрипторам в группе
    for (descriptor of group) {
      //console.log(descriptor.name, descriptor.id);

      // преобразование имени дескриптора
      let name = filterName(descriptor.name);


      // если тег
      if (descriptor.id == 1) {
        sqlQuery += "(select {2} from {0}\n where {1} is not null)\n".format("all_join",
          name,
          columnsString);
      }

      // атрибут
      if (descriptor.id == 2) {
        sqlQuery += "(select {4} from {0}\n where {1} {2} {3}\n)".format("all_join",
          name,
          descriptor.relation,
          filterValue(descriptor.number),
          columnsString);
      }

      // отсутствие тега
      if (descriptor.id == 3) {
        sqlQuery += "(select {2} from {0}\n where {1} is null)\n".format("all_join",
          name,
          columnsString);
      }
      if (group.indexOf(descriptor) !== group.length - 1) sqlQuery += "intersect\n";
    }


    sqlQuery += ")\n";
    if (conditionsArray.indexOf(group) !== conditionsArray.length - 1) sqlQuery += "union\n";
  }
  //return "select * from all_join";
  sqlQuery += ";";
  console.log(sqlQuery);
  return sqlQuery;
}

// преобразует имя дескриптора
function filterName(name, column) {
  let convName = name.split(".");
  return (convName.length >= 2) ? '\"{0}\"'.format(name) : name;
}

// оборачивает строки в кавычки
function filterValue(value) {
  let wrapper = "\'";
  return (typeof(value) == 'string') ? (wrapper + value + wrapper) : value;
}

function searchResultsProcess(rows) {
  return rows;
}

function searchQuery(conditionsArray, columns, connectionParams, callback) {

  columns = columns.map(function(column) {
    return filterName(column);
  });

  let database = connectionParams.database;
  let schema = connectionParams.schema;
  let sqlQuery = getSQL(conditionsArray, columns, schema);
  let user = config.database.user;
  let password = config.database.password;
  let port = config.database.port;
  query.connectionParameters = 'postgres://{0}:{1}@localhost:{2}/{3}'.format(user,
    password,
    port,
    database);

  query(sqlQuery, function(err, rows, result) {
    //assert.equal(rows, result.rows);
    if (err) console.log(err);
    console.log(rows);
    callback(searchResultsProcess(rows));
  });
  /**/
}

/*
function filterColumns(params) {
  var paramsList = [];
  for (parameter of Object.keys(params)) {
    if (params[parameter] == 'on') {
      paramsList.push(parameter);
    }
  }
  return paramsList;
}
*/
module.exports.searchQuery = searchQuery;
module.exports.getSQL = getSQL;