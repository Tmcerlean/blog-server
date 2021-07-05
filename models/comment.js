var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
  {
    body: {type: String, required: true, minLength: 1, maxLength: 500},
    timestamp: {type: Date, default: Date.now, required: true, },
    user: { required: true, type: String },
    postId: { type: String, required: true }
  }
);

//Export model
module.exports = mongoose.model('Comment', CommentSchema);