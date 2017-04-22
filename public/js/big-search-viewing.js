function view(data) {
  var source = $("#view-template").html();
  var template = Handlebars.compile(source);
  $("#results").html(template(data));
}