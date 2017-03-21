$(document).ready(function() {


  $(".installed-databases__list__item").on("click", function() {
    console.log("Нажали");
    $(this).
    find("p").
    find(".installed-databases__list__item__dbname").
    find("input").trigger("click");

  });

});