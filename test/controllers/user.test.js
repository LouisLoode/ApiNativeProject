'use strict';

var supertest = require('supertest');
var app = require('../../server');
var expect = require('expect.js');
var faker = require('faker');
faker.locale = 'fr';

var config = require('../../config/config');

var randomUUID = faker.random.uuid();
//var randomId = faker.random.number();
//var randomSlug = faker.name.lastName();
//var randomImg = faker.image.image();


function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.
var server = supertest.agent(config.app.url);

// UNIT test begin

describe('CRUD User',function(){
  var id

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
        id = res.body.data._id
        //console.log(id);
        done();
    });
  });


  it('get an user by id - 200',function(done){
    server
    request()
    .get('/api/user/' + id)
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('_id');
        expect(res.body.data._id).to.eql(id) 
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  });

  it('get an user by uuid - 200',function(done){
    server
    request()
    .get('/api/user/' + randomUUID)
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('_id');
        expect(res.body.data._id).to.eql(id) 
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  });

  it('get an fake user - 404',function(done){
    server
    request()
    .get('/api/user/qsd' + id)
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

  it('get a collection of users',function(done){
    server
    request()
    .get('/api/users')
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(err).to.eql(null)
        expect(res.body.data.map(function (item){return item._id})).to.contain(id)  
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  });
 
  
  it('removes an user', function(done){
      server
      request()
      .del('/api/user/' + id)
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

});