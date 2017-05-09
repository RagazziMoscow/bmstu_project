var viewProperties = {
  showNullValues: true,
  separateByBr: true
};

$(document).ready(function() {
  $('.property-null-option input:last').trigger('click');
  $('.property-separators-option input:first').trigger('click');

  $('.property-null-option input').on('click', function() {
    viewProperties.showNullValues = Boolean(Number($(this).val()));
  });

  $('.property-separators-option input').on('click', function() {
    viewProperties.separateByBr = Boolean(Number($(this).val()));
  });


});

function view(data) {
  var source = $("#view-template").html();
  var template = Handlebars.compile(source);
  $("#results").html(template({
    data: data,
    properties: viewProperties
  }));
}