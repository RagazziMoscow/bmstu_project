var config = require("./../config/config");
var pgStructure = require("pg-structure");
var chalk = require("chalk");

/*
 database: "xgb_nir",
 user: "xgb_nir",
 password: "accab9725sgh"
 */


function structure(database, schema) {

    var connectionArgs = {
        database: database,
        user: config.database.user,
        password: config.database.password,
        host: "localhost",
        port: config.database.port
    };


    var analyzedSchema = schema;

    var sqlData = {

        queryForView: function(mainTableName) {
            //var query = "";

            return new Promise(function(resolve, reject) {
                pgStructure(connectionArgs, analyzedSchema)
                    .then((db) => {
                        //getSequenceForView(db, analyzedSchema, 'printer');
                        var query = getSQLForView(db, analyzedSchema, mainTableName);
                        //console.log(query);
                        //var relations = getRelationsInfo(db, analyzedSchema);

                        // возвращаем результат
                        resolve({
                            query: query
                        });
                        //callback(query);
                    }).
                catch((err) => console.log(err.stack));


            });
        },

        relationsInfo: function() {

            return new Promise(function(resolve, reject) {
                pgStructure(connectionArgs, analyzedSchema).
                then((db) => {
                    var tables = Array.from(db.schemas.get(analyzedSchema).tables.keys());
                    var relations = getRelationsInfo(db, analyzedSchema);
                    analizedTables = [];

                    // возращаем результат
                    resolve({entities: tables, links: relations});
                }).
                catch((err) => console.log(err.stack));
            });
        },

        viewColumns: []
    };


    return sqlData;

}

module.exports = structure;


function getIndependentTables(db, analyzedSchema) {

    var independentTablesArray = [];
    var tables = db.schemas.get(analyzedSchema).tables.values();
    for (table of tables) {
        if (table.foreignKeyColumns.size === 0) {
            //console.log("Для таблицы ", table.name, "внешние ключи отсутствуют");
            independentTablesArray.push(table.name);
        }
    }
    if (independentTablesArray.length != 0) return independentTablesArray;

    // если структура зациклина, возвращаем любую таблицу
    return Array.from(db.schemas.get(analyzedSchema).tables.keys()[0]);

}

function getAllTables(db, analyzedSchema) {
    var tables = Array.from(db.schemas.get(analyzedSchema).tables);
    return tables;
}


// выстраиваем последовательность таблиц для объединения
var analizedTables = [];

// выстраиваем поледовательность колонок для представления
var viewColumns = [];

function getSequenceForView(db, analyzedSchema, independentTableName) {
    //var analizedTables = [];
    //if(tableName.)
    var table = getTable(db, analyzedSchema, independentTableName);
    var name = table.name;

    // если в массиве такой таблицы ещё нет
    if (!analizedTables.includes(name)) {

        //console.log(name);

        analizedTables.push(name);
        if (table.o2mRelations.size != 0) {

            var relations = table.o2mRelations;
            for (relation of relations.values()) {
                getSequenceForView(db, analyzedSchema, relation.targetTable.name);
            }
        }
        if (table.m2oRelations.size != 0) {
            var relations = table.m2oRelations;
            for (relation of relations.values()) {
                getSequenceForView(db, analyzedSchema, relation.targetTable.name);
            }
        }


    }
}

// получаем таблицу
function getTable(db, analyzedSchema, tableName) {
    return db.schemas.get(analyzedSchema).tables.get(tableName);
}


