'use strict';

var request = require('koa-request');
var config = require('../../config/config');

var messages = require('../models/models');
var mongoose = require('mongoose');
var Score = mongoose.model('Score');

var ctrl = module.exports = {};

var outputFieldsSecurity = 'id_movie id_user score created';

/**
 * @api {get} /api/scores/ Get all the movies
 * @apiName ShowAllScores
 * @apiGroup Scores
 * @apiVersion 0.1.0
 *
 * @apiDescription Get all documents, or documents that match the query. 
 * You can use mongoose find conditions, limit, skip and sort.
 * For example: 
 * /api/users?conditions={"name":"john"}&limit=10&skip=1&sort=-zipcode
 *
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
 *          "id_movie": "572f7196e002358e0e7e5c91",
 *          "id_user": "572f7196e002358e0e7e5c91",
 *          "score": "50",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z"
 *        }
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
    var builder = Score.find(conditions, outputFieldsSecurity);
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
 * @api {get} /api/score/:id Get one score
 * @apiName ShowOneScore
 * @apiGroup Scores
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id  Id of the score.
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
 *          "id_movie": "572f7196e002358e0e7e5c91",
 *          "id_user": "572f7196e002358e0e7e5c91",
 *          "score": "50",
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
    result = yield Score.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
    
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
 * @api {post} /api/score Post a score
 * @apiName AddScore
 * @apiGroup Scores
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id_movie  id of the movie
 * @apiParam {String} id_user  id of the user
 * @apiParam {Number} score  score of the user for a movie.
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
 *          "id_themoviedb": "23383",
 *          "slug": "hamlet",
 *          "picto": "hamlet.png",
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "created": "2016-05-10T12:28:43.482Z"
 *        }
 *      }
 */
ctrl.post = function *(next){
  yield next;
  var error, result;
  //console.log(this.request.body);
  if (!this.request.body) {
    this.status = 400;
    return this.body = 'The body is empty';
  }
  if (!this.request.body.id_movie) {
    this.status = 400;
    return this.body = 'Missing ID movie';
  }
  if (!this.request.body.id_user) {
    this.status = 400;
    return this.body = 'Missing ID user';
  }
  if (!this.request.body.score) {
    this.status = 400;
    return this.body = 'Missing the score';
  }else{
    try {
      var result = new Score({ id_movie: this.request.body.id_movie, 
                                 id_user: this.request.body.id_user,
                                 score: this.request.body.score 
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
 * @api {del} /api/score/:id Delete a score
 * @apiName DeleteOneScore
 * @apiGroup Scores
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id  Id of the movie.
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
    result = yield Score.remove({ _id: this.params.id }).exec();
    return this.body = result;
  } catch (error) {
    this.status = 400;
    return this.body = error;
  }
};