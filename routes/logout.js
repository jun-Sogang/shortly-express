var express = require('express');
var router  = express.Router();
var util    = require('../lib/utility');

router.get('/', function(req, res) {
  if (req.session.username) {
    delete req.session["username"];
    res.render('login', {message: "You've been logged out"});
  } else {
    res.redirect('/login');
  }
});

module.exports = router;