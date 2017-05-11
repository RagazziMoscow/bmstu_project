$(document).ready(function() {

  $(".standart-input").each(function() {
    $(this).val("");
  });

  $("#signup-form").validate({

    rules: {
      login: {
        required: true,
        minlength: 2
      },
      password: {
        required: true,
        minlength: 4
      },
      name: {
        required: true,
        minlength: 2
      },
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true,
        minlength: 6,
      }
    },

    messages: {
      login: {
        required: "Это поле обязательно для заполнения",
        minlength: "Логин должен быть не менее двух знаков"
      },
      password: {
        required: "Это поле обязательно для заполнения",
        minlength: "Пароль должен быть не менее 4 знаков"
      },
      name: {
        required: "Это поле обязательно для заполнения",
        minlength: "Введите корректное имя"
      },
      email: {
        required: "Это поле обязательно для заполнения",
        email: "Введите email в корректном формате"
      },
      phone: {
        required: "Это поле обязательно для заполнения",
        minlength: "Введите телефон в корректном формате"
      }
    }

  });
});