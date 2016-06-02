# ApiNativeProject

### Version
0.1.0

### Description
KoApi is a starter for an robust API.
  - CRUD example
  - Add Code Comments
  - Doc-ready
  - Travis Building

### Tech
KoApi uses a number of open source projects to work properly:
* [node.js] - evented I/O for the backend

And of course Dillinger itself is open source with a [public repository][KoApi]
 on GitHub.
 
### Installation

You need to install NodeJS dependancies:
```sh
$ sudo npm install
```

Need to copy and configure the config file:
```sh
$ cp ./config/config.example.js ./config/config.js 
```

Run app in dev mode (need [Nodemon]):
```sh
$ nodemon server.js
```

Run app in prod mode (need [Forever]):
```sh
$ forever start server.js
```

### Run test units
```sh
$ npm test
```

### Generate documentation
```sh
$ apidoc -i ./api/controllers/ -o ./doc/dist/ -t ./doc/template/
```


### Todos

 - Add Oauth2 authentification or Hawk auth
 - Logger strategy (winston)

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [KoApi]: <https://github.com/LouisLoode/StarterKoApi>
   [Nodemon]: <https://www.npmjs.com/package/nodemon>
   [node.js]: <http://nodejs.org>

