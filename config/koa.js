'use strict';

var path = require('path');
var responseTime = require('koa-response-time');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');
var isuuid = require('isuuid');
var cors = require('koa-cors');
var helmet = require('koa-helmet');
var ip = require('koa-ip');
var genres = require('../api/utils/responses');

module.exports = function(app, config) {
  if (!config.app.keys) { throw new Error('Please add session secret key in the config file!'); }
  app.keys = config.app.keys;

  if (config.app.env !== 'test' && config.app.env !== 'production') {
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

  // Check if user use a valid UUID
  app.use(function *(next){
    //console.log(this.request.header);
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
  });

  app.use(responseTime());

};