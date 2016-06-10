/**
 * DEPENDANCIES
 */
var http = require('http');
var fs = require('fs');
var faker = require('faker');


/**
 * CONFIGURATION
 */
var config = require('../config');
faker.locale = 'fr';
var randomUUID = faker.random.uuid();
var options = {
  'method': 'POST',
  'hostname': config.app.server,
  'port': config.app.port,
  'path': '/api/movie',
  'headers': {
    'x-app-uuid': randomUUID,
    'content-type': 'application/json'
  }
};

var contents = fs.readFileSync('./config/import/illus.json');
// Define to JSON type
var jsonContent = JSON.parse(contents);

console.log('\nEnvironment: ' + config.app.env + '\n');
console.log('POST http://' + config.app.server + ':' + config.app.port + '/' + options.path);
console.log('\n -> PUSH MOVIES');

for (var i = 0; i<jsonContent.length; i++) {

	var req = http.request(options, function (res) {
	  var chunks = [];

	  res.on('data', function (chunk) {
	    chunks.push(chunk);
	  });

	  res.on('end', function () {
	    var body = Buffer.concat(chunks);
	    var content = JSON.parse(body.toString());
	    console.log(content);
	    console.log(content.data.slug);
	  });
	});

	req.write(JSON.stringify({ id_themoviedb: jsonContent[i].id_themoviedb,
	  slug: jsonContent[i].slug,
	  index_1: jsonContent[i].index_1,
	  index_2: jsonContent[i].index_2,
	  index_3: jsonContent[i].index_3 }));
	req.end();

};
//var actors = cleanArray(urls_actors);

//console.log(actors.length);      
//console.log(actors);  