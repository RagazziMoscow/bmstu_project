$(document).ready(function() {
  $(".dbschemas__list__item").on("click", function(event) {
    var node = $(this).
    find("p").
    find(".dbschemas__list__item__schema-name").
    find("input");

    if ( !$(event.target).is(node) ) {
    	node.trigger("click");
    }
  });
});