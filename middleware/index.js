module.exports = function(app, express) {

  var path = require('path');
  var bodyParser = require('body-parser');

  app.set('views', path.join(__dirname, './../views'));
  app.use(express.static(path.join(__dirname, './../public')));


  /*
  var handlebars = require('handlebars'),
      layouts = require('handlebars-layout');

  layouts.register(handlebars);


  var templating = require('consolidate');
  app.engine('hbs', templating.handlebars);
  app.engine('ejs', templating.;
  app.set('view engine', 'hbs');


  app.set(__dirname + '/views', __dirname + ''); // + '/views'

  */

  // using for ejs, rendering pages
  app.engine('ejs', require('ejs-locals'));

  app.set('view engine', 'ejs');

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // parses request cookies to req.cookies
  var cookieParser = require('cookie-parser');
  app.use(cookieParser());


  // use req.session as data store
  var session = require('cookie-session');
  app.use(session({
    keys: ['secret']
  }));

}