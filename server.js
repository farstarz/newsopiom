var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsopiom", { useNewUrlParser: true});

app.get("/scrape", (req, res)=>{
    axios.get("http://www,echojs.com/").then(response => {
        var $ = cheerio.load(response.data);

        $("article h2").each(()=>{
            var result = {};

            result.headline = $(this)
                .children("a")
                .text();
            result.url = $(this)
                .children("a")
                .attr("href");
            
            db.Article.create(result)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        });
        
        // Send a message to the client
        res.send("Scrape Complete");
        
    });
});

app.get("/", (req,res)=>{
    db.Article.find({})
        .populate("comments")
        .then(dbArticle => res.render("index",{articles: json(dbArticle)}))
        .catch(err=> res.json(err));
    
});

app.post("./article/:id", (req,res)=>{
    db.Comment.create(req.body)
        .then((dbComment)=>{
            return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment.id}, {new: true});
        })
        .then(dbArticle => res.redirect("/"))
        .catch(err => res.json(err));

});

app.listen(PORT, ()=> console.log("App running on port "+ PORT +"!"));