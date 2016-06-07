'use strict';

var path = require('path');
var _ = require('lodash');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var base = {
  app: {
    root: path.normalize(path.join(__dirname, '/..')),
    env: env,
  },
};

var specific = {
  development: {
    app: {
      url: 'http://localhost:3000',
      port: 3000,
      name: 'ApiNativeProject - Dev',
      keys: [ 'super-secret' ],
    },
    mongo: {
      user: '',
      pass: '',
      host: '127.0.0.1',
      port: 27017,
      database: 'api-native-project-test'
    },
    themoviedb: {
      api_key: 'c1ac741d5dd740f9861e794c5363b0c2',
      language: 'en'
    }
  },
  test: {
    app: {
      url: 'http://localhost:3001',
      port: 3001,
      name: 'ApiNativeProject - Test ',
      keys: [ 'super-secret' ],
    },
    mongo: {
      user: '',
      pass: '',
      host: '127.0.0.1',
      port: 27017,
      database: 'api-native-project-test'
    },
    themoviedb: {
      api_key: 'c1ac741d5dd740f9861e794c5363b0c2',
      language: 'en'
    }
  },
  production: {
    app: {
      url: 'http://localhost:3000',
      port: process.env.PORT || 3000,
      name: 'ApiNativeProject',
      keys: [ 'super-secret' ],
    },
    mongo: {
      user: '',
      pass: '',
      host: '127.0.0.1',
      port: 27017,
      database: 'api-native-project-test'
    },
    themoviedb: {
      api_key: 'c1ac741d5dd740f9861e794c5363b0c2',
      language: 'en'
    }
  },
};

// See https://www.npmjs.com/package/koa-ip to config
var ip = {
  whitelist: [],
  blacklist: []
};

module.exports = _.merge(base, specific[env], ip);