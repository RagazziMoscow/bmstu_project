/*Параметры модальных окон для css*/
var modalParam = {
  "top": "200px",
  "left": "407px"
};



/*Параметры дескрипторов в интерфейсе для вставки значков конъюнкций*/
var descrParam = {
  "position": "relative",
  "marginLeft": "30px"
};

//Глобальный массив для условий
JsonData = [];

DescriptorsData = [];


//Список для окна редактирования формы
var listBox = "<option selected='selected' disabled=''" +
  " value='default'>Отношение</option>" +
  "<option value='='>=</option>" +
  "<option value='!='>!=</option>" +
  "<option value='>'>></option>" +
  "<option value='<'><</option>" +
  "<option value='like'>~</option>";

// Данные для окна просмотра всех групп
var viewProperties = {
  1: {
    "title": "Теги",
    "class": "included-tags"
  },
  2: {
    "title": "Атрибуты",
    "class": "included-attributes"
  },
  3: {
    "title": "Отсутствие тегов",
    "class": "included-not-tags"
  }
};

//Классы дексрипторов в интерфейсе для поиска
var descClassses = {
  "1": "tag",
  "2": "attr",
  "3": "not-tag"
};

//настройки и свойства для окна редактирования формы
var descProperties = {
  "1": {
    "div": "tag-edit",
    "input": "edit-input-tag",
    "width": 320,
    "param": 1,
    "view": "included-tags"
  },
  "2": {
    "div": "attr-edit",
    "input": "edit-input-attr",
    "width": 180,
    "param": 2,
    "view": "included-attributes"
  },
  "3": {
    "div": "not-tag-edit",
    "input": "edit-input-not-tag",
    "width": 320,
    "param": 1,
    "view": "included-not-tags"
  }
};



$(init);
$(document).ready(function() {
  if ($("#id-template-alert").val()) {
    load_template($("#id-template-alert").val());
    // alert( $("#id-template-alert").val() );
  }
});

function init() {
  addNewArray(); //Добавляем группу для нулевой формы
  $('#groupsAdder').on('click', addForm);
  $('#groups-viewer').on('click', {
      id: "#view-groups",
      name: ""
    },
    showWindow);
  $('#properties').on('click', {
    id: "#view-properties",
    name: ""
  }, showWindow);
  $('.save-templates-from-bigsearch').click(saveTemplate);

  //$('#btn').on('click',ser_request);
  $("#btn").on("click", sendQuery);

  /*Модальные окна*/
  clearInputs();
  $('.add-tag').on("click", {
      id: "#modal-tags-add",
      name: GetLastFormId()
    },
    showWindow);
  $(".add-attr").on("click", {
      id: "#modal-attr-add",
      name: GetLastFormId()
    },
    showWindow);
  $(".add-not-tag").on("click", {
      id: "#modal-not-tags-add",
      name: GetLastFormId()
    },
    showWindow);
  $(".edit-group").on("click", {
      id: "#edit-group",
      name: GetLastFormId(),
      edit: true
    },
    showWindow);
  $(".check").on("click", {
      id: "#edit-group",
      name: GetLastFormId(),
      edit: false
    },
    showWindow);

  $(".modal-close").on("click", closeWindow);
  $(".add-action-button").on("click", addDescriptor);
  $(".edit-action-button").on("click", editForm);

  /*
    $("#input-tag").autocomplete({
      serviceUrl: '/bigsearch/ajaxAutocompleteProcess',
      minChars: 2, // Минимальная длина запроса для срабатывания автозаполнения
      maxHeight: 400, // Максимальная высота списка подсказок, в пикселях
      width: 320, // Ширина списка
      zIndex: 9999, // z-index списка
      deferRequestBy: 300, // Задержка запроса (мсек), на случай, если мы не хотим слать миллион запросов, пока пользователь печатает. Я обычно ставлю 300.
      params: {
        id: 1
      },
      zIndex: 7,
      appendTo: $("#input-tag").parent().siblings(".autocomplete-aligm") // Дополнительные параметры

    });

    $("#input-attr").autocomplete({
      serviceUrl: '/bigsearch/ajaxAutocompleteProcess',
      minChars: 2, // Минимальная длина запроса для срабатывания автозаполнения
      maxHeight: 400, // Максимальная высота списка подсказок, в пикселях
      width: 320, // Ширина списка
      zIndex: 9999, // z-index списка
      deferRequestBy: 300, // Задержка запроса (мсек), на случай, если мы не хотим слать миллион запросов, пока пользователь печатает. Я обычно ставлю 300.
      params: {
        id: 2
      },
      zIndex: 7,
      appendTo: $("#input-attr").parent().siblings(".autocomplete-aligm") // Дополнительные параметры

    });

    $("#input-not-tag").autocomplete({
      serviceUrl: '/bigsearch/ajaxAutocompleteProcess',
      minChars: 2, // Минимальная длина запроса для срабатывания автозаполнения
      maxHeight: 400, // Максимальная высота списка подсказок, в пикселях
      width: 320, // Ширина списка
      zIndex: 9999, // z-index списка
      deferRequestBy: 300, // Задержка запроса (мсек), на случай, если мы не хотим слать миллион запросов, пока пользователь печатает. Я обычно ставлю 300.
      params: {
        id: 1
      },
      zIndex: 7,
      appendTo: $("#input-not-tag").parent().siblings(".autocomplete-aligm") // Дополнительные параметры

    });

    */



}



