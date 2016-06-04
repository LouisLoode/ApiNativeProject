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
  created: {
        type: Date,
        default: Date.now
    },
  updated: {
        type: Date,
        default: null
    },
});

mongoose.model('Movie', MovieSchema);
