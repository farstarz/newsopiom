var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    body: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
