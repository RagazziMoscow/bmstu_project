// получаем таблицу
function getTable(db, analyzedSchema, tableName) {
    return db.schemas.get(analyzedSchema).tables.get(tableName);
}



// получаем колонки таблицы
function getTableColumns(db, analyzedSchema, tableName) {
    var table = getTable(db, analyzedSchema, tableName);
    return Array.from(table.columns.keys());
}


module.exports.getTable = getTable;
module.exports.getTableColumns = getTableColumns;