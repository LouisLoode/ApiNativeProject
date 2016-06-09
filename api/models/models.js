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
        unique: true
  },
  title: {
        type: String,
        required: true,
  },
  illu: {
        type: String,
        required: true,
        unique: true
  },  
  cover: {
        type: String,
        required: true
  },  
  thumbnail: {
        type: String,
        required: true
  },  
  release_date: {
        type: Date
  },
  genres: [{
    id : { type: Number, required: true},
    name : { type: String, required: true}
  }],  
  budget: {
        type: Number
  },  
  revenue: {
        type: Number
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
  crew: [{
    credit_id : { type: String, required: true},
    department : { type: String, required: true},
    id : { type: Number, required: true},
    job : { type: String, required: true},
    name : { type: String, required: true}
  }],  
  cast: [{
    cast_id : { type: Number, required: true},
    character : { type: String },
    credit_id : { type: String, required: true},
    id : { type: String, required: true},
    name : { type: String, required: true},
    order : { type: Number, required: true},
    profile_path : { type: String}
  }],  
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
