'use strict';

var isuuid = require('isuuid');
var config = require('../../config/config');

var users = require('../models/models');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var ctrl = module.exports = {};

var outputFieldsSecurity = 'uuid scores created updated';

/**
 * @api {get} /api/users/ Get all the users
 * @apiName ShowAllUsers
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "meta": {
 *          "ok": true,
 *          "code": 200
 *          "version": "1.0.0",
 *          "now": "2016-05-08T17:04:22.926Z"
 *        },
 *        "data": [{
 *          "score": { ... },
 *          "uuid": "",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z",
 *          "updated": "2016-05-08T17:04:22.923Z"
 *        }]
 *      }
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "q": {"slug":"hamlet"},
 *       "limit": 10,
 *       "skip": 1,
 *       "sort": -created
 *     }
 */
ctrl.list = function *(next){
  yield next;
  var error, result;
  try {
    var conditions = {};
    var query = this.request.query;
    if (query.q) {
      conditions = JSON.parse(query.q);
    }
    var builder = User.find(conditions, outputFieldsSecurity);
    ['limit', 'skip', 'sort'].forEach(function(key){
      if (query[key]) {
        builder[key](query[key]);
      }
    })
    result = yield builder.exec();
    return this.body = result;
  } catch (error) {
     this.status = 500;
    return this.body = error;
  }
};


/**
 * @api {get} /api/user/:id Get one user
 * @apiName ShowOneUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id  Id of the user or the uuid.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "meta": {
 *          "ok": true,
 *          "code": 200,
 *          "version": "0.0.1",
 *          "now": "2016-05-08T17:04:22.926Z"
 *        },
 *        "data": [{
 *          "score": { ... },
 *          "uuid": "",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z",
 *          "updated": "2016-05-08T17:04:22.923Z"
 *        }]
 *      }
 *
 * @apiErrorExample {json} Error-Response
 *     HTTP/1.1 404 Not Found
 *      {
 *        "meta": {
 *          "ok": false,
 *          "code": 404,
 *          "message": "Not found",
 *          "version": "0.0.1",
 *          "now": "2016-05-08T17:04:22.926Z"
 *        }
 *      }
 *
 */
ctrl.get = function *(next, params) {
  yield next;
  var error, result;
  try {
    var isUUID = isuuid(this.params.id); // true
    if(isUUID){
      var req = { 'uuid': this.params.id};
    } else {
      var req = { '_id': this.params.id};
    }

    //console.log(this.params.id);
    result = yield User.findOne(req, outputFieldsSecurity).exec();
    
    //console.log(result);
    if (result == null) {
      this.status = 404;
    } else {
      //console.log(final);
      
      this.status = 200;
      return this.body = result;
    }
  } catch (error) {
    this.status = 404;
    return this.body = error;
  }
};


 /**
 * @api {get} /api/user Post an user
 * @apiName AddUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "meta": {
 *          "ok": true,
 *          "code": 200,
 *          "version": "0.0.1",
 *          "now": "2016-05-10T12:28:43.502Z"
 *        },
 *        "data": {
 *          "uuid": "",
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "created": "2016-05-10T12:28:43.482Z"
 *        }
 *      }
 */
ctrl.post = function *(next){
  yield next;
  var error, result;
  //console.log(this.request.body);
  try {
    var user_uuid = this.request.get('X-app-UUID');
    var result = new User({ uuid: user_uuid});
    result = yield result.save();
    this.status = 200;
    this.body = result;
  } catch (error) {
    console.log(error);
    this.status = 400;
    return this.body = error.name;
  }  
  
};



/**
 * @api {del} /api/user/:id Delete an user
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id  Id of the user.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "meta": {
 *          "ok": true,
 *          "code": 200,
 *          "version": "0.0.1",
 *          "now": "2016-05-08T17:04:22.926Z"
 *        },
 *        "data": {
 *          "ok": 1,
 *          "n": 1
 *        }
 *      }
 *
 */
ctrl.del = function *(next, params){
  yield next;
  var error, result;
  try {
    //user_uuid
    var isUUID = isuuid(this.params.id); // true
    if(isUUID){
      var req = { uuid: this.params.id};
    } else {
      var req = { _id: this.params.id};
    }

    result = yield User.remove(req).exec();
    this.status = 200;
    return this.body = result;
  } catch (error) {
    this.status = 400;
    return this.body = error;
  }
};