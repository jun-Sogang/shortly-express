var express = require('express');
var router  = express.Router();

var User  = require('../app/models/user');
var Users = require('../app/collections/users');
var util  = require('../lib/utility');

router.get('/', function(req, res) {
  if (!req.session.username) {
    if (util.timedOut()) {
      res.render('login', {message: "<span id='timeout'>Please wait <span id='time'>" + util.timedOutTime() + "</span> seconds before attempting to login again.</span>"});
    } else {
      res.render('login', {message: ""});
    }
  } else {
    res.redirect('/create');
  }
});

router.post('/', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({username: username}).fetch().then(function(found) {
    if (found && found.validPass(password) && (!req.session["timeout"] || req.session["timeout"] - Math.floor(Date.now()/1000) <= 0)) {
      req.session["username"] = username;

      delete req.session["lockout"];
      delete req.session["timeout"];

      res.redirect("/create");
    } else {
      req.session["lockout"] = req.session["lockout"]+1 || 1;
      if (req.session["lockout"] >= 3) {
        var timeout = Math.pow(2, (req.session["lockout"]-3))*2
        req.session["timeout"] = Math.floor(Date.now()/1000) + timeout
        res.render('login', {message: "<span id='timeout'>Please wait <span id='time'>" + timeout + "</span> seconds before attempting to login again.</span>"});
      } else {
        res.render('login', {message: "Invalid username or password"});
      }
    }
  })
});

module.exports = router;