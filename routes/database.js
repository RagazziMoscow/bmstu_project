var databases = require('./../models/databases'); // Databases list
var dbschemas = require('./../models/schemas');

module.exports.dbList = function(req, res) {

  databases.list(function(dbList) {

    res.render('databases/list', {
      data: {
        title: "Подключённые БД",
        list: dbList
      }
    });

  });


};

module.exports.schemasList = function(req, res) {

  var schemas = dbschemas(req.body.dbname);
  schemas.list(function(schemasList) {
    //console.log(schemasList);
    res.render("schemas/list", {
      data: {
        title: "Схемы",
        database: req.body.dbname,
        list: schemasList
      }
    });
  });

};