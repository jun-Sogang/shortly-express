var express = require('express');
var router  = express.Router();
var util    = require('../lib/utility');

router.get('/', function(req, res) {
  if (!req.session.username) {
    res.render('login', {message: "You must be logged in to access this resource"});
  } else {
    res.render('index');
  }
});

module.exports = router;