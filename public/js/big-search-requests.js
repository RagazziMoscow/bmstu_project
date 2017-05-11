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
  function saveTemplate(e) {
    e.preventDefault();
    var ajax_url = $(this).data('ajax');
    var name = $('#name-template').val();
    var id = $('#id-template').val();
    var json_data = encodeURIComponent($('#json-template').val());
    if (name == '') {
      alert("Пустое имя шаблона!");
      $('#name-template').css('border-color', 'red');
    } else {
      $('#name-template').css('border-color', 'none');
      if (json_data == '') {
        alert("Пустая строка запроса!");
      } else {
        console.log(name, id, ajax_url);
        $.ajax({
          type: "POST",
          data: "name=" + name + "&id=" + id + "&sql=" + json_data,
          url: ajax_url + id,
          success: function(data) {
            if (data > 0) {
              alert('Шаблон успешн сохранен');
            } else if (data == -1) {
              alert('Шаблон с таким именем уже сохранен');
            } else {
              alert('Ошибка' + data);
            }
          }
        })
      }
    }


  }