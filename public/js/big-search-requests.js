  $(document).ready(function() {
    // подгружаем массив дескрипторов для поиска
    $.ajax({
      type: "POST",
      url: "/search-data",
      success: function(data) {
        DescriptorsData = data;
      }
    });

    $.ajax({
      type: "GEt",
      url: "js/big-search-view-template.js",
      success: function(data) {
        $('#view-template').html(data.toString());
      }
    });
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
            schema: $('#schema').text()
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

          //функция передаёт данные шаблонизатору
          view(data);

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