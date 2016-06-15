'use strict';
var url = require('url');
//var http = require('http');
var https = require('https');                                                
var Stream = require('stream').Transform;                                
var fs = require('fs'); 
var gm = require('gm').subClass({imageMagick: true});   
var shuffle = require('shuffle-array');
var path = require('path');

var request = require('koa-request');
var arrayDiff = require('simple-array-diff');
var sizeOf = require('image-size');
var config = require('../../config/config');

var messages = require('../models/models');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Movie = mongoose.model('Movie');
var Score = mongoose.model('Score');

var ctrl = module.exports = {};

var outputFieldsSecurity = 'title slug id_themoviedb overview genres budget revenue release_date index_1 index_2 index_3 illu cover thumbnail created updated cast crew';
var outputFieldsSecurityScores = 'id_movie id_user title thumbnail score created';

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}



/**
 * @api {get} /assets/illus/:name Route to an illustration
 * @apiName UrlsToIllustrations
 * @apiGroup Urls
 * @apiVersion 0.1.0
 *
 */

 /**
 * @api {get} /api/movies/success Get the movies success
 * @apiName ShowPlayedMovies
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
 *        "data": ['575614197a0775750d64071e','575614197a0775750d64071d']
 *      }
 */
ctrl.success = function *(next){
  yield next;
  var error, result_movie, result_score, result_user;
  var user_uuid = this.request.get('X-app-UUID');
  var condition = {'uuid':user_uuid};
  //console.log(user_uuid);
  //console.log(condition);

  try {
    var result_user = yield User.find(condition).exec();
    var id_user = result_user[0]._id;
    //console.log(id_user);
      var condition = {'id_user':id_user};
      var result_score = yield Score.find(condition, outputFieldsSecurityScores).exec();
      //console.log(result_score);

      var movies = [];
      for (var i = 0; i<result_score.length; i++) {
        //console.log(result_score[i].id_movie);
        movies[i] = result_score[i];  
      };

      //console.log(movies);

      return this.body = movies;
  } catch (error) {
     this.status = 500;
    return this.body = error;
  }
};

/**
 * @api {get} /api/movies/state Get the movies who aren't played yet
 * @apiName ShowUnplayedMovies
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
 *        "data": ['575614197a0775750d64071e','575614197a0775750d64071d']
 *      }
 */
ctrl.state = function *(next){
  yield next;
  var error, result_user, result_movie, result_score;
  var user_uuid = this.request.get('X-app-UUID');
  var condition = {'uuid':user_uuid};

  try {
    var result_user = yield User.find(condition).exec();
    var id_user = result_user[0]._id;

    //console.log(result_user);

    try{
      var condition = {'id_user':id_user};
      var result_score = yield Score.find(condition).exec();

      var played_movies = [];
      for (var i = 0; i<result_score.length; i++) {
        played_movies[i] = result_score[i].id_movie;
      };

      var result_movie = yield Movie.find('').exec();
      var all_movies = [];
      for (var i = 0; i<result_movie.length; i++) {
        all_movies[i] = result_movie[i];
      };

      var result = arrayDiff(all_movies,played_movies);
      //console.log(result.removed);
      var result_unique = shuffle.pick(result.removed);
      //console.log('-----------');
      //console.log(result_unique);
      return this.body = result_unique;
    } catch (error){
     this.status = 400;
    return this.body = error;
    }
  } catch (error) {
     this.status = 500;
    return this.body = error;
  }
};


