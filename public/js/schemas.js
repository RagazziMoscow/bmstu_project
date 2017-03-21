$(document).ready(function() {
  $(".dbschemas__list__item").on("click", function() {
    $(this).
    find("p").
    find(".dbschemas__list__item__schema-name").
    find("input").
    trigger("click");
  });
});