'use strict';

var dirname = require('path').dirname;
var version;

try {
  version = require('../package.json').version;
} catch(e) {}

module.exports = function (options) {
  options = options || {};
  return function *koaRes(next) {
    yield* next;
    //console.log(this.body.code)
    if (this.status == 200) {
        var status = this.status;
        var data = this.body;
        if(data.readable === true){
          this.body = data;
        } else {
          if (this.method.toLowerCase !== 'option') {
            if (data == null){
              this.body = {
                meta: {
                  ok: true,
                  code: this.status,
                  version: options.version || version || '1.0.0',
                  now: new Date()
                }
              };
            } else {
              this.body = {
                meta: {
                  ok: true,
                  code: this.status,
                  version: options.version || version || '1.0.0',
                  now: new Date()
                },
                data: data
              };
            }
            this.status = status;
          }
        }
    }
    else if (this.status == 404) {
      this.status = 404;
      this.body = {
        meta: {
          ok: false,
          code: this.status,
          message: this.body || 'Not found',
          //stack: e.stack || e,
          version: options.version || version || '1.0.0',
          now: new Date()
        }
      };
    } 
    else if (this.body == 'MongoError') {
        this.status = 400;
        this.body = {
          meta: {
            ok: false,
            code: this.status,
            message: 'Duplicate key error',
            //stack: e.stack || e,
            version: options.version || version || '1.0.0',
            now: new Date()
          }
        };
    }
    else if (this.status == 400) {
        this.status = 400;
        this.body = {
          meta: {
            ok: false,
            code: this.status,
            message: this.body,
            //stack: e.stack || e,
            version: options.version || version || '1.0.0',
            now: new Date()
          }
        };
    }
    else {
        this.status = 500;
        this.body = {
          meta: {
            ok: false,
            code: this.status,
            message: 'Error critic',
            //stack: e.stack || e,
            version: options.version || version || '1.0.0',
            now: new Date()
          }
        };
        if (options.debug) {
          console.error(e.stack);
        } else {
          delete this.body.stack;
        }
        /*if (error.name === 'CastError' || error.name === 'NotFoundError') {
        this.throw(404)
      }
      this.throw(500)*/
      
    }
  };
};