/*Функции интерфейса*/


/*Обработка идентификаторов форм*/
/*x - идентификатор формы(строка)*/
function idProcess(x) {
  var number = Number(x.substr(-1));
  return number;
}

/*Нормализует id всех форм после удаления одной из них*/
function normalizeForms() {
  //нормализуем id у каждой формы
  $(".main form").each(function(i) {
    $(this).attr("id", "form" + i);
  });

  //нормализуем обработчики событий на кнопки управления условиями
  $(".add-tag").each(function() {
    $(this).off("click", showWindow);
    $(this).on("click", {
      id: "#modal-tags-add",
      name: $(this).parent().parent().attr("id")
    }, showWindow);
  });
  $(".add-attr").each(function() {
    $(this).off("click", showWindow);
    $(this).on("click", {
      id: "#modal-attr-add",
      name: $(this).parent().parent().attr("id")
    }, showWindow);
  });
  $(".add-not-tag").each(function() {
    $(this).off("click", showWindow);
    $(this).on("click", {
      id: "#modal-not-tags-add",
      name: $(this).parent().parent().attr("id")
    }, showWindow);
  });
  $(".check").each(function() {
    $(this).off("click", showWindow);
    $(this).on("click", {
      id: "#edit-group",
      name: $(this).parent().parent().attr("id"),
      edit: false
    }, showWindow);
  });
  $(".edit-group").each(function() {
    $(this).off("click", showWindow);
    $(this).on("click", {
      id: "#edit-group",
      name: $(this).parent().parent().attr("id"),
      edit: true
    }, showWindow);
  });
}


/*Очистка всех инпутов в модальных окнах*/
function clearInputs() {
  $(".input").each(function() {
    //if (this.tagName)
    //console.log($(this)[0].nodeName);
    if ($(this)[0].nodeName == "INPUT") {
      $(this).val("");
    } else {
      $(this).val('default');
    }
  });
  $(".rel-select").val("default");
}

/*Деактивирует все элементы управления
по работе с условиями поиска на время появления модального окна*/
function disableItems() {
  $(".content-action").css("pointer-events", "none");
  $(".remove").css("pointer-events", "none");
}

/*Восстанавливает все элементы управления
по закрытию модального окна*/
function enableItems() {
  $(".content-action").css("pointer-events", "auto");
  $(".remove").css("pointer-events", "auto");
}


/*Закрытие окна*/
function closeWindow(event) {
  $(this).parent().hide();
  hideOverlay();
  enableItems();
}

/*Отображение окна*/
function showWindow(event) {
  var id = event.data.id;
  var name = event.data.name;
  var editMode = event.data.edit;

  // при добавлении дескрипторов заполняем списки дескрипторов
  if (id == "#modal-tags-add") {
    fillListWithDescriptors($(id).find(".modal-content").find("#input-tag"));
  }
  if (id == "#modal-not-tags-add") {
    fillListWithDescriptors($(id).find(".modal-content").find("#input-not-tag"));
  }
  if (id == "#modal-attr-add") {
    fillListWithDescriptors($(id).find(".modal-content").find("#input-attribut"));
  }
  // подготовка интерфейса окна редактирования формы
  if (id == "#edit-group") {
    editFormWindowProcess(idProcess(name), editMode);
  }
  if (id == "#view-groups") {
    viewGroupsProcess();
    $(id).show();
    disableItems();
    showOverlay();
    return;
  }

  $(id).css(modalParam).show();
  $(id + " .modal-content .form-id").attr("name", idProcess(name));
  disableItems();
  showOverlay();
}

