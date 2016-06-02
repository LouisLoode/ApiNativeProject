'use strict';

var supertest = require('supertest');
var app = require('../server');
var should = require('should');

var faker = require('faker');
faker.locale = 'fr';

var config = require('../config/config');


var randomUUID = faker.random.uuid();

function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.

var server = supertest.agent(config.app.url);

// UNIT test begin

describe('General unit test',function(){

  // #1 should return home page

  it('should return code 200',function(done){
    //console.log(config.app.port);
    // calling home page api
    server
    request()
    .get('/')
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .expect('Content-type',/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });

   it("should return 404",function(done){
    server
    request()
    .get("/random")
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  });
});