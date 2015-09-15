var express = require('express');
var router  = express.Router();

var User  = require('../app/models/user');
var Users = require('../app/collections/users');
var util  = require('../lib/utility');

router.get('/', function(req, res) {
  if (!req.session.username) {
    res.redirect('/create');
  } else {
    res.render('signup', {message: ""});
  }
});

router.post('/', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username.match(/^[a-zA-Z0-9]{1,32}$/)) {
    new User({username: username}).fetch().then(function(found) {
      if (found) {
        res.render('signup', {message: "Username already exists"});
      } else {
          Users.create({
          username: username,
          password: password,
        })
        .then(function(newLink) {
          req.session["username"] = username;
          res.redirect("/create");
        });
      }
    })
  } else {
    res.render('signup', {message: "Only 32 alphanumeric characters max please"});
  }
});

module.exports = router;