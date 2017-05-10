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

  // вешаем загрузку файлов на кнопки экспорта
  $("#export-xml").on("click", function() {
    var file = new File(["Hello, world!"], "hello world.txt", {
      type: "text/plain;charset=utf-8"
    });
    saveAs(file);
  });
  $("#export-json").on("click", function() {
    var file = new File(["Hello, world!"], "hello world.txt", {
      type: "text/plain;charset=utf-8"
    });
    saveAs(file);
  });
}