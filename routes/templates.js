var structure = require("./../models/structure");

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

module.exports.deleteTemplate = function(req, res) {

  var templates = require("./../models/templates");
  var templateId = req.query.template_id;

  templates.remove(templateId, function() {
    res.redirect("/templates?user_id=" + req.user.user_id);
  });

}

module.exports.editTemplate = function(req, res) {
  var templates = require("./../models/templates");
  var templateId = req.query.template_id;

  templates.load(templateId, req.user.user_id, function(templateData) {

    dbStruct = structure(templateData.database, templateData.schema);
    dbStruct.checkViewExisting(function(view) {

      if (view) {

        dbStruct.deleteView(function() {

          dbStruct.getView((columns) => {

            res.render("bigsearch/bigsearch", {
              data: {
                title: "Поиск",
                searchData: {
                  templateId: templateData.template_id,
                  templateName: templateData.name,
                  templateContent: JSON.parse(templateData.data),
                  database: templateData.database,
                  schema: templateData.schema,
                  table: templateData.table,
                  viewColumns: JSON.parse(templateData.view_columns)
                },
                loadTemplate: true,
                user: req.user

              }
            });

          }, templateData.table);

        });

      } else {

        dbStruct.getView((columns) => {

          res.render("bigsearch/bigsearch", {
            data: {
              title: "Поиск",
              searchData: {
                templateId: templateData.template_id,
                templateName: templateData.name,
                templateContent: JSON.parse(templateData.data),
                database: templateData.database,
                schema: templateData.schema,
                table: templateData.table,
                viewColumns: JSON.parse(templateData.view_columns)
              },
              loadTemplate: true,
              user: req.user

            }
          });

        }, templateData.table);

      }


    });
  })


}


module.exports.templatesList = function(req, res) {

  var templates = require("./../models/templates");
  var userId = req.query.user_id;
  console.log(templates);

  templates.list(userId, function(list) {
    //console.log(list);
    res.render("templates/list", {
      data: {
        title: "Шаблоны поиска",
        templates: list,
        user: req.user
      }
    });
  });

}