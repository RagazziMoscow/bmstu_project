var databaseRoutes = require('./database');
var structureRoutes = require('./structure');
var bigsearchRoutes = require('./bigsearch');
var templatesRoutes =require('./templates');


module.exports = function(app) {



  app.get("/", function(req, res) {
    res.redirect("/databases");
  });

  /*database*/
  app.get('/databases', databaseRoutes.dbList);

  app.post("/dbschemas", databaseRoutes.schemasList);



  /*structure*/
  app.post("/tables", structureRoutes.tablesList);

  app.post("/columns", structureRoutes.createView);

  //app.get("/columns", structureRoutes.loadView);



  /*bigsearch*/
  app.post("/bigsearch", bigsearchRoutes.main);

  app.post("/query-data", bigsearchRoutes.searchQuery);

  app.get("/completion", bigsearchRoutes.requestCompletion);

  app.post("/completion", bigsearchRoutes.complete);




  /*templates*/
  app.post("/save-template", templatesRoutes.saveTemplate);

  app.get("/edit-template", templatesRoutes.editTemplate);

  app.get("/delete-template", templatesRoutes.deleteTemplate)

  app.get("/templates", templatesRoutes.templatesList);



  app.get("/cekavo", function(req, res) {
    res.status(200).send("1312 чё каво");
  });


  app.get('*', function(req, res) {
    res.status(404).send("Sorry cant find that!");
  });



}