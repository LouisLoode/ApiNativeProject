'use strict';

var messages = require('../models/message');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

var ctrl = module.exports = {};

var outputFieldsSecurity = 'name content created';


/**
 * @api {get} /messages/ Get all the messages
 * @apiName ShowAllMessages
 * @apiGroup Messages
 * @apiVersion 0.0.1
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
 *        "data": {
 *          "__v": 0,
 *          "name": "This is my message name",
 *          "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu massa leo. Aenean nec orci vel orci rutrum viverra id ac massa. Nullam vitae faucibus nulla. Mauris vitae mi mattis, sagittis turpis at, dignissim arcu.",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z"
 *        }
 *      }
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "q": {"name":"john"},
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
    var builder = Message.find(conditions, outputFieldsSecurity);
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
 * @api {get} /message/:id Get a message
 * @apiName ShowOneMessage
 * @apiGroup Messages
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id  Id of the message.
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
 *          "__v": 0,
 *          "name": "This is my message name",
 *          "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu massa leo. Aenean nec orci vel orci rutrum viverra id ac massa. Nullam vitae faucibus nulla. Mauris vitae mi mattis, sagittis turpis at, dignissim arcu.",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z"
 *        }
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
    //console.log(this.params.id);
    result = yield Message.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
    //console.log(result);
    if (result == null) {
      this.status = 404;
    } else {
      this.status = 200;
      return this.body = result;
    }
  } catch (error) {
    this.status = 404;
    return this.body = error;
  }
};


 /**
 * @api {post} /message Create a message
 * @apiName AddMessage
 * @apiGroup Messages
 * @apiVersion 0.0.1
 *
 * @apiParam {String} name  Name of the message.
 * @apiParam {String} content  content of the message.
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
 *          "__v": 0,
 *          "name": "FINALISzeATION",
 *          "content": "FINALIzeSATION",
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "created": "2016-05-10T12:28:43.482Z"
 *        }
 *      }
 */
ctrl.post = function *(next){
  yield next;
  var error, result;
  if (!this.request.body) {
    this.status = 400;
    return this.body = 'The body is empty';
  }
  if (!this.request.body.name) {
    this.status = 400;
    return this.body = 'Missing name';
  }
  if (!this.request.body.content) {
    this.status = 400;
    return this.body = 'Missing content';
  }else{
    try {
      var result = new Message({ name: this.request.body.name, 
                                 content: this.request.body.content 
                               });
      result = yield result.save();
      this.status = 200;
      this.body = result;
    } catch (error) {
      console.log(error);
      this.status = 400;
      return this.body = error.name;
    }  
  }
};


 /**
 * @api {put} /message/:id Update a message
 * @apiName UpdateMessage
 * @apiGroup Messages
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id  Id of the message.
 *
 * @apiParam {String} name  Name of the message.
 * @apiParam {String} content  content of the message.
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
 *          "__v": 0,
 *          "name": "FINALISzeATION",
 *          "content": "FINALIzeSATION",
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "created": "2016-05-10T12:28:43.482Z"
 *        }
 *      }
 */
ctrl.put = function *(next, params, request){
  yield next;
  var error, result;
  try {
    result = yield Message.findByIdAndUpdate(this.params.id, this.request.body, {new: true}).exec();
    //console.log(result);
    if (result == null) {
      this.status = 404;
    } else {
      this.status = 200;
      return this.body = result;
    }
  } catch (error) {
      this.status = 400;
      return this.body = error.name;
  }
};

/**
 * @api {del} /message/:id Delete a message
 * @apiName DeleteOneMessage
 * @apiGroup Messages
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id  Id of the message.
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
    result = yield Message.remove({ _id: this.params.id }).exec();
    return this.body = result;
  } catch (error) {
    this.status = 400;
    return this.body = error;
  }
};