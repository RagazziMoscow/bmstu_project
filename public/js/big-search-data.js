// Получаем последнее число ID последней формы
function GetLastFormId() {
  var counter = $(".main form:last").attr("id");
  return counter;
}


// Добавление новой группы(при добавлении формы)
function addNewArray() {
  JsonData.push(Array(0));
}



// Удаление группы(при удалении формы)
function deleteArray(group) {
  JsonData.splice(group, 1);
}



// Получение группы из массива условий
function getArray(group) {
  return JsonData[group];
}


// Получение числа групп в массиве условий
function getJsonDataLength() {
  return JsonData.length;
}


// Проверяет массив условий на пустоту
function JsonDataIsEmpty() {
  var arrayData = JsonData;
  var dataEmptyStatus = true;
  arrayData.forEach(function(item, i, arr) {
    if (item.length != 0) {
      dataEmptyStatus = false;
      return;
    }
  });
  return dataEmptyStatus;
}


// Добавление новых данных в группу
function addJsonData(group, idPar, namePar, numPar, relPar, typePar) {

  if (idPar != 2) {
    //Добавляем либо тег, либо его отсутствие
    JsonData[group].push({
      "id": idPar,
      "name": namePar
    });
  } else {
    //Добавляем атрибут
    JsonData[group].push({
      "id": idPar,
      "name": namePar,
      "number": numPar,
      "relation": relPar,
      "type": typePar
    });
  }

}


// Удаление элемента из группы
function deleteJsonData(group, id, name) {

  var item = JsonData[group]; //работаем с группой

  for (var i in item) {
    if (item[i]["name"] == name && item[i]["id"] == id) {
      JsonData[group].splice(i, 1); //если нашли по имени, то удаляем
    }
  }

}



// Получение числа элементов в группе
// group - номер группы
function getGroupCount(group) {
  return JsonData[group].length;
}


// Возвращает позицию элемента в группе по имени и id
function getItemPosition(group, id, name) {
  arr = JsonData[group];
  var index;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]["name"] == name && arr[i]["id"] == id) {
      index = i; //Возвращаем индекс найденного элемента
      break;
    }
  }
  return index;
}


// Установка новых значений элемента в группе
function setItem(group, id, name, namePar, numPar, relPar, typePar) {
  if (id !== 2) {
    JsonData[group][getItemPosition(group, id, name)] = {
      "id": id,
      "name": namePar
    }
  } else {
    JsonData[group][getItemPosition(group, id, name)] = {
      "id": id,
      "name": namePar,
      "number": numPar,
      "relation": relPar,
      "type": typePar
    }
  }
}

// Выполняет установку отношения для атрибута
function setRelation(group, name, relPar) {
  JsonData[group][getItemPosition(group, 2, name)]["relation"] = relPar;
}

// Выполняет установку значения,с чем сравнивать, для атрибута
function setNumber(group, name, numPar) {
  JsonData[group][getItemPosition(group, 2, name)]["number"] = numPar;
}


// Проверяет, существует ли элемент в указанной группе
function checkJsonData(group, id, name, relation, number) {
  var mark = true;
  arr = JsonData[group];

  if (arr == undefined) {
    return mark;
  }
  // проверяем на ненулевое имя
  if (name == "" || name == null) {
    return false;
  }

  // для атрибутов проверяем на ненулевое отноешение
  if (id == 2 && (relation == null || number == "")) {
    return false;

  }
  arr.forEach(function(item, i, arr) {
    if (item["name"] == name && item["id"] == id && id != 2) {
      mark = false;
      console.log("такой элемент в этой группе уже существует");
      return;
    }
  });
  return mark;
}

// Число дескрипторов выбранного типа в группе
function descriptorsCount(group, id) {
  var searchArr = group;
  if (searchArr == undefined) {
    return 0;
  }
  var descCount = 0;
  searchArr.forEach(function(item, i, arr) {
    if (item["id"] == id) {
      descCount++;
    }
  });
  return descCount;
}