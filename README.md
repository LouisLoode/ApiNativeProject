# ApiNativeProject

### Status
[![Build Status](https://travis-ci.org/LouisLoode/api-native-project.svg?branch=master)](https://travis-ci.org/LouisLoode/api-native-project)

### Version
0.1.0

### Description
API for Native Project school.

### Tech
KoApi uses a number of open source projects to work properly:
* [node.js] - evented I/O for the backend
 
### Installation

You need to install NodeJS dependancies:
```sh
sudo npm install
```

Need to copy and configure the config file:
```sh
cp ./config/config.example.js ./config/config.js 
```

Run app in dev mode (need [Nodemon]):
```sh
nodemon server.js
```

Run app in prod mode (need [Forever]):
```sh
npm start
```

### Run test units
```sh
npm test
```

### Generate documentation
```sh
apidoc -i ./api/controllers/ -o ./doc/dist/ -t ./doc/template/
```
### Fix GM binaries dependancies
```sh
npm test
```

### Import array of movies for production
```sh
NODE_ENV=production npm run db:import
```

### Import array of movies for dev
```sh
npm run db:import
```



### Todos
...


License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [KoApi]: <https://github.com/LouisLoode/StarterKoApi>
   [Nodemon]: <https://www.npmjs.com/package/nodemon>
   [node.js]: <http://nodejs.org>

