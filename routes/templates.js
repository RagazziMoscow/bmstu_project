module.exports.saveTemplate = function(req, res) {

  var templates = require("./../models/templates");
  var templateData = {
    name: req.body.name,
    data: req.body.json,
    database: req.body.searchData.database,
    schema: req.body.searchData.schema,
    table: req.body.searchData.table,
    viewColumns: req.body.searchData.viewColumns
  }

  templates.save(templateData, req.user.user_id, function() {
    res.status(200).send("OK...");
  });

}


module.exports.templatesList = function(req, res) {

  var templates = require("./../models/templates");
  var userId = req.query.user_id;

  templates.list(userId, function(list) {
    console.log(list);
    res.render("templates/list", {
      data: {
        title: "Шаблоны поиска",
        templates: list,
        user: req.user
      }
    });
  });

}