var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    Headline: {
        type: String,
        unique: true},
    // Summary: String,
    Url: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;