/**
 * @api {get} /api/movies/ Get all the movies
 * @apiName ShowAllMovies
 * @apiGroup Movies
 * @apiVersion 0.1.0
 *
 * @apiDescription Get all documents, or documents that match the query. 
 * You can use mongoose find conditions, limit, skip and sort.
 * For example: 
 * /api/movies?conditions={"name":"john"}&limit=10&skip=1&sort=-zipcode
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
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "slug": "",
 *          "title": "info.original_title",
 *          "overview": "info.overview",
 *          "genres": "info.genres",
 *          "budget": "info.budget",
 *          "revenue": "info.revenue",
 *          "release_date": "info.release_date",
 *          "index_1": "this.request.body.index_1",
 *          "index_2": "this.request.body.index_2",
 *          "index_3": "this.request.body.index_3",
 *          "illu": "config.app.url + '/' + url_illu",
 *          "cover": "config.app.url + '/' + url_cover_local",
 *          "thumbnail": "config.app.url + '/' + url_thumbnail_local",
 *          "crew": "cast.crew",
 *          "cast": "cast.cast",
 *          "created": "2016-05-08T17:04:22.923Z"
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
 * @api {get} /api/movie/:id/cast Get cast of one movie
 * @apiName ShowMovieCast
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
 *          "cast": "cast.cast",
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
ctrl.getCast = function *(next, params) {
  yield next;
  var error, result;
  try {
    //console.log(this.params.id);
    result = yield Movie.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
    
    //console.log(result);
    if (result == null) {
      this.status = 404;
    } else {

      //console.log(final);
      
      this.status = 200;
      return this.body = result.cast;
    }
  } catch (error) {
    this.status = 404;
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
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "slug": "",
 *          "title": "info.original_title",
 *          "overview": "info.overview",
 *          "genres": "info.genres",
 *          "budget": "info.budget",
 *          "revenue": "info.revenue",
 *          "release_date": "info.release_date",
 *          "index_1": "this.request.body.index_1",
 *          "index_2": "this.request.body.index_2",
 *          "index_3": "this.request.body.index_3",
 *          "illu": "config.app.url + '/' + url_illu",
 *          "cover": "config.app.url + '/' + url_cover_local",
 *          "thumbnail": "config.app.url + '/' + url_thumbnail_local",
 *          "crew": "cast.crew",
 *          "cast": "cast.cast",
 *          "created": "2016-05-08T17:04:22.923Z"
 *          "updated": "2016-05-08T17:04:22.923Z"
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
 * @api {get} /api/movie/:id/related Get related movies of one movie
 * @apiName ShowRelatedMovies
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
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "slug": "",
 *          "title": "info.original_title",
 *          "overview": "info.overview",
 *          "genres": "info.genres",
 *          "budget": "info.budget",
 *          "revenue": "info.revenue",
 *          "release_date": "info.release_date",
 *          "index_1": "this.request.body.index_1",
 *          "index_2": "this.request.body.index_2",
 *          "index_3": "this.request.body.index_3",
 *          "illu": "config.app.url + '/' + url_illu",
 *          "cover": "config.app.url + '/' + url_cover_local",
 *          "thumbnail": "config.app.url + '/' + url_thumbnail_local",
 *          "crew": "cast.crew",
 *          "cast": "cast.cast",
 *          "created": "2016-05-08T17:04:22.923Z"
 *          "updated": "2016-05-08T17:04:22.923Z"
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
ctrl.related = function *(next, params) {
  yield next;
  var error, result_movie;
    //console.log(result_user);

    try{

      var result_movie = yield Movie.find('').exec();
      //console.log(result_movie);
      var all_movies = [];
      for (var i = 0; i<result_movie.length; i++) {
        all_movies[i] = result_movie[i];
      };

      shuffle(all_movies);
      var final = [];
      for (var i=0; i<10; i++) {
         final[i] = all_movies[i];
      }


      //console.log(final);
      this.status = 200;
      return this.body = final;
    } catch (error){
     this.status = 400;
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
 *          "illu": "hamlet.png",
 *          "index_1": "",
 *          "index_2": "",
 *          "index_3": "",
 *          "_id": "5731d3fb8d476abe2445b03d",
 *          "slug": "",
 *          "title": "info.original_title",
 *          "overview": "info.overview",
 *          "genres": "info.genres",
 *          "budget": "info.budget",
 *          "revenue": "info.revenue",
 *          "release_date": "info.release_date",
 *          "index_1": "this.request.body.index_1",
 *          "index_2": "this.request.body.index_2",
 *          "index_3": "this.request.body.index_3",
 *          "illu": "config.app.url + '/' + url_illu",
 *          "cover": "config.app.url + '/' + url_cover_local",
 *          "thumbnail": "config.app.url + '/' + url_thumbnail_local",
 *          "crew": "cast.crew",
 *          "cast": "cast.cast"
 *          "created": "2016-05-10T12:28:43.482Z"
 *        }
 *      }
 */
