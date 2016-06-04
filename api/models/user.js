var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var UserSchema = new Schema({
  uuid: {
        type: String,
        required: true,
        unique: true
    },
  score: { 
        id_movie: { type: Schema.Types.ObjectId, ref: 'Movie' }, 
        score: Number, 
        date: Date 
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
