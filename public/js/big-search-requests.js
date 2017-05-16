  $(document).ready(function() {
    // подгружаем массив дескрипторов для поиска


    /*
    $.ajax({
      type: "POST",
      url: "/search-data",
      data: {
        dbname: $('#database').text(),
        schemaname: $('#schema').text(),
      },
      success: function(data) {
        DescriptorsData = data;
      }
    });
    */
    DescriptorsData.database = $("#database").html();
    DescriptorsData.schema = $("#schema").html();
    DescriptorsData.viewColumns = JSON.parse($("#view-columns").html());

  });


  /**
   * Удаление пустых групп в массиве условий
   * @param  Array JsonData массив условий
   * @return Array очищенный массив условий
   */
  function filterJsonData(JsonData) {
    var validData = JsonData.filter(function(group) {
      return (group.length != 0);
    });

    return validData;
  }

  /**
   * Запрос на поиск
   * @return undefined
   */
  function sendQuery() {

    if (!JsonDataIsEmpty()) {
      $('#json-template').val(JSON.stringify(filterJsonData(JsonData)));
      $.ajax({

        type: "POST", //метод запроса, POST или GET (если опустить, то по умолчанию GET)
        url: "/query-data", //серверный скрипт принимающий запрос

        data: {
          request: JSON.stringify(filterJsonData(JsonData)),
          searchData: JSON.stringify({
            database: $('#database').text(),
            schema: $('#schema').text(),
            viewColumns: DescriptorsData.viewColumns
          })
        },
        beforeSend: function() {

          disableItems();
          showOverlay();
          $(".loader").show();
        },
        complete: function() {

          hideOverlay();
          enableItems();
          $(".loader").hide();
        },
        success: function(data) {

          SearchResults.conditions = JsonData.slice(0); //копируем
          SearchResults.results = data;

          //функция передаёт данные шаблонизатору
          view(SearchResults);

        }
      });
    } else {
      alert("Задайте условия для поиска");
    }

  }



  // Cохранение шаблонов со страницы расширенного поиска
  function saveTemplate() {

    var templateName = $(this).siblings(".input").val();

    if (!JsonDataIsEmpty() && templateName != "") {
      var templateData = JSON.stringify(JsonData);
      var database = $("#database").text();
      var schema = $("#schema").text();
      var table = $("#table").text();
      var viewColumns = $("#view-columns").text();

      $.ajax({
        type: "POST",
        url: "/save-template",
        data: {
          name: templateName,
          json: templateData,
          searchData: {
            database: database,
            schema: schema,
            table: table,
            viewColumns: viewColumns

          }
        },

        beforeSend: function() {

          disableItems();
          showOverlay();
          $(".loader").show();
        },
        complete: function() {

          hideOverlay();
          enableItems();
          $(".loader").hide();
        },
        success: function(data) {

          $(this).parent().siblings('.message').find('span').text('Шаблон сохранён');
          $(this).parent().siblings('.message').show().delay(1500).fadeOut(500);
          //alert("Шаблон сохранён");
        }

      });

    } else {

      //alert("Задайте условия поиска и укажите имя шаблона");
      $(this).parent().siblings('.message').find('span').text('Ошибка при сохранении');
      $(this).parent().siblings('.message').show().delay(1500).fadeOut(500);

    }

  }