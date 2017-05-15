var config = require('./../config/config');
var query = require('pg-query');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования
var async = require('async');
var typesConversion = require('./conversion');



function typeProcess(name, relation, value, postgresType) {

  //console.log(name, relation, value, postgresType);
  name = typesConversion[postgresType]["name"][relation](name) || name;
  relation = typesConversion[postgresType]["relation"][relation](relation) || relation;
  value = typesConversion[postgresType]["value"][relation](value) || value;

  let convertedData = {
    name: name,
    rel: relation,
    val: value
  };
  return convertedData;
}



function convertAll(name, relation, value, postgresType) {
  //let returnData = callback;
  let convertedData;
  let data = typeProcess(name, relation, value, postgresType);
  return data;

}


module.exports.convert = convertAll;