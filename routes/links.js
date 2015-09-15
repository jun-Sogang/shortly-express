var express = require('express');
var request = require('request');
var fs      = require('fs');
var router  = express.Router();

var util  = require('../lib/utility');
var Links = require('../app/collections/links');
var Link  = require('../app/models/link');
var User  = require('../app/models/user');
var Users = require('../app/collections/users');

// LINKS //
router.get('/', function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
});

router.post('/', function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        new User({username: req.session.username}).fetch().then(function(found) {
          Links.create({
            url: uri,
            title: title,
            base_url: req.headers.origin,
            user_id: found.id
          })
          .then(function(newLink) {
            request({url: uri + "/favicon.ico", encoding: null}, function (error, response, body) {
              if (!error && response.statusCode == 200 && body.length != 0) {
                fs.writeFile('public/favicons/' + newLink.get('code') + '.ico', body, function(err) {
                  console.log("done!");
                  res.send(200, newLink);
                });
              } else {
                fs.createReadStream('public/redirect_icon.ico').pipe(fs.createWriteStream('public/favicons/' + newLink.get('code') + '.ico'));
                res.send(200, newLink);
              }
            });
          });
        });
      });
    }
  });
});

module.exports = router;