ctrl.post = function *(next){
  yield next
  var error, result;

  try {
    //console.log(this.params.id);
    result = yield Movie.findOne({ 'id_themoviedb': this.request.body.id_themoviedb}, outputFieldsSecurity).exec();
    
    //console.log(result);
    if (result == null) {
     //console.log(this.request.body);
      if (!this.request.body) {
        this.status = 400;
        return this.body = 'The body is empty';
      }
      if (!this.request.body.slug) {
        this.status = 400;
        return this.body = 'Missing slug';
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
          var options = { method: 'GET',
          url: 'https://api.themoviedb.org/3/movie/' + this.request.body.id_themoviedb,
          qs: { api_key: config.themoviedb.api_key, language: config.themoviedb.language },
          headers: 
           {'content-type': 'application/json'} };
         
          var response = yield request(options); //Yay, HTTP requests with no callbacks! 
          var info = JSON.parse(response.body);
          //console.log(info)

          var options = { method: 'GET',
          url: 'https://api.themoviedb.org/3/movie/' + this.request.body.id_themoviedb + '/casts',
          qs: { api_key: config.themoviedb.api_key, language: config.themoviedb.language },
          headers: 
           {'content-type': 'application/json'} };
         
          var response_cast = yield request(options); //Yay, HTTP requests with no callbacks! 
          var cast = JSON.parse(response_cast.body);
          //console.log(cast);
          var slug_movie = this.request.body.slug;   

          if(info.poster_path !== undefined){                               
            var ext = info.poster_path.split('.').pop();
          }
          //console.log(ext);
          var url_distant = 'https://image.tmdb.org/t/p/original' + info.poster_path;    
          var url_tmp = config.pictures.poster_tmp_path + slug_movie + '.' + ext; 
          var url_cover_local = config.pictures.poster_cover_path + slug_movie + '.' + ext;    
          var url_thumbnail_local = config.pictures.poster_thumb_path + slug_movie + '.' + ext;  
          var url_illu = config.pictures.illustration_path + slug_movie + '.png'; 
          //console.log(url_distant);
          //console.log(url_cover_local);
          //console.log(url_thumbnail_local);
          //console.log(url_illu);


           https.request(url_distant, function(response) {                                        
            var data = new Stream();                                                    

            response.on('data', function(chunk) {                                       
              data.push(chunk);                                                         
            });                                                                         

            response.on('end', function() {       

              fs.writeFile('public/' + url_tmp, data.read(), function(err) {
                  if(err) {
                      return console.log(err);
                  }                  

                // Resize cover picture
                  gm('public/'+url_tmp)
                    .resize('1000', '563', '^')
                    .gravity('Center')
                    .crop('1000', '563')
                    .write('public/'+url_cover_local, function (err) {
                      if (err) {
                        console.log(err);
                      } else{

                       console.log('Crop Cover -> Done : ' + url_cover_local);

                        gm('public/'+url_tmp)
                          .resize('150', '225', '^')
                          .write('public/'+url_thumbnail_local, function (err) {
                            if (err) {
                              console.log(err);
                            } else{
                             console.log('Crop Thumbnail -> Done : '+url_thumbnail_local);
                             
                            }
                          });  
                      }
                  });                   
                }); 
            });                                                                         
          }).end();
   
          var result = new Movie({ id_themoviedb: this.request.body.id_themoviedb, 
                                     slug: this.request.body.slug,
                                     title: info.original_title,
                                     overview: info.overview,
                                     genres: info.genres,
                                     budget: info.budget,
                                     revenue: info.revenue,
                                     release_date: info.release_date,
                                     index_1: this.request.body.index_1,
                                     index_2: this.request.body.index_2,
                                     index_3: this.request.body.index_3,
                                     illu: config.app.url + '/assets/' + url_illu,
                                     cover: config.app.url + '/assets/' + url_cover_local,
                                     thumbnail: config.app.url + '/assets/' + url_thumbnail_local,
                                     crew: cast.crew,
                                     cast: cast.cast
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

    } else {

      //console.log(final);
      
    this.status = 400;
    //console.log('Movie already exist');
    return this.body = 'Movie already exist';
    }
  } catch (error) {
    this.status = 400;
    return this.body = 'User already exist';
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
  var error, result, result_del;
  try {

        //console.log(this.params.id);
    result = yield Movie.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
    //console.log(result.cover);

    if (result == null) {
      this.status = 404;
    } else {

    result_del = yield Movie.remove({ _id: this.params.id }).exec();

      var result_get = result.cover;
      //console.log(result_get);
      var filename = path.parse(result_get).base;
      //console.log(filename);
      if (config.app.env !== 'test') {
            fs.unlinkSync('public/posters/cover/'+ filename);
            fs.unlinkSync('public/posters/thumbnails/'+ filename);
            fs.unlinkSync('public/tmp/posters/'+ filename);
      }
      
      this.status = 200;
      return this.body = result_del;
    }


  } catch (error) {
    this.status = 400;
    return this.body = error;
  }
};