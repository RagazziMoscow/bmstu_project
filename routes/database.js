var databases = require('./../models/databases'); // Databases list
var dbschemas = require('./../models/schemas');

module.exports.dbList = function(req, res) {

  databases.list(function(dbList) {

    res.render('database/dbList', {
      data: {
        title: "Подключённые БД",
        list: dbList,
        user: req.user.login
      }
    });

  });


};

module.exports.schemasList = function(req, res) {

  var schemas = dbschemas(req.body.dbname);
  schemas.list(function(schemasList) {
    //console.log(schemasList);
    res.render("database/schemasList", {
      data: {
        title: "Схемы",
        database: req.body.dbname,
        list: schemasList,
        user: req.user.login
      }
    });
  });

};