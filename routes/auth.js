function signIn(req, res) {
  res.render("auth/signin", {
    data: {
      title: "Авторизация",
      errorMsg: null
    }
  })
}

function signUp(req, res) {
  res.render("auth/signup", {
    data: {
      title: "Регистрация",
      errorMsg: null
    }
  })
}

function requestSignIn(req, res) {
  var users = require("./../models/users");

}

module.exports.signin = signIn;
module.exports.signup = signUp;
module.exports.requestsignin = requestSignIn;