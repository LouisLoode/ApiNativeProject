'use strict';

var supertest = require('supertest');
var app = require('../../server');
var expect = require('expect.js');
var faker = require('faker');
faker.locale = 'fr';

var config = require('../../config/config');

var randomUUID = faker.random.uuid();
var randomId = faker.random.number();
var randomScore = faker.random.number();
var randomSlug = faker.name.lastName();
var randomImg = faker.image.image();


function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.
var server = supertest.agent(config.app.url);

// UNIT test begin

describe('CRUD Score',function(){
  var id_score

  var id_user
  var id_movie

  it('post an user',function(done){
    // calling home page api
    server
    request()
    .post('/api/user')
    .send({ 
      uuid: randomUUID
    })
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('uuid')
        expect(res.body.meta.code).to.eql(200)  
        id_user = res.body.data._id
        //console.log(id);
        done();
    });
  });

  it('post a movie',function(done){
    // calling home page api
    server
    request()
    .post('/api/movie')
    .send({ 
      id_themoviedb: randomId, 
      slug: randomSlug,
      picto: randomImg
    })
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('slug')
        expect(res.body.meta.code).to.eql(200)  
        id_movie = res.body.data._id
        //console.log(id);
        done();
    });
  });

  it('post a score',function(done){
    // calling home page api
    server
    request()
    .post('/api/score')
    .send({ 
      id_movie: id_movie, 
      id_user: id_user,
      score: randomScore
    })
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('score')
        expect(res.body.meta.code).to.eql(200)  
        id_score = res.body.data._id
        //console.log(id);
        done();
    });
  });


  it('get a score - 200',function(done){
    this.timeout(5000);
    server
    request()
    .get('/api/score/' + id_score)
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('_id');
        expect(res.body.data._id).to.eql(id_score) 
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  });

  it('get a score - 404',function(done){
    server
    request()
    .get('/api/score/qsd' + id_score)
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        //expect(res.body).to.not.be.empty();
        expect(res.body.meta.ok).to.eql(false)
        expect(res.body.meta.code).to.eql(404)       
        done();
    });
  });

  it('get a collection of scores',function(done){
    server
    request()
    .get('/api/scores')
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(err).to.eql(null)
        expect(res.body.data.map(function (item){return item._id})).to.contain(id_score)  
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  });
  
  /*
  it('removes a score', function(done){
      server
      request()
      .del('/api/score/' + id_score)
      .set('X-app-UUID', randomUUID)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true) 
        expect(res.body.meta.code).to.eql(200)    
        done()
      })
  })  

  it('removes a movie', function(done){
      server
      request()
      .del('/api/movie/' + id_movie)
      .set('X-app-UUID', randomUUID)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true) 
        expect(res.body.meta.code).to.eql(200)    
        done()
      })
  })  

    it('removes an user', function(done){
      server
      request()
      .del('/api/user/' + id_user)
      .set('X-app-UUID', randomUUID)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true) 
        expect(res.body.meta.code).to.eql(200)    
        done()
      })
  })   */

});