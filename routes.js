'use strict';

var Router = require('koa-router');
var mount = require('koa-mount');

// Controllers
var messageController = require('./api/controllers/message');




module.exports = function(app) {
  // register functions
  var router = new Router();

  router.use(function *(next) {
    this.type = 'json';
    yield next;
  });

  //Home
  router.get('/', function *(next) {
    this.status = 200;
  });

  /*router.get('/auth', authController.getCurrentUser);
  router.post('/auth', authController.signIn);

  router.all('/signout', authController.signOut);
  router.post('/signup', authController.createUser);

  // secured routes
  router.get('/value', secured, countController.getCount);
  router.get('/inc', secured, countController.increment);
  router.get('/dec', secured, countController.decrement);*/
  // Register `/token` POST path on oauth router (i.e. `/oauth2/token`).


  // Crud Routes
  //router.get('/messages', app.oauth.authorise(), messageController.list);
  router.get('/messages', messageController.list);
  router.get('/message/:id', messageController.get);
  router.post('/message', messageController.post);
  router.put('/message/:id', messageController.put);
  router.del('/message/:id', messageController.del);

  app.use(router.routes());
  app.use(router.allowedMethods());
};