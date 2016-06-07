var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var MovieSchema = new Schema({
  id_themoviedb: {
        type: Number,
        required: true,
    },
  slug: {
        type: String,
        required: true,
  },
  picto: {
        type: String,
        required: true
    },  
  index_1: {
        type: String,
        required: true
  },
  index_2: {
        type: String,
        required: true
  },
  index_3: {
        type: String,
        required: true
  },
  created: {
        type: Date,
        default: Date.now
    },
  updated: {
        type: Date,
        default: null
    },
});

// set up a mongoose model
var ScoreSchema = new Schema({
  id_movie: {
        type: String,
        required: true,
    },
  id_user: {
        type: String,
        required: true,
    },
  score: {
        type: Number,
        required: true,
        default: null
    },
  created: {
        type: Date,
        default: null
    },
});

// set up a mongoose model
var UserSchema = new Schema({
  uuid: {
        type: String,
        required: true,
        unique: true
    },
  created: {
        type: Date,
        default: Date.now
    },
  updated: {
        type: Date,
        default: null
    },
});


mongoose.model('User', UserSchema);
mongoose.model('Score', ScoreSchema);
mongoose.model('Movie', MovieSchema);