// получаем, существует ли отношение между таблицами
function isRelationBetweenTables(db, analyzedSchema, firstTableName, secondTableName) {

    var relations = getTable(db, analyzedSchema, firstTableName).relations;
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

// получаем колонки таблицы
function getTableColumns(db, analyzedSchema, tableName) {
    var table = getTable(db, analyzedSchema, tableName);
    return Array.from(table.columns.keys());
}

// получаем отношение между таблицами
function getRelation(db, analyzedSchema, firstTableName, secondTableName) {
    var relations = getTable(db, analyzedSchema, firstTableName).relations;
    //console.log(relations);
    for (let relation of relations.values()) {
        //console.log(relation.targetTable.name);
        if (relation.type != "MANY TO MANY" && relation.targetTable.name == secondTableName) {
            return relation;
        }
    }

    return null;
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
function getSourceTableColumn(relation, target = false) {
    var sourceColumn = {};
    if (relation.type == "ONE TO MANY") {

        var relationColumns = relation.targetTable.columns; // колонки в таблице с внешним ключом
        var necessaryTableName = relation.sourceTable.name; // имя таблицы с первичным ключом

    } else {

        var relationColumns = relation.sourceTable.columns;
        var necessaryTableName = relation.targetTable.name;

    }

    // обход по таблице с внешним ключом
    for (let tableColumn of relationColumns.values()) {

        // если существуют колонки, на которые ссылается ограничение
        let columnsCondition = (tableColumn.referencedColumns.size != 0 &&
            Array.from(tableColumn.referencedColumns)[0].table.name == necessaryTableName);

        if (columnsCondition) {
            // колонки из табицы с первичным ключом
            let refColumns = tableColumn.referencedColumns;

            // вставляем в массив имена таблиц,
            // сначала начальная таблица, потом конечная
            let relationCondition = ((relation.type == "ONE TO MANY" && target == false) ||
                (relation.type == "MANY TO ONE" && target == true));

            if (relationCondition) {
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


// собираем запрос на создания общего представления
function getSQLForView(db, analyzedSchema, analizedTableName) {

    //console.log(analizedTableName);

    if (analizedTableName == "") {
        getSequenceForView(db, analyzedSchema, getIndependentTables(db, analyzedSchema)[0]);
        console.log(analizedTables);
    } else {
        getSequenceForView(db, analyzedSchema, analizedTableName);
        console.log(analizedTables);
    }

    /*
     // дописать для 1 таблицы
     if (analizedTables.length == 1) {
     return "set search_path to " + analyzedSchema +
     ";\n create view as "
     }

     */

    var SQLQuery = " from ";
    SQLQuery += analizedTables[0];

    var selectPart = ""; // первая часть запроса для select
    var joinedColumns = []; // массив для учёта колонок с одинаковыми именами в разных таблицах

    if (Array.from(db.schemas.get(analyzedSchema).tables.keys()).length == 1) {
        return "set search_path to " + analyzedSchema +
            ";\ncreate view all_join as select * from " + analizedTables[0];
    }

    // для каждой таблицы делаем выборку колонок,
    // если колонки повторяются, то заменяем имена псевдонимами
    analizedTables.forEach((tableName, tableIndex, tablesArray) => {
        var columnsList = getTableColumns(db, analyzedSchema, tableName);
        //console.log(columnsList);
        columnsList = columnsList.map(function(columnName) {

            columnName = getColumnNameForView(db, analyzedSchema, columnName, tableName, tablesArray);
            joinedColumns.push(columnName);

            viewColumns = joinedColumns;
            return columnName;
        });

        // разделям все имена запятой для выборки
        columnsList = columnsList.join(", ") + ", \n";
        selectPart += columnsList;

    });
    selectPart = selectPart.substring(0, selectPart.length - 3);
    //console.log(selectPart);

    // собираем часть запроса для join
    for (let i = 1; i < analizedTables.length; i++) {

        for (let j = 0; j < i; j++) {

            // если между двумя таблицами существует отношение
            if (isRelationBetweenTables(db, analyzedSchema, analizedTables[i], analizedTables[j])) {

                console.log(chalk.red(analizedTables[i]),
                    chalk.yellow.bold("->"),
                    chalk.green(analizedTables[j]));

                // определяем колонки для соединения таблиц
                let joinColumnTargetInfo = getSourceTableColumn(getRelation(db,
                    analyzedSchema,
                    analizedTables[i],
                    analizedTables[j]), true); // target
                let joinColumnSourceInfo = getSourceTableColumn(getRelation(db,
                    analyzedSchema,
                    analizedTables[i],
                    analizedTables[j]));
                //console.log(joinColumnTargetInfo, joinColumnSourceInfo);
                SQLQuery += " full join " + analizedTables[i] +
                    " on " + analizedTables[j] +
                    "." + joinColumnTargetInfo.name +
                    " = " + analizedTables[i] +
                    "." + joinColumnSourceInfo.name + "\n";

                break;

            }

        }

    }

    // соединяем части запроса select и join

    //console.log(selectPart);
    SQLQuery = SQLQuery.substring(0, SQLQuery.length - 1);
    SQLQuery += ";";
    SQLQuery = selectPart + SQLQuery;
    SQLQuery = "set search_path to " + analyzedSchema + ";\n create view all_join as \n select " + SQLQuery;
    //console.log("Скрипт:\n", SQLQuery);
    analizedTables = [];

    //console.log(viewColumns);
    /*
    return {
        query: SQLQuery,
        columns: viewColumns
    };
    */

    return SQLQuery;
}


// возвращает список всех отношений в бд
function getRelations(db, analyzedSchema) {
    var tablesLinks = [];
    for (let innerIndex = 1; innerIndex < analizedTables.length; innerIndex++) {

        for (let outerIndex = 0; outerIndex < innerIndex; outerIndex++) {
            //console.log(analizedTables[innerIndex], analizedTables[outerIndex]);

            if (isRelationBetweenTables(db, analyzedSchema, analizedTables[innerIndex], analizedTables[outerIndex])) {
                let link = [analizedTables[innerIndex], analizedTables[outerIndex]];
                tablesLinks.push(link);
            }
        }
    }
    return tablesLinks;
}

// возращает всю информацию о сущностях(таблицах),
// которые учавсттвуют в отношениях
function getRelationsInfo(db, analyzedSchema) {
    var indTable = getIndependentTables(db, analyzedSchema)[0];
    getSequenceForView(db, analyzedSchema, indTable);
    //console.log(analizedTables);
    var relationsInfo = [];
    var columns;
    var relations = getRelations(db, analyzedSchema);
    return relations;
}

// даёт имя для колонки колонки с учётом порядка следования таблиц в структуре
function getColumnNameForView(db, analyzedSchema, columnName, tableName, tablesArray) {
    let newColumnName = tableName + '.' + columnName;
    //let newColumnName = tableName;

    if (tablesArray.indexOf(tableName) > 0) {
        newColumnName = newColumnName + ' AS ' + '"';
        let pseudonimPart = tableName + '.' + columnName;
        let lastTable = tableName; // последняя таблица, участвующая в отношении

        for (let tableIndex = tablesArray.indexOf(tableName) - 1; tableIndex > 0; tableIndex--) {

            let relationNext = isRelationBetweenTables(db,
                analyzedSchema,
                tablesArray[tableIndex],
                lastTable);
            //console.log(tablesArray[tableIndex], lastTable, relationNext);
            if (relationNext)  {
                pseudonimPart = tablesArray[tableIndex] + '.' + pseudonimPart;
                //branch = false;
                lastTable = tablesArray[tableIndex];
            }

        }
        newColumnName += pseudonimPart + '"';
        //console.log(newColumnName);
    }

    return newColumnName;
}