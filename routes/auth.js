function signin(req, res) {
  res.render("auth/signin", {
    data: {
      title: "Авторизация",
      errorMsg: null
    }
  })
}

function signup(req, res) {
  res.render("auth/signup", {
    data: {
      title: "Регистрация",
      errorMsg: null
    }
  })
}

module.exports.signin = signin;
module.exports.signup = signup;