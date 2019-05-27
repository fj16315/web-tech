// Initialize npm modules

let express = require('express');
let fs = require("fs");
let sql = require('sqlite3');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let crypto = require('crypto');
let session = require('express-session');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let SQLiteStore = require('connect-sqlite3')(session);
let ed = require('edit-distance');
let validUrl = require('valid-url');
let parseJson = require('parse-json');
let https = require('https');
let http = require('http');

// Initialize global variables

let app = express();
let db = new sql.Database("data.db");
let banned = [];
banUpperCase("./", "");
let insert, remove, update;
insert = remove = function(node) {return 1;};
update = function(stringA, stringB) {return stringA !== stringB ? 1 : 0; };
let sessionOpts = {
  saveUninitialized: false,
  resave: true,
  store: new SQLiteStore,
  secret: 'sneaky',
  cookie: { httpOnly: true, maxAge: (4*60*60*1000)}
};
let sendFileOptions = {
  root: __dirname + '/site'
};
let psGetSaltFromUsers = db.prepare('select salt from users where username = ?');
//db.get('select username, IdU from users where username = ? and password = ?', username, hash, function(err, row) {
let psGetUsernameIdUFromUsers = db.prepare('select username, IdU from users where username = ? and password = ?');
//db.get("select username from users where username = ?", username, function(err, row) {
let psGetUsernameFromUsers = db.prepare('select username from users where username = ?');
//db.run("insert into users (username, password, salt, Recipe_Count) values (?, ?, ?, 0)", username, hash, salt);
let psRunInsertUser = db.prepare('insert into users (username, password, salt, Recipe_Count) values (?, ?, ?, 0)');
//db.get("select IdU, username from users where username = ?", username, function(err, row) {
let psGetIdUUsernameFromUsers_Username = db.prepare('select IdU, username from users where username = ?');
//db.get('select IdU, username from users where IdU = ?', IdU, function(err, row) {
let psGetIdUUsernameFromUsers_IdU = db.prepare('select IdU, username from users where IdU = ?');
//db.get('select Title, Serves, Rating from Recipe where IdR = ?', req.query.IdR, function(err, row) {
let psGetTitleServesRatingCooking_TimePrep_TimeFromRecipe = db.prepare('select Title, Serves, Rating, Cooking_Time, Prep_Time from Recipe where IdR = ?');
//db.all('select Step from Steps where IdR = ?', req.query.IdR, function(err, rows) {
let psAllStepFromSteps = db.prepare('select Step from Steps where IdR = ?');
//db.all('select Quantity, Ingredient from Ingredients, Recipe_Ingredient where Recipe_Ingredient.IdR = ? and Ingredients.IdI = Recipe_Ingredient.IdI', req.query.IdR, function(err, rows) {
let psAllQuantityIngredientTypeFromIngredientsRecipe_Ingredient = db.prepare('select Quantity, Ingredient, Type from Ingredients, Recipe_Ingredient where Recipe_Ingredient.IdR = ? and Ingredients.IdI = Recipe_Ingredient.IdI');
//db.all('select Title from Recipe', function(err, rows) {
let psAllTitleCooking_TimePrep_TimeIdRFromRecipe = db.prepare('select Title, Cooking_Time, Prep_Time, IdR from Recipe where IdU = ?');
//db.all('select OrderNo, Step from Steps where IdR = ?', req.query.IdR, function(err, rows) {
let psAllOrderNoStepFromSteps = db.prepare('select OrderNo, Step from Steps where IdR = ?');
//db.run('insert into Recipe (Title, Serves, Rating, IdU) values (?, ?, ?, ?)', req.query.Title, req.query.Serves, req.query.Rating, req.user.IdU, function(err) {
let psRunInsertRecipe = db.prepare('insert into Recipe (Title, Serves, Rating, IdU, Prep_Time, Cooking_Time) values (?, ?, ?, ?, ?, ?)');
//db.run('if not exists (select 1 from Ingredients where Ingredient = ?) begin insert into Ingredients (Ingredient) values (?) end', req.query.Ingredients[j].Ingredient, req.query.Ingredients[j].Ingredient, function(err) {
let psRunInsertIgnoreIngredient = db.prepare('insert or ignore into Ingredients (Ingredient, Type) values (?, ?)');
//db.get('select top IdR from Recipe order by IdR desc');
//let psGetTopRecipe = db.prepare('select top IdR from Recipe order by IdR desc');
//db.get('select top IdI from Ingredients order by IdI desc');
//let psGetTopIngredient = db.prepare('select top IdI from Ingredients order by IdI desc');
//db.run('if not exists (select 1 from Recipe_Ingredient where IdI = ? and IdR = ?) begin insert into Recipe_Ingredient (IdR, IdI) values (?, ?)', IdI, IdR, IdR, IdI, function(err) {
let psRunInsertIgnoreRecipe_Ingredient = db.prepare('insert or ignore into Recipe_Ingredient (IdI, IdR, Quantity) values (?, ?, ?)');
//db.run('insert into Steps (Step, OrderNo, IdR) values (?, ?, ?)', req.query.Steps[i], i+1, IdR, function(err) {
let psRunInsertSteps = db.prepare('insert into Steps (Step, OrderNo, IdR) values (?, ?, ?)');
let psRunDeleteRecipe_IdR = db.prepare('delete from Recipe where IdR = ?');
let psRunDeleteSteps = db.prepare('delete from Steps where IdR = ?');
let psRunDeleteRecipe_Ingredient = db.prepare('delete from Recipe_Ingredient where IdR = ?');
let psRunDeleteUser = db.prepare('delete from users where IdU = ?');
let psRunDeleteRecipe_IdU = db.prepare('delete from Recipe where IdU = ?');
let psRunUpdateUsersRecipe_CountIncr = db.prepare('update users set Recipe_Count = Recipe_Count + 1 where IdU = ?');
let psGetRecipe_CountFromUsers = db.prepare('select Recipe_Count from users where IdU = ?');
let psRunUpdateUsersRecipe_CountDecr = db.prepare('update users set Recipe_Count = Recipe_Count - 1 where IdU = ?');

