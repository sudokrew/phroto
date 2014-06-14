var express = require('express'),
    router = express.Router();

module.exports = function(app) {

  // Index page
  app.get('/', function(req, res) {
    res.render('index');
  });

};
