// Server which delivers only static HTML pages (no content negotiation).
// Response codes: see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// When the global data has been initialised, start the server.

let express = require('express');
let fs = require("fs");
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
let ed = require('edit-distance');
let banned = [];
banUpperCase("./", "");

let insert, remove, update;
insert = remove = function(node) {return 1;};
update = function(stringA, stringB) {return stringA !== stringB ? 1 : 0; };
let server = app.listen(8080, start);

function start() {
  let host = server.address().address;
  let port = server.address().port;
  console.log("%s:%s", host, port);
}

// Make the URL lower case.
function lower(req, res, next) {
    req.url = req.url.toLowerCase();
    next();
}

// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send("Filename not lower case");
            return;
        }
    }
    next();
}

function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}

function genRandomSalt(length){
  return crypto.randomBytes(Math.ceil(8)).toString('hex').slice(0,16);
}

let sessionOpts = {
  saveUninitialized: false,
  resave: true,
  store: new SQLiteStore,
  secret: 'sneaky',
  cookie: { httpOnly: true, maxAge: (4*60*60*1000)}
}

app.use(lower);
app.use(ban);
app.use(express.static('site/public'));
app.use(cookieParser('sneaky'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
  db.get('select salt from users where username = ?', username, function(err, row) {
    if (!row) return done(null, false);
    console.log("Found matching username");
    var hash = hashPassword(password, row.salt);
    db.get('select username, IdU from users where username = ? and password = ?', username, hash, function(err, row) {
      if (!row) return done(null, false);
      console.log("Found matching username and password");
      return done(null, row);
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.IdU);
});

passport.deserializeUser(function(IdU, done) {
  db.get('select IdU, username from users where IdU = ?', IdU, function(err, row) {
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
    res.redirect('/login.html');
    //return an error
    return next();
  }
  return next();
}

app.get('/', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };
  res.header("Content-Type", "application/xhtml+xml");
  res.sendFile('/index.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

app.get('/login.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };
  res.header("Content-Type", "application/xhtml+xml");
  res.sendFile('/login.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

app.get('/about.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };

  res.sendFile('/about.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

/*app.post('/signup', function(req, res, next){
  console.log("Signing up");
  db.get("select username from users where users.username=?", req.username, function(err, row) {
    if (row) {
      return next(err);
    }
    console.log("unique username");
    console.log(req.body.username);
    console.log(req.body.password);
    let salt = genRandomSalt();
    let hash = hashPassword(req.body.password, salt);
    db.run("insert into users (username, password, salt, Recipe_Count) values (?, ?, ?, 0)", req.body.username, hash, salt);
    passport.authenticate('local', { session: true, successRedirect: '/profile.html', failureRedirect: '/login.html' });
    next();
  });
});*/

passport.use('local-signup', new LocalStrategy(function(username, password, done) {
  db.get("select username from users where username = ?", username, function(err, row) {
    if (err) {
      return done(err);
    }
    if (row) {
      return done(null, false);
    } else {
      let salt = genRandomSalt();
      let hash = hashPassword(password, salt);
      db.run("insert into users (username, password, salt, Recipe_Count) values (?, ?, ?, 0)", username, hash, salt);
      db.get("select IdU, username from users where username = ?", username, function(err, row) {
        return done(null, row);
      });
    }
  });
}));

app.post('/login', passport.authenticate('local', { session: true, successRedirect: '/profile.html', failureRedirect: '/login.html' }));


app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/login.html');
});

app.get('/profile.html', protected, function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };
  res.header("Content-Type", "application/xhtml+xml");
  res.sendFile('/profile.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

app.get('/recipes.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };

  res.sendFile('/recipe_template.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

app.get('/signup.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };

  res.sendFile('/signup.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

app.get('/searchResults.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };

  res.sendFile('/searchResults.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});

app.post('/getSearchResults', function(req, res, next) {
  console.log("Recipes requested");
  console.log(req.query.search);
  //Some sql query to get results
  // let results = [];
  // let results = { titles: [], difficulty: [] };
  let results = { titles: [] };

  db.all('select Title from Recipe', function(err, rows) {
    for (let i = 0; i < rows.length; i++) {
      let lev = ed.levenshtein(rows[i].Title, req.query.search, insert, remove, update);
      if(lev.distance <= 2){
        results.titles.push(rows[i].Title);
        //results.push({ title: rows[i], difficulty: difficulty[i] })
      }
    }
    //for(each title)
      //get the edit distance
    if (err) {
      console.log("Error, no recipe");
      next(err);
    } else {
      console.log("Found recipe");
      console.log(results);
      res.send(results);
    }
  });
});

app.post('/getRecipe', function(req, res, next) {
  //Some sql query to get results
  // let results = [];
  // let results = { titles: [], difficulty: [] };
  let results = { title: [], serves: [], rating: [], steps: []};

  db.get('select Title, Serves, Rating from Recipe where IdR = ?', req.query.IdR, function(err, row) {
    if (err) {
      console.log("Error, no recipe");
      next(err);
    } else {
      console.log("Found recipe");
      console.log(row);
      results.title.push(row.Title);
      results.serves.push(row.Serves);
      results.serves.push(row.Rating);
      db.all('select OrderNo, Step from Steps where IdR = ?', req.query.IdR, function(err, rows) {
        if (err) {
          next(err);
        } else {
          for (let i = 0; i < rows.length; i++) {
            results.steps.push(rows[i]);
          }
          res.send(results);
        }
      });
    }
  });
});

app.get('/isLoggedIn', function(req, res, next) {
  if(req.isAuthenticated()){
    res.send(true);
  }
  else {
    res.send(false);
  }
  next();
});

app.get('/GetUsername', protected, function(req, res, next) {
  console.log("Username requested");
  res.send(req.user.username);
  next();
});

app.post('/signup', passport.authenticate('local-signup', { session: true, successRedirect: '/profile.html', failureRedirect: '/signup.html' }));


app.get('/recipe_template.html', function(req, res, next) {
  let options = {
    root: __dirname + '/site'
  };

  res.sendFile('/recipe_template.html', options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent file");
    }
  });
});
