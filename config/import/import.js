/**
 * DEPENDANCIES
 */
//var http = require('http');
var fs = require('fs');
var faker = require('faker');
var rest = require('restling');
 
var sleep = require('then-sleep');
 



/**
 * CONFIGURATION
 */
 
var config = require('../config');
faker.locale = 'fr';
var randomUUID = faker.random.uuid();

var contents = fs.readFileSync('./config/import/illus.json');
// Define to JSON type
var jsonContent = JSON.parse(contents);
var nbr_movies_jsonContent = jsonContent.length;

//console.log(jsonContent);

console.log('\nEnvironment: ' + config.app.env + '\n');
console.log('POST http://' + config.app.server + ':' + config.app.port + '/api/movie');
console.log('\n -> PUSH MOVIES');

for (var i = 0; i<nbr_movies_jsonContent; i++) {

/*console.log(jsonContent[i].id_themoviedb);
console.log(jsonContent[i].slug);
console.log(jsonContent[i].index_1);
console.log(jsonContent[i].index_2);
console.log(jsonContent[i].index_3);*/
	var id_themoviedb = jsonContent[i].id_themoviedb;
	var slug = jsonContent[i].slug;
	var index_1 = jsonContent[i].index_1;
	var index_2 = jsonContent[i].index_2;
	var index_3 = jsonContent[i].index_3;
	//console.log(i);
	if(i === 39 || i === 78){
		//console.log('Sleep for conturn TheMovieDB MAX_REQUEST_PER_SEC')
		sleep(5000).then(

			rest.post('http://' + config.app.server + ':' + config.app.port + '/api/movie' , {
			  data: { id_themoviedb: id_themoviedb,
					  slug: slug,
					  index_1: index_1,
					  index_2: index_2,
					  index_3: index_3 },
			  timeout: 25000
			}).then(function(result) {
			  if (result.response.statusCode == 200) {
			    //result.data;// you can get at the raw response like this... 
			    //console.log(result.data.data.title);
			    console.log(result.data.data.title + ' -> Done !')
			  }
			},function(err) {
			  console.log(err + ' -> Error !');
			})

		);


	}else{

		sleep(5000).then(

			rest.post('http://' + config.app.server + ':' + config.app.port + '/api/movie' , {
			  data: { id_themoviedb: id_themoviedb,
					  slug: slug,
					  index_1: index_1,
					  index_2: index_2,
					  index_3: index_3 },
			  timeout: 25000
			}).then(function(result) {
			  if (result.response.statusCode == 200) {
			    //result.data;// you can get at the raw response like this... 
			    //console.log(result.data.data.title);
			    console.log(result.data.data.title + ' -> Done !')
			  }
			},function(err) {
			  console.log(err + ' -> Error !');
			})

		);

	}

};
