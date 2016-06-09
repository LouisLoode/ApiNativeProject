'use strict';

var Router = require('koa-router');
var mount = require('koa-mount');
var serve   = require('koa-static');

// Controllers
var movieController = require('./api/controllers/movie');
var userController = require('./api/controllers/user');
var scoreController = require('./api/controllers/score');

module.exports = function(app, config) {

  // register functions
  var router = new Router({
    prefix: '/api'
  });

  // serve files in public folder (css, js etc)
  app.use(mount('/assets', serve(__dirname + '/public')));

  router.use(function *(next) {
    this.type = 'json';
    yield next;
  });

  // Crud Routes
  // Movies
  //router.get('/movies', app.oauth.authorise(), messageController.list);
  router.get('/movies', movieController.list);
  router.get('/movies/state', movieController.state);
  router.get('/movies/success', movieController.success);
  router.get('/movie/:id', movieController.get);
  router.post('/movie', movieController.post);
  router.put('/movie/:id', movieController.put);
  router.del('/movie/:id', movieController.del);

  // Users
  router.get('/users', userController.list);
  router.get('/user/:id', userController.get);
  router.get('/user', userController.post);
  router.del('/user/:id', userController.del);

  // Scores
  router.get('/scores', scoreController.list);
  router.get('/score/:id', scoreController.get);
  router.post('/score', scoreController.post);
  router.del('/score/:id', scoreController.del);


  app.use(router.middleware());
  app.use(router.allowedMethods());


};