$(document).ready(function() {
  $(".answers__list__item").on("click", function() {
    $(this).
    find("p").
    find(".answers__list__item__radio").
    find("input").
    trigger("click");
  });
});