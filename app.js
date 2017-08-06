var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
var mongoose = require("mongoose");

var app = express();
var jsonParser = bodyParser.json();

//
// mongoose.connect('mongodb://localhost/adminapp');
// var url = mongoose.connection;

var url = "mongodb://localhost:27017/adminapp";

app.use(express.static(__dirname + "/public"));
app.get("/api/teachers", function(req, res){

    mongoClient.connect(url, function(err, db){
        db.collection("teachers").find({}).toArray(function(err, teachers){
            res.send(teachers)
            db.close();
        });
    });
});
app.get("/api/teachers/:id", function(req, res){

    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("teachers").findOne({_id: id}, function(err, teacher){

            if(err) return res.status(400).send();

            res.send(teacher);
            db.close();
        });
    });
});

app.post("/api/teachers", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    var teacherName = req.body.name;
    var teacherFather = req.body.father;
    var teacherSurname = req.body.surname;
    var teacher = {name: teacherName, father: teacherFather, surname : teacherSurname};

    mongoClient.connect(url, function(err, db){
        db.collection("teachers").insertOne(teacher, function(err, result){

            if(err) return res.status(400).send();

            res.send(teacher);
            db.close();
        });
    });
});

app.delete("/api/teachers/:id", function(req, res){

    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("teachers").findOneAndDelete({_id: id}, function(err, result){

            if(err) return res.status(400).send();

            var teacher = result.value;
            res.send(teacher);
            db.close();
        });
    });
});

app.put("/api/teachers", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var teacherName = req.body.name;
    var teacherFather = req.body.father;
    var teacherSurname = req.body.surname

    mongoClient.connect(url, function(err, db){
        db.collection("teachers").findOneAndUpdate({_id: id}, { $set: {surname:teacherSurname,father: teacherFather, name: teacherName}},
             {returnOriginal: false },function(err, result){

            if(err) return res.status(400).send();

            var teacher = result.value;
            res.send(teacher);
            db.close();
        });
    });
});

app.listen(3000, function(){
    console.log("Server is running...");
});
