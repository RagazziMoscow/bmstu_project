var structure = require("./../models/structure");
var search = require("./../bigsearch");


module.exports.main = function(req, res) {

  // пересечение всех колонок с типами данных с тем, что отметили
  var searchData = search.select(req);
  req.session.viewColumns = searchData;

  res.render("bigsearch/bigsearch", {
    data: {
      title: "Поиск",
      searchData: {
        database: req.body.dbname,
        schema: req.body.schemaname,
        viewColumns: searchData
      }
    }
  });

};

/*
app.post("/search-data", function(req, res) {

  res.json({
    viewColumns: req.session.viewColumns
  });

});
*/

module.exports.searchQuery = function(req, res) {

  var conditions = req.body.request;

  var searchDataParams = {
    database: JSON.parse(req.body.searchData).database,
    schema: JSON.parse(req.body.searchData).schema
  };

  var columns = JSON.parse(req.body.searchData).viewColumns;
  search.search(conditions, columns, searchDataParams, (searchResults) => {
    res.json({
      data: {
        rows: searchResults
      }
    });

  });

};

module.exports.requestCompletion = function(req, res) {
  res.render("bigsearch/completion", {
    data: {
      title: "Завершение поиск",
      searchData: {
        database: req.param("dbname"),
        schema: req.param("schemaname")
      }
    }
  });
};

module.exports.complete = function(req, res) {
  var dbStruct = structure(req.body.dbname, req.body.schemaname);
  // если надо, то удаляем представление
  if (Boolean(Number(req.body.answerValue))) {
    dbStruct.deleteView();
  }
  res.redirect("/databases");
};