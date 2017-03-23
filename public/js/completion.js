$(document).ready(function() {
  $(".answers__list__item").on("click", function(event) {
    var node = $(this).
    find("p").
    find(".answers__list__item__radio").
    find("input");

    if ( !$(event.target).is(node)) {
    	node.trigger("click");
    }
  });
});