// Server which delivers only static HTML pages (no content negotiation).
// Response codes: see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// When the global data has been initialised, start the server.

let express = require('express');
let app = express();
let sql = require('sqlite3');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let crypto = require('crypto');
let session = require('express-session');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let SQLiteStore = require('connect-sqlite3')(session);
let db = new sql.Database("data.db");

let server = app.listen(8080, start);

function start() {
  let host = server.address().address;
  let port = server.address().port;
  console.log("%s:%s", host, port);
}

let sessionOpts = {
  saveUninitialized: false,
  resave: true,
  store: new SQLiteStore,
  secret: 'sneaky',
  cookie: { httpOnly: true, secure: false, maxAge: (4*60*60*1000)}
}

app.use(passport.initialize());
app.use(express.static('site/public'));
app.use(cookieParser('sneaky'));
app.use(session(sessionOpts));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
  console.log("Used passport!");
  db.get('select salt from users where username = ?', username, function(err, row) {
    if (!row) return done(null, false);
    console.log("Password: " + password);
    console.log("Salt: " + row.salt);
    var hash = hashPassword(password, row.salt);
    console.log("Hash: " + hash);
    db.get('select username, id from users where username = ? and password = ?', username, hash, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });
}));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("Id in deserialize: " + id)
  db.get('select id, username from users where id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

function hashPassword(password, salt) {
  let hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

function protected(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(new Error('PH*CK YOU'));
  }
  return next();
}

app.get('/index.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };

  res.sendFile('/index.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });

  console.log("User: " + req.user);
});

app.get('/login.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };

  res.sendFile('/login.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

app.post('/login.html', passport.authenticate('local', { successRedirect: '/index.html', failureRedirect: '/login.html' }));

app.get('/profile.html', protected, function(req, res, next) {
  console.log("The user is logged in!");
  console.log(req.user);
});
