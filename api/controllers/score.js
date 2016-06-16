'use strict';

var request = require('koa-request');
var config = require('../../config/config');

var messages = require('../models/models');
var slug = require('limax');

var mongoose = require('mongoose');
var Score = mongoose.model('Score');
var Movie = mongoose.model('Movie');

var ctrl = module.exports = {};

var outputFieldsSecurity = 'id_movie id_user title thumbnail score created';

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
 *          "thumbnail": "URL",
 *          "title": "Title",
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
 *          "thumbnail": "URL",
 *          "title": "Title",
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
 * @apiParam {String} response  response of the user
 * @apiParam {Number} nbr_index  nbr of index used by the user for find a movie.
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
 *          "id_movie": "23383",
 *          "id_user": "23383",
 *          "score": "hamlet",
 *          "thumbnail": "URL",
 *          "title": "Title",
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
  if (!this.request.body.nbr_index) {
    this.status = 400;
    return this.body = 'Missing the number of index used';
  }if (this.request.body.nbr_index < 0 || this.request.body.nbr_index > 3) {
    this.status = 400;
    return this.body = 'Unvalid number of index used';
  }else{

      //console.log(this.params.id);
      var result_score = yield Score.findOne({ 'id_movie': this.request.body.id_movie, 'id_user': this.request.body.id_user }).exec();
      
      //console.log(result_score);
      if (result_score == null) {

        try {
          //console.log(this.params.id);
          var result_movie = yield Movie.findOne({ '_id': this.request.body.id_movie}).exec();
          
          //console.log(this.request.body.nbr_index);
          if (result_movie == null) {
            this.status = 500;
            return this.body = 'Can\'t find movie';
          } else if (result_movie.slug !== slug(this.request.body.response)) {
            this.status = 400;
            return this.body = 'Wrong response';
          } else {
            
            try {
              var nbr_index = this.request.body.nbr_index;
              var points = 1000 - (this.request.body.nbr_index*200);
              //console.log(points);
              var result = new Score({ id_movie: this.request.body.id_movie, 
                                         id_user: this.request.body.id_user,
                                         title: result_movie.title,
                                         thumbnail: result_movie.thumbnail,
                                         release_date: result_movie.release_date,
                                         score: points
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
        } catch (error) {
          this.status = 404;
          return this.body = error;
        }

      } else {
        this.status = 400;
        return this.body = 'You have already find this movie';
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

/**
 * @api {del} /api/score/all/:id Delete all scores for an user
 * @apiName DeleteAllScores
 * @apiGroup Scores
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
ctrl.delall = function *(next, params){
  yield next;
  var error, result;
  try {
    result = yield Score.remove({ id_user: this.params.id }).exec();
    return this.body = result;
  } catch (error) {
    this.status = 400;
    return this.body = error;
  }
};