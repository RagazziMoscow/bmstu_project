var path = require('path'),
  databases = require('./../models/databases'), // Databases list
  structure = require("./../models/structure");


module.exports = function(app) {

  app.set('views', path.join(__dirname, './../views'));



  app.get("/", function(req, res) {
    res.redirect("/databases");
  });

  app.get('/databases', function(req, res) {

    databases.list(function(dbList) {
      //console.log('ce kavo', dbList);
      //for(var i = 0; i<dbList)
      res.render('databases/dbList', {
        data: dbList
      });

    });


  });



  app.post("/dbschemas", function(req, res) {

    //console.log(req.body.dbname);
    var schemas = require('./../models/schemas')(req.body.dbname);
    schemas.list(function(schemasList) {
      //console.log(schemasList);
      res.render("schemas/dbschemaslist", {
        data: {
          database: req.body.dbname,
          list: schemasList
        }
      });
    });

  });



  app.post("/structure", function(req, res) {
    var dbStruct = structure(req.body.dbname, req.body.schemaname);
    //dbStruct.deleteView();
    dbStruct.createView((columns) => {
      res.render("structure/dbstructure", {
        data: {
          database: req.body.dbname,
          schema: req.body.schemaname,
          columns: columns
        }
      });
    });
    //dbStruct.getViewColumns();

    /*
    let viewColumns = dbStruct.createView();
      res.render("structure/dbstructure", {
        data: {
          database: req.body.dbname,
          schema: req.body.schemaname,
          columns: ['1312']
        }
      });

    */
  });

  app.get("/cekavo", function(req, res) {
    res.status(200).send("1312 чё каво");
  });

  app.get('*', function(req, res) {
    res.status(404).send("Sorry cant find that!");
  });

}