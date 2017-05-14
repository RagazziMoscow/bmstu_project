var passport = require("passport");
var users = require("./../models/users");


module.exports = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());


  app.get("/signin", function(req, res) {
    res.render("auth/signin", {
      data: {
        title: "Авторизация",
        errorMsg: null
      }
    })
  });

  app.get("/signup", function(req, res) {
    res.render("auth/signup", {
      data: {
        title: "Регистрация",
        errorMsg: null
      }
    })
  });


  app.post("/signup", function(req, res) {

    var login = req.login;
    var password = req.password;
    var name = req.name;
    var email = req.email;
    var phone = req.phone;

    users.check(login, function(existingUser) {

      if (!existingUser) {

        users.create(login, password, name, email, phone, function() {
          res.redirect("/databases");
        });

      } else {
        res.render("auth/signup", {
          data: {
            title: "Регистрация",
            errorMsg: "Используйте другой логин для регистрации"
          }
        });
      }

    });
  });



  var authenticate = passport.authenticate('local', {
    successRedirect: '/databases',
    failureRedirect: '/signin',
  });


  app.post('/signin', authenticate);

  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/signin');
  });


  var LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
  }, function(username, password, done) {

    users.verify(username, password, function(result) {

      if (result) {
        return done(null, result);
      }
      return done(null, false);
    });

  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    //console.log('deserializeUser called');
    //console.log('id:', user);
    done(null, user);
  });


  var mustBeAuthenticated = function(req, res, next) {

    var originalUrl = req.originalUrl;
    if (originalUrl == "/signin" || originalUrl == "/signup") {
      next();
    } else {
      req.isAuthenticated() ? next() : res.redirect('/signin');
    }

  };

  app.use('/*', mustBeAuthenticated);
  /*
  app.use("/*", function(req, res, next) {
    if (req.user) console.log(req.user);
    next();
  });
  */

}