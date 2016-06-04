'use strict';

var Router = require('koa-router');
var mount = require('koa-mount');
var serve   = require('koa-static');

// Controllers
var movieController = require('./api/controllers/movie');




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

  //Home
  router.get('/', function *(next) {
    this.status = 200;
    //this.body = {msg: 'Hello world !'};
  });

  // Crud Routes
  // Movies
  //router.get('/movies', app.oauth.authorise(), messageController.list);
  router.get('/movies', movieController.list);
  router.get('/movie/:id', movieController.get);
  router.post('/movie', movieController.post);
  router.put('/movie/:id', movieController.put);
  router.del('/movie/:id', movieController.del);



  //router.get('/messages', app.oauth.authorise(), messageController.list);
  //router.get('/messages', messageController.list);
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