var express = require('express');
var router  = express.Router();

var Links = require('../app/collections/links');
var Link  = require('../app/models/link');
var Click = require('../app/models/click');
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

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

router.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits')+1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

module.exports = router;