/*Показывают и скрывают фон для модальных окон*/
function showOverlay() {
  $(".overlay").show();
}

function hideOverlay() {
  $(".overlay").hide();
}
/*Выполняет заполнение списка дескрипторами*/
function fillListWithDescriptors(listBox) {

  // добавляем дескрипторы в список только если ещё не добавляли их
  let optionsCount = $(listBox).children("option").length;
  if (optionsCount < DescriptorsData.viewColumns.length) {
    DescriptorsData.viewColumns.forEach((item) => {
      $(listBox).append("<option value='" + item.column_name + "' data-description='" + item.data_type + "' >" + item.column_name + "</option>");
    });
  }

}

/*Выполняет подготовку интерфейса окна редактирования дескриптора*/
function editDescWindowProcess(group, id, name) {
  $("#modal-edit-descriptor .modal-content").
  append("<input type='text' class='edit-desc input' />");
  $("#modal-edit-descriptor .modal-content").
  append("<input type='hidden' class='descriptor-id' name='" + id + "'/>");
  $("#modal-edit-descriptor .modal-content").
  append("<input type='hidden' class='form-id' />");

}

/*Выполняет подготовку интерфейса окна редактирования формы*/
function editFormWindowProcess(group, editMode) {

  //Очищаем форму интерфейс от результатов предыдущей работы
  $("#edit-group #descriptors").html("");
  $("#edit-group #descriptors").css("overflow-y", "visible");
  $("#edit-group .edit-action").hide();


  var groupArray = getArray(group);


  //Если пока нету дескрипторов для поиска
  if (groupArray.length == 0) {
    $("#edit-group #descriptors").
    append("<p class='no-desc'>Дескрипторы не добавлены</p>");
    if (!editMode) {
      $("#edit-group .title").text("Просмотр группы");
    }
    return;
  }

  //Собираем все дескрипторы
  groupArray.forEach(function(item, i, arr) {
    $("#edit-group #descriptors").
    append("<div class='descriptor-item'></div>");

    $("#edit-group .descriptor-item:last").
    addClass(descProperties[item["id"]]["div"]);

    $("#edit-group .descriptor-item:last").
    append("<div class='autocomplete-aligm'></div>");

    $("#edit-group .descriptor-item:last").
    append("<select class='" + descProperties[item["id"]]["input"] +
      " input'></select>");
    fillListWithDescriptors("#edit-group .descriptor-item:last select:last");

    /*

    //Вешаем автодополнение на каждый инпут
    $("#edit-group .descriptor-item:last .input").autocomplete({
      serviceUrl: '/bigsearch/ajaxAutocompleteProcess',
      minChars: 2, // Минимальная длина запроса для срабатывания автозаполнения
      maxHeight: 400, // Максимальная высота списка подсказок, в пикселях
      width: descProperties[item["id"]]["width"], // Ширина списка
      zIndex: 9999, // z-index списка
      deferRequestBy: 300, // Задержка запроса (мсек), на случай, если мы не хотим слать миллион запросов, пока пользователь печатает. Я обычно ставлю 300.
      params: {
        id: descProperties[item["id"]]["param"]
      },
      zIndex: 7,
      appendTo: $("#edit-group .descriptor-item:last .input").
      siblings(".autocomplete-aligm") // Дополнительные параметры

    });
*/
    //при изменении значения помечаем каждый инпут
    $("#edit-group .descriptor-item:last .input").
    on("change", function() {
      $(this).parent().addClass("descriptor-item-changed");
    });

    //Если атрибут, то добавляем список
    if (item["id"] == 2) {
      $("#edit-group .descriptor-item:last").
      append("<select name='relation' class='rel-select'></select>");

      $("#edit-group select:last").append(listBox);
      $("#edit-group select:last").val(item["relation"]);
      $("#edit-group .descriptor-item:last").append("<input type='text' " +
        " class='attr-number input' />");
      $("#edit-group .descriptor-item:last .attr-number").val(item["number"]);

      $("#edit-group .descriptor-item:last .attr-number").
      on("change", function() {
        $(this).addClass("number-changed");
        $(this).parent().addClass("descriptor-item-changed");
      });

      $("#edit-group .descriptor-item:last .rel-select").
      on("change", function() {
        $(this).addClass("select-changed");
        $(this).parent().addClass("descriptor-item-changed");
      });
    }
    //Загружаем имя дескриптора
    $("#edit-group .descriptor-item:last .input:first").val(item["name"]);

    //Добавляем скрытые инпуты для хранения параметров
    $("#edit-group .descriptor-item:last").
    append("<input type='hidden'" +
      "class='descriptor-id' name='" + item["id"] + "'/>");
    $("#edit-group .descriptor-item:last").
    append("<input type='hidden'" +
      "class='descriptor-name' name='" + item["name"] + "'/>");
    $("#edit-group .descriptor-item:last").
    append("<input type='hidden'" +
      "class='descriptor-type' name='" + item["type"] + "'/>");
  });

  if (JsonData[group].length > 5) {
    $("#descriptors").css({
      "max-height": "350px",
      "overflow-y": "auto"
    });
  }

  //Если открываем только для просмотра без редактирования
  if (editMode == true) {
    $("#edit-group .edit-action").show();
    $("#edit-group #descriptors").css("pointer-events", "auto");
    $("#edit-group .title").text("Редактировать группу");
  } else {
    $("#edit-group #descriptors").css("pointer-events", "none");
    $("#edit-group .title").text("Просмотр группы");
  }
}

