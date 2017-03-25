$(document).ready(function() {
  $(".dbtables__list__item").on("click", function(event) {
    var node = $(this).
    find("p").
    find(".dbtables__list__item__table-name").
    find("input");

    if ( !$(event.target).is(node) ) {
      node.trigger("click");
    }
  });
});