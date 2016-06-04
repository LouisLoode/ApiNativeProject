'use strict';

var Router = require('koa-router');
var mount = require('koa-mount');
var serve   = require('koa-static');

// Controllers
var messageController = require('./api/controllers/message');




module.exports = function(app) {

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

  //Home
  router.get('/', function *(next) {
    this.status = 200;
  });

  // Crud Routes
  //router.get('/messages', app.oauth.authorise(), messageController.list);
  router.get('/messages', messageController.list);
  /*router.get('/message/:id', messageController.get);
  router.post('/message', messageController.post);
  router.put('/message/:id', messageController.put);
  router.del('/message/:id', messageController.del);*/
  //console.log(router.routes());
  //app.use('/api', router.routes());
  //app.use('/static', serve());


  app.use(router.middleware());
  app.use(router.allowedMethods());


};