var pg = require('pg');
var stringformat = require('stringformat');
stringformat.extendString('format'); // добавляем метод форматирования

function getSQL(conditionsArrayString) {
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
        sqlQuery += "(select * from {0}\n where {1} is not null)\n".format("all_join", name);
      }

      // атрибут
      if (descriptor.id == 2) {
        sqlQuery += "(select * from {0}\n where {1} {2} {3}\n)".format("all_join",
          name,
          descriptor.relation,
          descriptor.number);
      }

      // отсутствие тега
      if (descriptor.id == 3) {
        sqlQuery += "(select * from {0}\n where {1} is null)\n".format("all_join", name);
      }
      if (group.indexOf(descriptor) !== group.length - 1) sqlQuery += "intersect\n";
    }


    sqlQuery += ")\n";
    if (conditionsArray.indexOf(group) !== conditionsArray.length - 1) sqlQuery += "union\n";
  }
  //return "select * from all_join";

  console.log(sqlQuery);
}

// преобразует имя дескриптора
function filterName(name) {
  let convName = name.split(".");
  return (convName.length >= 2) ? '\"{0}\"'.format(name) : name;
}

function searchQuery(conditionsArray) {
  let sqlQuery = getSQL(conditionsArray);
  /**/
}

module.exports.getSQL = getSQL;