// Start server on specified port

/*let server = app.listen(8080, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log("%s:%s", host, port);
});*/

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(3000, function() {
  console.log("Listening on https!");
});

http.createServer(app).listen(8080, function() {
  console.log("Listening on http!");
});

// Initialize sessions

app.set('views', './site');
app.set('view engine', 'pug');
app.use(lower);
app.use(ban);
app.use(express.static('site/public'));
app.use(cookieParser('sneaky'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

// Declare functions

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

// Ban upper case file names
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

// Generates a random salt for a new user
function genRandomSalt(length){
  return crypto.randomBytes(Math.ceil(8)).toString('hex').slice(0,16);
}

// Finds the hashed password given a password and salt
function hashPassword(password, salt) {
  let hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

// Checks if the user has access to the page
function protected(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
    //return an error
    //return next();
  } else {
    return next();
  }
}

// Set passport authentication functions

// Local strategy for logging in
passport.use(new LocalStrategy(function(username, password, done) {
  //db.get('select salt from users where username = ?', username, function(err, row) {
  psGetSaltFromUsers.get(username, function(err, row) {
    if (!row) return done(null, false);
    console.log("Found matching username");
    var hash = hashPassword(password, row.salt);
    //db.get('select username, IdU from users where username = ? and password = ?', username, hash, function(err, row) {
    psGetUsernameIdUFromUsers.get(username, hash, function(err, row) {
      if (!row) return done(null, false);
      console.log("Found matching username and password");
      return done(null, row);
    });
  });
}));

// Local strategy for signing up a new user
passport.use('local-signup', new LocalStrategy(function(username, password, done) {
  //db.get("select username from users where username = ?", username, function(err, row) {
  psGetUsernameFromUsers.get(username, function(err, row) {
    if (err) {
      return done(err);
    }
    if (row) {
      return done(null, false);
    } else {
      let salt = genRandomSalt();
      let hash = hashPassword(password, salt);
      //db.run("insert into users (username, password, salt, Recipe_Count) values (?, ?, ?, 0)", username, hash, salt);
      psRunInsertUser.run(username, hash, salt);
      //db.get("select IdU, username from users where username = ?", username, function(err, row) {
      psGetIdUUsernameFromUsers_Username.get(username, function(err, row) {
        return done(null, row);
      });
    }
  });
}));

// Gets users ID after login/sign up
passport.serializeUser(function(user, done) {
  done(null, user.IdU);
});

// Adds user to current session
passport.deserializeUser(function(IdU, done) {
  //db.get('select IdU, username from users where IdU = ?', IdU, function(err, row) {
  psGetIdUUsernameFromUsers_IdU.get(IdU, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

// Get requests for pages

// Get request for home page
app.get('/', function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    res.header("Content-Type", "application/xhtml+xml");
    res.sendFile('/index.html', sendFileOptions, function(err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent file");
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get request for login page
app.get('/login', function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    res.header("Content-Type", "application/xhtml+xml");
    res.sendFile('/login.html', sendFileOptions, function(err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent file");
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get request for about page
app.get('/about', function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    res.header("Content-Type", "application/xhtml+xml");
    res.sendFile('/about.html', sendFileOptions, function(err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent file");
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get request for profile page
app.get('/profile', protected, function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    res.header("Content-Type", "application/xhtml+xml");
    res.sendFile('/profile.html', sendFileOptions, function(err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent file");
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get request for add recipe page
app.get('/add_recipe', protected, function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    res.header("Content-Type", "application/xhtml+xml");
    res.sendFile('/recipe_creation.html', sendFileOptions, function(err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent file");
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get request for recipe page
app.get('/recipe_template', function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    //db.get('select Title, Serves, Rating from Recipe where IdR = ?', req.query.IdR, function(err, row) {
    psGetTitleServesRatingCooking_TimePrep_TimeFromRecipe.get(req.query.IdR, function(err1, row1) {
      if (err1) {
        console.log("Error, no recipe");
        next(err1);
      } else {
        console.log("Found recipe");
        console.log(row1);
        //db.all('select Step from Steps where IdR = ?', req.query.IdR, function(err, rows) {
        psAllStepFromSteps.all(req.query.IdR, function(err2, rows2) {
          if (err2) {
            next(err2);
          } else {
            let steps = [];
            for (let i = 0; i < rows2.length; i++) {
              steps[i] = rows2[i].Step;
            }
            //db.all('select Quantity, Ingredient from Ingredients, Recipe_Ingredient where Recipe_Ingredient.IdR = ? and Ingredients.IdI = Recipe_Ingredient.IdI', req.query.IdR, function(err, rows) {
            psAllQuantityIngredientTypeFromIngredientsRecipe_Ingredient.all(req.query.IdR, function(err3, rows3) {
              if (err3) {
                next(err3);
              } else {
                let ingredients = [];
                for (let i = 0; i < rows3.length; i++) {
                  ingredients[i] = rows3[i].Quantity + rows3[i].Type + " " + rows3[i].Ingredient;
                }
                console.log("Rendering template");
                console.log("title: " + row1.Title);
                console.log("serves: " + row1.Serves);
                console.log("rating: " + row1.Rating);
                console.log("steps: " + steps);
                console.log("ingredients: " + ingredients);
                res.header("Content-Type", "application/xhtml+xml");
                res.render('recipe_template', { title: row1.Title, serves: row1.Serves, rating: row1.Rating, cooking_time: row1.Cooking_Time, prep_time: row1.Prep_Time, steps: steps, ingredients: ingredients});
              }
            });
          }
        });
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get request for signup page
app.get('/signup', function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    res.header("Content-Type", "application/xhtml+xml");
    res.sendFile('/signup.html', sendFileOptions, function(err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent file");
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get request for search page
app.get('/searchResults', function(req, res, next) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (validUrl.isUri(fullUrl)) {
    res.header("Content-Type", "application/xhtml+xml");
    res.sendFile('/searchResults.html', sendFileOptions, function(err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent file");
      }
    });
  } else {
    next(new Error('This is an invalid url'));
  }
});

// Get requests for updating pages

// Get request for checking if the current user is logged in
app.get('/isLoggedIn', function(req, res, next) {
  if(req.isAuthenticated()){
    res.send(true);
  }
  else {
    res.send(false);
  }
  next();
});

// Get request for getting the current users username
app.get('/GetUserProfile', protected, function(req, res, next) {
  console.log("UserProfile requested");
  psGetRecipe_CountFromUsers.get(req.user.IdU, function(err, row) {
    if (err) {
      next(err);
    } else {
      let profile = {username: req.user.username, recipe_count: row.Recipe_Count};
      res.send(profile);
      next();
    }
  });
});

// Post requests for pages

// Post request for authenticating login
app.post('/login', passport.authenticate('local', { session: true, successRedirect: '/profile', failureRedirect: '/login' }));

// Post request for authenticating signup
app.post('/signup', passport.authenticate('local-signup', { session: true, successRedirect: '/profile', failureRedirect: '/signup' }));

// Post request for logging out
app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// Post request for get user's recipes
app.post('/getUserResults', function(req, res, next){
  console.log("User recipes requested");
  //TODO!
  console.log("TODO!");
  let results = [];
  //db.all('select Title from Recipe', function(err, rows) { //PLACEHOLDER <- returns all searches for salad
  psAllTitleCooking_TimePrep_TimeIdRFromRecipe.all(req.user.IdU, function(err, rows) {
    for (let i = 0; i < rows.length; i++) {
      results.push({title:rows[i].Title, cookTime:rows[i].Cooking_Time, prepTime:rows[i].Prep_Time, IdR:rows[i].IdR});
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

// Post request for searching for recipes
app.post('/getSearchResults', function(req, res, next) {
  console.log("Recipes requested");
  console.log(req.query.search);
  //Some sql query to get results
  // let results = [];
  // let results = { titles: [], difficulty: [] };
  let results = [];

  db.all('select Title, Cooking_Time, Prep_Time, IdR from Recipe', function(err, rows) {
  //psAllTitleRecipe.all(function(err, rows) {
    for (let i = 0; i < rows.length; i++) {
      let lev = ed.levenshtein(rows[i].Title, req.query.search, insert, remove, update);
      if(lev.distance <= 2){
        results.push({title:rows[i].Title, cookTime:rows[i].Cooking_Time, prepTime:rows[i].Prep_Time, IdR:rows[i].IdR});
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
      //results = JSON.stringify(results);
      res.send(results);
    }
  });
});

// Post request for returning correct recipe page
app.post('/getRecipe', function(req, res, next) {
  //Some sql query to get results
  // let results = [];
  // let results = { titles: [], difficulty: [] };
  let results = { title: [], serves: [], rating: [], steps: []};

  //db.get('select Title, Serves, Rating from Recipe where IdR = ?', req.query.IdR, function(err, row) {
  psGetTitleServesRatingFromRecipe.get(req.query.IdR, function(err, row) {
    if (err) {
      console.log("Error, no recipe");
      next(err);
    } else {
      console.log("Found recipe");
      console.log(row);
      results.title.push(row.Title);
      results.serves.push(row.Serves);
      results.serves.push(row.Rating);
      //db.all('select OrderNo, Step from Steps where IdR = ?', req.query.IdR, function(err, rows) {
      psAllOrderNoStepFromSteps.all(req.query.IdR, function(err, rows) {
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

// Post request for adding a new recipe
app.post('/AddRecipe', function(req, res, next) {
  //db.run('insert into Recipe (Title, Serves, Rating, IdU) values (?, ?, ?, ?)', req.query.Title, req.query.Serves, req.query.Rating, req.user.IdU, function(err) {
  console.log("--- adding recipe! ---");
  psRunInsertRecipe.run(req.body.Title, req.body.Serves, req.body.Rating, req.user.IdU, req.body.PrepTime, req.body.CookTime, function(err1) {
    if (err1) {
      next(err1);
    } else {
      db.get('select IdR from Recipe order by IdR desc limit 1', function(err2, row) {
        if (err2) {
          next(err2);
        } else {
          for (let i = 0; i < req.body.Steps.length; i++) {
            //db.run('insert into Steps (Step, OrderNo, IdR) values (?, ?, ?)', req.query.Steps[i], i+1, IdR, function(err) {
            psRunInsertSteps.run(req.body.Steps[i], i+1, row.IdR, function(err3) {
              if (err3) {
                next(err3);
              }
            });
          }
          for (let j = 0; j < req.body.Ingredients.length; j++) {
            //db.run('if not exists (select 1 from Ingredients where Ingredient = ?) begin insert into Ingredients (Ingredient) values (?) end', req.query.Ingredients[j].Ingredient, req.query.Ingredients[j].Ingredient, function(err) {
            psRunInsertIgnoreIngredient.run(req.body.Ingredients[j].ingredient, req.body.Ingredients[j].type, function(err4) {
              if (err4) {
                next(err4);
              } else {
                db.get('select IdI from Ingredients order by IdI desc limit 1', function(err5, rowI) {
                  if (err5) {
                    next(err5);
                  } else {
                    //db.run('if not exists (select 1 from Recipe_Ingredient where IdI = ? and IdR = ?) begin insert into Recipe_Ingredient (IdR, IdI) values (?, ?)', IdI, IdR, IdR, IdI, function(err) {
                    console.log("Quantity: " + req.body.Ingredients[j].quantity);
                    psRunInsertIgnoreRecipe_Ingredient.run(rowI.IdI, row.IdR, req.body.Ingredients[j].quantity, function(err6) {
                      if (err6) {
                        next(err6);
                      }
                    });
                  }
                });
              }
            });
          }
          psRunUpdateUsersRecipe_CountIncr.run(req.user.IdU, function(err7) {
            if (err7) {
              next(err7);
            } else {
              res.redirect('/profile');
            }
          });
        }
      });
    }
  });
});

// Post request for deleting a recipes
app.post('/deleteRecipe', function(req, res, next) {
  console.log("Deleting!");
  console.log("req.body.IdR: " + req.body.IdR);
  psRunDeleteSteps.run(req.body.IdR, function(err) {
    if (err) {
      next(err);
    } else {
      psRunDeleteRecipe_Ingredient.run(req.body.IdR, function(err1) {
        if (err1) {
          next(err1);
        } else {
          psRunDeleteRecipe_IdR.run(req.body.IdR, function(err2) {
            if (err2) {
              next(err2);
            } else {
              psRunUpdateUsersRecipe_CountDecr.run(req.user.IdU, function(err3) {
                if (err3) {
                  next(err3);
                } else {
                  res.redirect('/profile');
                }
              });
            }
          });
        }
      });
    }
  });
});

// Post request for deleting a user
app.post('/deleteUser', function(req, res, next) {
  db.all('select IdR from Recipe where IdU = ?', req.user.IdU, function(err, rows) {
    if (err) {
      next(err);
    } else {
      console.log("rows.length: " + rows.length);
      for (let i = 0; i < rows.length; i++) {
        psRunDeleteSteps.run(rows[i].IdR, function(err1) {
          if (err1) {
            next(err1);
          } else {
            psRunDeleteRecipe_Ingredient.run(rows[i].IdR, function(err2) {
              if (err2) {
                next(err2);
              }
            });
          }
        });
      }
      psRunDeleteRecipe_IdU.run(req.user.IdU, function(err3) {
        if (err3) {
          next(err3);
        } else {
          psRunDeleteUser.run(req.user.IdU, function(err4) {
            if (err4) {
              next(err4);
            } else {
              res.redirect('/');
            }
          });
        }
      });
    }
  });
});
