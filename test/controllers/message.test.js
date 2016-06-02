'use strict';

var supertest = require('supertest');
var app = require('../../server');
var expect = require('expect.js');
var faker = require('faker');
faker.locale = 'fr';

var config = require('../../config/config');

var randomUUID = faker.random.uuid();
var randomName = faker.commerce.productName();
var randomContent = faker.lorem.paragraph();


function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.

var server = supertest.agent(config.app.url);

// UNIT test begin

describe('CRUD Message',function(){
  var id

  it('post a message',function(done){
    // calling home page api
    server
    request()
    .post('/message')
    .send({ 
      name: randomName, 
      content: randomContent 
    })
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('_id')
        expect(res.body.meta.code).to.eql(200)  
        id = res.body.data._id
        //console.log(id);
        done();
    });
  });


  it('get a message - 200',function(done){
    server
    request()
    .get('/message/' + id)
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

  it('get a message - 404',function(done){
    server
    request()
    .get('/message/qsd' + id)
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

  it('get a collection of message',function(done){
    server
    request()
    .get('/messages')
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
  
  it('update a message', function(done){
    server
    request()
    .put('/message/' + id)
    .send({ 
      name: randomName + 'update', 
      content: randomContent + 'update' 
    })
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true)   
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  })
  it('checks an updated object', function(done){
      server
      request()
      .get('/message/' + id)
      .set('X-app-UUID', randomUUID)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')   
        expect(res.body.data._id).to.eql(id)        
        expect(res.body.data.name).to.eql(randomName + 'update')
        expect(res.body.data.content).to.eql(randomContent + 'update')
        done()
      })
  })
  
  it('removes an object', function(done){
      server
      request()
      .del('/message/' + id)
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