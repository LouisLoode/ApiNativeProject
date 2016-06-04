
'use strict';

/**
 * DEPENDENCIES
 */
const koa = require('koa');
const mongoose = require('mongoose');
var app = module.exports = koa();


/**
 * CONFIGURATION
 */
var config = require('./config/config');

// Connexion to mongoose

//mongoose.connect('mongodb://' + config.mongo.user + ':' + config.mongo.pass + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.database);
if (config.app.env === 'production') {
   mongoose.connect('mongodb://' + config.mongo.user + ':' + config.mongo.pass + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.database);
} else {
	mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.database);
}
mongoose.connection.on('error', function(err) {
  console.log(err);
});

// Koa configuration
require('./config/koa')(app, config);


/*
*
* ROUTER
*
*/
require('./routes')(app, config);

// Start app
if (!module.parent) {
  app.listen(config.app.port);
  console.log('Server started, listening on port: ' + config.app.port);
}
console.log('Environment: ' + config.app.env);