// Подготавливает окно просмотра всех групп
function viewGroupsProcess() {

  $('#view-groups .groups-aligment').html('');
  if (JsonDataIsEmpty()) {
    $('#view-groups .groups-aligment').append("<p class='empty-content'>Добавьте дескрипторы</p>");
    return;
  }

  JsonData.forEach(function(group, i, arr) {
    if (group.length == 0) {
      return;
    }
    $('#view-groups .groups-aligment').append("<div class='conditions-group'></div>");
    if (i !== 0) {
      $(".groups-aligment .conditions-group:last").append("<div class='disjunction'></div>");
    }
    //$(".groups-aligment .conditions-group:last").append(viewProperties) ;

    var controlArr = [1, 2, 3];


    var groupArr = group;
    controlArr.forEach(function(item, i, arr) {

      // Проверяем содержание всех дескрипторов в группе
      // Если необходимо, для каждого класса дескрипторов добавляем секцию
      var count = descriptorsCount(groupArr, item);
      if (count !== 0) {
        $("#view-groups .groups-aligment .conditions-group:last").append("<div class='" + viewProperties[item]["class"] + "'></div>");
        $("#view-groups .groups-aligment .conditions-group:last ." + viewProperties[item]["class"]).
        append("<div class='included-title'><p>" + viewProperties[item]["title"] + "</p></div>");
        $("#view-groups .groups-aligment .conditions-group:last ." + viewProperties[item]["class"]).
        append("<div class='" + viewProperties[item]["class"] + "-content'>");
      }
    });

    group.forEach(function(item, i, arr) {

      var itemValue = '';
      var itemClass = descProperties[item["id"]]["view"];
      if (item["id"] != 2) {

        itemValue = item["name"];

      } else {
        itemValue = item["name"] + " " + item["relation"] + " " + item["number"];
      }
      $(".groups-aligment .conditions-group:last ." +
        itemClass + " ." +
        itemClass + "-content").append("<div class='item'><span class='value'>" +
        itemValue + "</span></div>");

    });

  });


}



/*Добавляет дескриптор*/
function addDescriptor(event) {
  group = $(this).siblings(".form-id").attr("name");


  idPar = $(this).siblings(".descriptor-id").attr("name"); // идентификатор
  namePar = $(this).siblings(".input").val(); // имя дескриптора
  numPar = $(this).siblings(".attr-number").val(); // для атрибута
  relPar = $(this).siblings(".rel-select").val(); // для атрибута
  typePar = $(this).siblings('.input').find('option:selected').attr('data-description');
  console.log("Добавление: ", group, idPar, namePar, numPar, relPar);

  //если такого дескриптора нету ещё в форме
  if (checkJsonData(group, idPar, namePar, relPar, numPar)) {

    // добавляем дескриптор в массив условий поиска
    addJsonData(group, idPar, namePar, numPar, relPar, typePar);

    // если есть надпись о том,что надо добавить дескрипторы, то удаляем её
    if ($("#form" + group + " .descriptors-content p").is(".empty-content")) {
      $("#form" + group + " .descriptors-content .empty-content").detach();
    }

    // добавляем ескриптор в интерфейс (в конец блока с классом descriptors-content)

    $("#form" + group + " .descriptors-content").
    append("<div class='item'><span class='value'>" + namePar + "</span>" +
      "<span class='edit'></span>" +
      "<span class='remove'>×</span>" +
      "</div>");
    // если добавляем атрибут, то дописываем операцию сравнения и значение
    if (idPar != 2) {} else {
      $("#form" + group + " .descriptors-content .item:last .value").
      after("<span class='attr-rel'>" + relPar + " </span>" +
        "<span class='attr-num'>" + numPar + " </span>");
    }

    // если дескриптор не первый в форме, то добавляем значки конъюнкции
    if (getGroupCount(group) >= 2) {
      $("#form" + group + " .descriptors-content .item:last").css(descrParam);
      $("#form" + group + " .descriptors-content .item:last").
      append("<div class='conjunction'></div>");
    }

    // присваиваем класс дескрипторам
    $("#form" + group + " .item:last").addClass(descClassses[Number(idPar)]);

    $("#form" + group + " .item:last span.remove").on("click", deleteDescriptor);
    $("#form" + group + " .item:last span.remove").css("pointer-events", "none");
    clearInputs();

    // выводим сообщение, что добавлено
    $(this).siblings('.message').find('span').text('Дескриптор добавлен');
    $(this).siblings('.message').show().delay(1500).fadeOut(500);
  } else {

    // выводим сообщение, что добавлено
    $(this).siblings('.message').find('span').text('Ошибка при добавлении');
    $(this).siblings('.message').show().delay(1500).fadeOut(500);

  }

}

