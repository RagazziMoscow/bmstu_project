var config = require('./../config/config');
var query = require('pg-query');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования
var async = require('async');

var typesConversion = {
  "integer": "number",
  "character": "string"
};

var typesOperators = {
  "string": {
    "=": "=",
    "!=": "!=",
    ">": ">",
    "<": "<"
  },
  "number": {
    "=": "=",
    "!=": "!=",
    ">": ">",
    "<": "<"
  }
}


function convertTypes(postgresType) {
  return typesConversion[postgresType];
}

function getComparing(relation, jsType) {
  return typesOperators[jsType][relation];
}

function typeProcess(value, relation, postgresType) {

  //console.log(value, convertTypes(postgresType));
  if (convertTypes(postgresType) == 'string') value = "\'" + value + "\'";
  relation = getComparing(relation, convertTypes(postgresType));
  let convertedData = {
    val: value,
    rel: relation
  };
  //console.log(convertedData);
  return convertedData;
}

function typesRequest(comparingInfo, callback) {

  //let database = connectionParams.database;
  //let schema = connectionParams.schema;
  let database = comparingInfo.database;
  let schema = comparingInfo.schema;
  let user = config.database.user;
  let password = config.database.password;
  let port = config.database.port;
  let sqlQuery = "set search_path to " + schema + ";\n" +
    "select column_name, data_type from information_schema.columns\n" +
    "where table_name = 'all_join'";
  //console.log(sqlQuery);

  query.connectionParameters = 'postgres://{0}:{1}@localhost:{2}/{3}'.format(user,
    password,
    port,
    database);

  query(sqlQuery, function(err, rows, result) {
    //assert.equal(rows, result.rows);
    if (err) console.log(err);
    //console.log(rows);
    callback(null, rows);

  });


}

function getColumnType(columns, name) {
  name = name.replace(/"/g, '');
  for (column of columns) {
   // console.log(column.column_name, " ", column.data_type);
    if (column.column_name == name) {
     // console.log("true");
      return column.data_type
    };
    //console.log(column.column_name, " ", name, " ", 'faslse');
  }
}


function convertAll(postgresType, value, relation) {
  //let returnData = callback;
  let convertedData;
  let data = typeProcess(value, relation, postgresType);
  return data;

}


module.exports.convert = convertAll;
module.exports.typesRequest = typesRequest;
module.exports.getColumnType = getColumnType;