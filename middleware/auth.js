  var passport = require("passport");

  module.exports = function(app) {

    app.use(passport.initialize());
    app.use(passport.session());


    var authenticate = passport.authenticate('local', {
      successRedirect: '/databases',
      failureRedirect: '/signin',
    });


    app.post('/signin', authenticate);

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/signin');
    });


    var LocalStrategy = require('passport-local').Strategy;
    var users = require("./../models/users");

    passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password'
    }, function(username, password, done) {

      users.check(username, password, function(result) {
        if (result) {
          return done(null, {
            result: result
          });
        }

        return done(null, false);
      });

    }));

    passport.serializeUser(function(user, done) {
      done(null, user.result);
    });

    passport.deserializeUser(function(user, done) {
      console.log('deserializeUser called');
      console.log('id:', user);
      done(null, {
        user: user
      });
    });

  }