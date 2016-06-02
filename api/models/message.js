var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var MessageSchema = new Schema({
  name: {
        type: String,
        required: true,
        //unique: true
    },
  content: {
        type: String,
        required: true
    },
  created: {
        type: Date,
        default: Date.now
    },
  validated:  Boolean
});

mongoose.model('Message', MessageSchema);
