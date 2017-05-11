$(document).ready(function() {
  $(".columns-info__list__item").on("click", function(event) {
    var node = $(this).
    find("p").
      //find(".dbtables__list__item__table-name").
    find("input");

    if (!$(event.target).is(node)) {
      node.trigger("click");
    }
  });

  $("#select-all").on("click", function(event) {
    $(".columns-info__list__item__column-info input").prop("checked", true);
  });

  $("#disable-all").on("click", function(event) {
    $(".columns-info__list__item__column-info input:checked").prop("checked", false);
  });

});