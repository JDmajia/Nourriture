var mongodb=require("./db");
var crypto = require('crypto');

function Head_photo(username,head_photo){
    this.username=username;
    this.head_photo=head_photo;
}

Head_photo.prototype.save=function save(callback){
    //存入monggodb的文档
    var user={
       username=this.username;
       head_photo=this.head_photo;
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection("users",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insert(user,{safe:true},function(err){
                db.close();
                callback(err);
            })
        })
    })
}