/*Удаление дескриптор*/
function deleteDescriptor(event) {

  //для удаления значков конъюнкции
  var deleteConjunction = false;

  // удаляем дескриптор из массива условий
  group = idProcess($(this).parent().parent().parent().attr("id"));
  name = $(this).siblings(".value").html();


  /*Переписать!!!*/


  var id;
  if ($(this).parent().hasClass("tag")) {
    id = 1;
  }
  if ($(this).parent().hasClass("attr")) {
    id = 2;
  }
  if ($(this).parent().hasClass("not-tag")) {
    id = 3;
  }

  //если удаляем нулевой дескриптор, то запоминаем это
  if (getItemPosition(group, id, name) == 0) {
    deleteConjunction = true;
  }

  deleteJsonData(group, id, name);

  // удаляем дескриптор из интерфейса
  $(this).parent().detach();

  //если надо, удаляем значок конъюнкции и возвращаем css свойства
  if (deleteConjunction) {
    $("#form" + group + " .descriptors-content .item:first .conjunction").detach();
    $("#form" + group + " .descriptors-content .item:first").css({
      "position": "static",
      "marginLeft": "7px"
    });
  }

  if (getGroupCount(group) == 0) {
    $("#form" + group + " .descriptors-content").
    append("<p class='empty-content'>Добавьте дескрипторы</p>");
  }

}

/*Обновляет дескриптор в интерфейсе*/
function updateDescriptor(group, id, name, namePar, relPar, numPar) {

  var descName = "#form" + group + " .descriptors-content ." + descClassses[id];

  // для атрибутов
  if (id == 2) {
    $(descName).
    filter(function(index) {
      if ($(this).find('.value').text() == namePar) return true;
    }).
    find('.attr-rel').text(relPar);

    $(descName).
    filter(function(index) {
      if ($(this).find('.value').text() == namePar) return true;
    }).
    find('.attr-num').text(numPar);
  }

  //находим по тексту элемент в интерфейсе и меняем ему текст
  $(descName).
  filter(function(index) {
    if ($(this).find(".value").text() == name) return true;
  }).
  find(".value").
  text(namePar);


}


