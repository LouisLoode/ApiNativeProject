'use strict';

var request = require('koa-request');
var config = require('../../config/config');

var messages = require('../models/models');
var mongoose = require('mongoose');
var Movie = mongoose.model('Movie');

var ctrl = module.exports = {};

var outputFieldsSecurity = 'slug id_themoviedb picto created updated';

/**
 * @api {get} /assets/pictos/:name Route to a pictogram
 * @apiName Url to pricto
 * @apiGroup Pictograms
 * @apiVersion 0.1.0
 *
 */

/**
 * @api {get} /api/movies/ Get all the movies
 * @apiName ShowAllMovies
 * @apiGroup Movies
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
 *        "data": {
 *          "id_themoviedb": "23383",
 *          "slug": "hamlet",
 *          "picto": "hamlet.png",
 *          "index_1": "",
 *          "index_2": "",
 *          "index_3": "",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z",
 *          "updated": "2016-05-08T17:04:22.923Z"
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
    var builder = Movie.find(conditions, outputFieldsSecurity);
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
 * @api {get} /api/movie/:id Get one movie
 * @apiName ShowOneMovie
 * @apiGroup Movies
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
 *          "id_themoviedb": "23383",
 *          "slug": "hamlet",
 *          "picto": "hamlet.png",
 *          "index_1": "",
 *          "index_2": "",
 *          "index_3": "",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z",
 *          "updated": "2016-05-08T17:04:22.923Z",
 *          "tmb": { ... }
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
    result = yield Movie.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
    
    //console.log(result);
    if (result == null) {
      this.status = 404;
    } else {

      //var final = result;

          var options = { method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + result.id_themoviedb,
            qs: { api_key: config.themoviedb.api_key, language: config.themoviedb.language },
            headers: 
             {'content-type': 'application/json'} };
         
          var response = yield request(options); //Yay, HTTP requests with no callbacks! 
          var info = JSON.parse(response.body);

          var final = {
            _id: result._id,
            slug: result.slug,
            index_1: result.index_1,
            index_2: result.index_2,
            index_3: result.index_3,
            picto: config.app.url + '/' + result.picto,
            updated: result.updated,
            created: result.created,
            tmb: info
          };

      //console.log(final);
      
      this.status = 200;
      return this.body = final;
    }
  } catch (error) {
    this.status = 404;
    return this.body = error;
  }
};


 /**
 * @api {post} /api/movie Post a movie
 * @apiName AddMovie
 * @apiGroup Movies
 * @apiVersion 0.1.0
 *
 * @apiParam {Number} id_themoviedb  id of the movie in the API of themoviedb.
 * @apiParam {String} slug  slug of the movie.
 * @apiParam {String} index_1  index 1 of the movie.
 * @apiParam {String} index_2  index 2 of the movie.
 * @apiParam {String} index_3  index 1 of the movie.
 * @apiParam {String} picto  pictogram name's of the movie.
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
 *          "index_1": "",
 *          "index_2": "",
 *          "index_3": "",
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
  if (!this.request.body.slug) {
    this.status = 400;
    return this.body = 'Missing slug';
  }
  if (!this.request.body.picto) {
    this.status = 400;
    return this.body = 'Missing pictogram';
  }
  if (!this.request.body.index_1) {
    this.status = 400;
    return this.body = 'Missing index 1';
  }
  if (!this.request.body.index_2) {
    this.status = 400;
    return this.body = 'Missing index 2';
  }
  if (!this.request.body.index_3) {
    this.status = 400;
    return this.body = 'Missing index 3';
  }
  if (!this.request.body.id_themoviedb) {
    this.status = 400;
    return this.body = 'Missing the ID of the movie for themoviedb API';
  }else{
    try {
      var result = new Movie({ id_themoviedb: this.request.body.id_themoviedb, 
                                 slug: this.request.body.slug,
                                 index_1: this.request.body.index_1,
                                 index_2: this.request.body.index_2,
                                 index_3: this.request.body.index_3,
                                 picto: this.request.body.picto 
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
 * @api {put} /api/movie/:id Update a movie
 * @apiName UpdateMovie
 * @apiGroup Movies
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id  Id of the movies.
 *
 * @apiParam {Number} id_themoviedb  id of the movie in the API of themoviedb.
 * @apiParam {String} slug  slug of the movie.
 * @apiParam {String} index_1  index 1 of the movie.
 * @apiParam {String} index_2  index 2 of the movie.
 * @apiParam {String} index_3  index 1 of the movie. 
 * @apiParam {String} picto  pictogram name's of the movie.
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
 *          "index_1": "",
 *          "index_2": "",
 *          "index_3": "",
 *          "picto": "hamlet.png",
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "created": "2016-05-10T12:28:43.482Z"
 *        }
 *      }
 */
ctrl.put = function *(next, params, request){
  yield next;
  var error, result;
  try {
    //console.log(this.request.body);
    var request = { id_themoviedb: this.request.body.id_themoviedb, 
                   slug: this.request.body.slug,
                   index_1: this.request.body.index_1,
                   index_2: this.request.body.index_2,
                   index_3: this.request.body.index_3,
                   picto: this.request.body.picto,
                   updated: new Date
                  };
    result = yield Movie.findByIdAndUpdate(this.params.id, request, {new: true}).exec();
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
 * @api {del} /api/movie/:id Delete a movie
 * @apiName DeleteOneMovie
 * @apiGroup Movies
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
    result = yield Movie.remove({ _id: this.params.id }).exec();
    return this.body = result;
  } catch (error) {
    this.status = 400;
    return this.body = error;
  }
};