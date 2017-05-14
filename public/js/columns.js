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

  $(".columns-info__list__item__column-info").each(function(item) {
    var columnName = $(this).find(".columns-info__list__item__column-info__name");
    var words = columnName.text().trim().split(".");
    var div = $(this).find(".columns-info__list__item__column-info__name");
    if (words.length != 1) {
      div.find("span").first().remove();
      words.forEach(function(wordItem) {
        div.append("<span class='column-name-span'>" + wordItem + "</span>");
        //alert(wordItem);

      });
      //words.forEach(function(w))
    }
  });

});