/*Выполняет редактирование группы и соответствующей ей формы*/
function editForm(event) {

  //получаем номер группы
  var group = $(this).parent().siblings(".form-id").attr("name");

  $(this).parent().siblings("#descriptors").
  find(".descriptor-item-changed").
  each(function() {

    //достаём все параметры дексриптора
    var id = Number($(this).find(".descriptor-id").attr("name"));
    var name = $(this).find(".descriptor-name").attr("name");
    var namePar = $(this).find(".input").val();
    var numPar = $(this).find(".attr-number").val();
    var relPar = $(this).find(".rel-select").val();
    var typePar = $(this).find('.descriptor-type').attr("name");


    var editFlag = false; //Флаг о том, что редактирование было произведено

    //если такого дескриптора нет ещё в форме
    if (checkJsonData(group, id, namePar, relPar, numPar)) {

      //меняем дескриптор в массиве условий
      setItem(group, id, name, namePar, numPar, relPar, typePar);

      //обновляем дескриптор в интерфейсе
      updateDescriptor(group, id, name, namePar, relPar, numPar);
      //обновляем скрытый инпут с прошлым именем для дексриптора
      $(this).find(".descriptor-name").attr("name", namePar);
      editFlag = true;
    } else {
      //ищем помеченные к изменению списки отношений или значения для атрибутов

      if ($(this).find(".attr-number").hasClass("number-changed")) {
        setNumber(group, name, numPar);
        editFlag = true;
      }
      if ($(this).find(".rel-select").hasClass("select-changed")) {
        setRelation(group, name, relPar);
        editFlag = true;
      }

    }
    if (editFlag) {
      //обновляем дескриптор в интерфейсе
      updateDescriptor(group, id, name, namePar, relPar, numPar);
      $(this).parent().siblings('.message').find('span').text('Отредактировано');
      $(this).parent().siblings('.message').show().delay(1500).fadeOut(500);
    } else {
      $(this).parent().siblings('.message').find('span').text('Ошибка');
      $(this).parent().siblings('.message').show().delay(1500).fadeOut(500);
    }

  });
}



/*Добавляет новую форму*/
function addForm() {

  //добавляем новую группу в массив условий
  addNewArray();

  //добавляем новую форму в интерфейс
  var counter = idProcess(GetLastFormId());
  counter++;
  var newId = "form" + counter;
  $("#" + GetLastFormId()).after("<form></form>");
  $(".main form:last").attr("id", newId);
  $(".main form:last").addClass("descriptors-form");
  $("#" + newId).append("<div class='content-actions'></div>");
  $("#" + newId + " .content-actions").
  append("<p class='add-tag content-action click-button'>Добавить тег</p>");
  $("#" + newId + " .content-actions").
  append("<p class='add-not-tag content-action click-button'>Отсутствие тега</p>");
  $("#" + newId + " .content-actions").
  append("<p class='add-attr content-action click-button'>Добавить атрибут</p>");
  $("#" + newId + " .content-actions").
  append("<p class='check content-action click-button'>" +
    "<img src='/img/search.png' alt='Подробно' /></p>");
  $("#" + newId + " .content-actions").
  append("<p class='edit-group content-action click-button'>Редактировать группу</p>")
  $("#" + newId + " .content-actions").
  append("<p class='delete-group content-action click-button'>Удалить группу</p>");
  $("#" + newId).append("<div class='descriptors-content'></div>");

  $("#" + newId + " .descriptors-content").
  append("<p class='empty-content'>Добавьте дескрипторы</p>");

  //добавляем значок дизъюнкции
  $("#" + newId).css("marginTop", "110px");
  $("#" + newId).append("<div class='disjunction'></div>");


  //если в первой форме нету кнопки удаления, то добавляем её, когда число форм - 2
  if (getJsonDataLength() == 2) {
    $("#form0 .content-actions").
    append("<p class='delete-group content-action click-button'>Удалить группу</p>");
    $(".delete-group:first").on("click", deleteForm);
  }

  //вешаем на новые элементы обработчики событий
  $('.add-tag:last').
  on("click", {
    id: "#modal-tags-add",
    name: GetLastFormId()
  }, showWindow);
  $(".add-attr:last").
  on("click", {
    id: "#modal-attr-add",
    name: GetLastFormId()
  }, showWindow);
  $(".add-not-tag:last").
  on("click", {
    id: "#modal-not-tags-add",
    name: GetLastFormId()
  }, showWindow);
  $(".check:last").
  on("click", {
    id: "#edit-group",
    name: GetLastFormId(),
    edit: false
  }, showWindow);
  $(".edit-group:last").
  on("click", {
    id: "#edit-group",
    name: GetLastFormId(),
    edit: true
  }, showWindow);
  $(".delete-group:last").
  on("click", deleteForm);


}

/*Удаляет форму*/
function deleteForm(event) {

  //удаляем из массива условий группу
  var group = idProcess($(this).parent().parent().attr("id"));
  deleteArray(group);

  //удаляем из интерфейса
  $(this).parent().parent().detach();
  //нормализуем идентификаторы всех форм
  normalizeForms();

  //если в первой форме есть кнопка удаления группы, то убираем её, когда число форм - 1
  if (getJsonDataLength() == 1) {
    $("#form0 .content-actions .delete-group").detach();
  }

  //убираем значок дизъюнкции над формой
  $("#form0 .disjunction").detach();
  $("#form0").css("marginTop", "80px");

}


/*Функции интерфейса*/