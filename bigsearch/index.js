var config = require('./../config/config');
var types = require('./types');
var query = require('pg-query');
//var async = require('async');
var _ = require('underscore');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования


function getSQL(conditionsArrayString, columnsArray, schema) {
  //console.log(conditionsArrayString);
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
        sqlQuery += "(select {2} from {3}.{0}\n where {1} is not null\ngroup by {2})\n".format("all_join",
          name,
          columnsString,
          schema);
      }

      // атрибут
      if (descriptor.id == 2) {

        let convData = types.convert(name, descriptor.relation, descriptor.number, descriptor.type);
        //console.log(convData);
        sqlQuery += "(select {4} from {5}.{0}\n where {1} {2} {3}\ngroup by {4})\n".format("all_join",
          convData.name,
          convData.rel,
          convData.val,
          columnsString,
          schema);
      }

      // отсутствие тега
      if (descriptor.id == 3) {
        sqlQuery += "(select {2} from {3}.{0}\n where {1} is null\ngroup by {2})\n".format("all_join",
          name,
          columnsString,
          schema);
      }
      if (group.indexOf(descriptor) !== group.length - 1) sqlQuery += "intersect\n";
    }


    sqlQuery += ")\n";
    if (conditionsArray.indexOf(group) !== conditionsArray.length - 1) sqlQuery += "union\n";
  }
  sqlQuery += ";";
  console.log(sqlQuery);
  return sqlQuery;
}

// преобразует имя дескриптора
function filterName(name, column) {
  //console.log(name);
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
    return filterName(column.column_name);
  });
  let returnResult = callback;

  let database = connectionParams.database;
  let schema = connectionParams.schema;
  //console.log(conditionsArray, columns, schema);
  let sqlQuery = getSQL(conditionsArray, columns, schema);
  let user = config.database.user;
  let password = config.database.password;
  let port = config.database.port;
  let host = config.database.host;



  query.connectionParameters = 'postgres://{0}:{1}@{4}:{2}/{3}'.format(user,
    password,
    port,
    database,
    host);

  query(sqlQuery, function(err, rows, result) {
    //assert.equal(rows, result.rows);
    if (err) console.log(err);
    //console.log(result);
    returnResult(searchResultsProcess(rows));
  });

}


function selectColumns(req) {


  // Отбираем всё, что пришло в запросе и отбрасываем первые три элемента:
  // базу данных, схему и основную таблицу
  let viewColumnsSelected = Object.keys(req.body);
  viewColumnsSelected.splice(0,3);

  let viewColumnsSelectedWithTypes = [];
  //console.log(viewColumns);
  _.each(viewColumnsSelected, function(item) {
    item = item.split('$');
    item = {
      "column_name": item[0],
      "data_type": item[1]
    };
    viewColumnsSelectedWithTypes.push(item);
  });
/*
  _.each(viewColumns, function(item) {
    let deleteFlag = true;
    _.each(viewColumnsSelectedWithTypes, function(itemType) {
      if (itemType == item) deleteFlag = false;
    });
    //if (deleteFlag) req.session.searchData.viewColumns.splice(req.session.searchData.viewColumns.indexOf(item), 1);
    if (deleteFlag) viewColumns.splice(viewColumns.indexOf(item), 1);
  });
*/
  //console.log(viewColumnsSelectedWithTypes, req.session.searchData.viewColumns);
  return viewColumnsSelectedWithTypes;

}
module.exports.select = selectColumns;
module.exports.search = searchQuery;
module.exports.getSQL = getSQL;