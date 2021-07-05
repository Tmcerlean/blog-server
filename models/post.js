var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
  {
    title: {type: String, required: true, minLength: 5},
    body: {type: String, required: true, minLength: 20},
    published: {type: Boolean, default: false, required: false},
    timestamp: {type: Date, default: Date.now, required: false},
  }
);

PostSchema.virtual("date_formated").get(function () {
  return this.timestamp.toLocaleDateString("en-gb", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minutes: "2-digit",
  });
});

//Export model
module.exports = mongoose.model('Post', PostSchema);