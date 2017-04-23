var entities = require('./tables');

// получаем, существует ли отношение между таблицами
function isRelationBetweenTables(db, analyzedSchema, firstTableName, secondTableName) {

    var relations = entities.getTable(db, analyzedSchema, firstTableName).relations;
    //console.log(relations);
    for (let relation of relations.values()) {
        //console.log(relation.targetTable.name);

        // отношение типа "многие-ко-многим" игнорируем
        if (relation.type != "MANY TO MANY" && relation.targetTable.name == secondTableName) {
            return true;
        }
    }

    return false;
}

// получаем отношение между таблицами
function getRelation(db, analyzedSchema, firstTableName, secondTableName) {
    var relations = entities.getTable(db, analyzedSchema, firstTableName).relations;
    //console.log(relations);
    for (let relation of relations.values()) {
        //console.log(relation.targetTable.name);
        if (relation.type != "MANY TO MANY" && relation.targetTable.name == secondTableName) {
            return relation;
        }
    }

    return null;
}


// получаем таблицу с внешним ключом
function tableIsTarget(tableName, relation) {
    //console.log(tableName, relation.targetTable.name);
    return (relation.targetTable.name == tableName);
}


// получаем имена полей таблиц, учавствующих в отношении
function getRelationColumns(relation) {

    var columnsList = [];

    if (relation.type == "ONE TO MANY") {
        // один комногим
        var relationColumns = relation.targetTable.columns; // колонки в таблице с внешним ключом
        var necessaryTableName = relation.sourceTable.name; // имя таблицы с первичным ключом

    } else {

        var relationColumns = relation.sourceTable.columns;
        var necessaryTableName = relation.targetTable.name;

    }

    // обход по таблице с внешним ключом
    for (let tableColumn of relationColumns.values()) {

        // если существуют колонки, на которые ссылается ограничение
        if (tableColumn.referencedColumns.size != 0 &&
            Array.from(tableColumn.referencedColumns)[0].table.name == necessaryTableName) {

            // колонки из табицы с первичным ключом
            let refColumns = tableColumn.referencedColumns;

            // вставляем в массив имена таблиц, сначала начальная таблица, потом конечная
            if (relation.type == "ONE TO MANY") {

                columnsList[0] = {
                    "name": Array.from(refColumns)[0].name,
                    "table": Array.from(refColumns)[0].table.name
                };
                columnsList[1] = {
                    "name": tableColumn.name,
                    "table": tableColumn.table.name
                };
            } else {

                columnsList[0] = {
                    "name": tableColumn.name,
                    "table": tableColumn.table.name
                };
                columnsList[1] = {
                    "name": Array.from(refColumns)[0].name,
                    "table": Array.from(refColumns)[0].table.name
                };

            }

        }
    }
    return columnsList;
}


// получаем поле начальной(конечной) таблицы, участвующей в отношении
// получаем поле начальной таблицы, участвующей в отношении
function getSourceTableColumn(relation) {
  var sourceColumn = {};
  if (relation.type == "ONE TO MANY") {

    var relationColumns = relation.targetTable.columns; // колонки в таблице с внешним ключом
    var necessaryTableName = relation.sourceTable.name; // имя таблицы с первичным ключом

  } else {

    var relationColumns = relation.sourceTable.columns;
    var necessaryTableName = relation.targetTable.name;

  }

  // конечная таблица
  //console.log(relation.targetTable.name);
  //console.log(relationColumns);

  // обход по таблице с внешним ключом
  for (let tableColumn of relationColumns.values()) {

    // если существуют колонки, на которые ссылается ограничение
    if (tableColumn.referencedColumns.size != 0 &&
      Array.from(tableColumn.referencedColumns)[0].table.name == necessaryTableName) {

      // колонки из табицы с первичным ключом
      let refColumns = tableColumn.referencedColumns;
      //console.log(refColumns);

      // вставляем в массив имена таблиц,
      // сначала начальная таблица, потом конечная
      if (relation.type == "ONE TO MANY") {
        sourceColumn.name = Array.from(refColumns)[0].name;
        sourceColumn.table = Array.from(refColumns)[0].table.name;
      } else {
        sourceColumn.name = tableColumn.name;
        sourceColumn.table = tableColumn.table.name;

      }

    }
  }
  return sourceColumn;
}

// получаем поле конечной таблицы, участвующей в отношении
function getTargetTableColumn(relation) {
  var sourceColumn = {};
  if (relation.type == "ONE TO MANY") {

    var relationColumns = relation.targetTable.columns; // колонки в таблице с внешним ключом
    var necessaryTableName = relation.sourceTable.name; // имя таблицы с первичным ключом

  } else {

    var relationColumns = relation.sourceTable.columns;
    var necessaryTableName = relation.targetTable.name;

  }

  // конечная таблица
  //console.log(relation.targetTable.name);
  //console.log(relationColumns);

  // обход по таблице с внешним ключом
  for (let tableColumn of relationColumns.values()) {

    // если существуют колонки, на которые ссылается ограничение
    if (tableColumn.referencedColumns.size != 0 &&
      Array.from(tableColumn.referencedColumns)[0].table.name == necessaryTableName) {

      // колонки из табицы с первичным ключом
      let refColumns = tableColumn.referencedColumns;
      //console.log(refColumns);

      // вставляем в массив имена таблиц, сначала начальная таблица, потом конечная
      if (relation.type == "ONE TO MANY") {

        sourceColumn.name = tableColumn.name;
        sourceColumn.table = tableColumn.table.name;
      } else {
        sourceColumn.name = Array.from(refColumns)[0].name;
        sourceColumn.table = Array.from(refColumns)[0].table.name;


      }

    }
  }
  return sourceColumn;
}






module.exports.isRelationBetweenTables = isRelationBetweenTables;
module.exports.getRelation = getRelation;
module.exports.tableIsTarget = tableIsTarget;
module.exports.getRelationColumns = getRelationColumns;
module.exports.getSourceTableColumn = getSourceTableColumn;
module.exports.getTargetTableColumn = getTargetTableColumn;
//module.exports.getRelations = getRelations;
//module.exports.getRelationsInfo = getRelationsInfo;
