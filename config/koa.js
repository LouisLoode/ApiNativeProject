'use strict';

var path = require('path');
var send = require('koa-send');
var responseTime = require('koa-response-time');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');
var isuuid = require('isuuid');
var cors = require('koa-cors');
var helmet = require('koa-helmet');
//var router = require('koa-router')();
//var serve   = require('koa-static');
var ip = require('koa-ip');
var genres = require('../api/utils/responses');

module.exports = function(app, config) {
  //if (!config.app.keys) { throw new Error('Please add session secret key in the config file!'); }
  //app.keys = config.app.keys;
  //console.log(config);
  if (config.app.env === 'development') {
    app.use(logger());
  }

  app.use(ip({
     whiteList: config.whitelist,
     blackList: config.blacklist
  }));

  app.use(helmet());

  app.use(cors());

  app.use(genres());

  app.use(bodyParser());
  
  // Check if user use a valid UUID for API
  app.use(function *(next){
    var appReqPath = path.dirname(this.request.url);
    //console.log(name);
    if(appReqPath === '/assets/pictos'){
      yield next;
    } else {
      var appReqUUI = this.request.get('X-app-UUID');
      var appCheckUUI = isuuid(appReqUUI); // Is a valid UUID
      var appReqContentType = this.request.get('Content-Type');
      //console.log(appReqUUI);
      if (appCheckUUI == true && appReqContentType == 'application/json'){
        yield next;
      } else{
        this.response.status = 500;
        this.response.body = 'Invalid UUID';
      }
    }
  });

  app.use(responseTime());



};