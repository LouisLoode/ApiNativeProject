var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var MessageSchema = new Schema({
  id_themoviedb: {
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
        type: [Date],
        default: Date.now
    }
});

mongoose.model('Message', MessageSchema);
