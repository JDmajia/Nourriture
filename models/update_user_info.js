var mongodb=require("./db");

function Update_user_info(username,nickname,hometown,address){

    this.username=username;
    this.nickname=nickname;
    this.hometown=hometown;
    this.address=address;
}

Update_user_info.prototype.save=function save(callback){
    //存入mongodb的文档
    var update_user_info={
        username:this.username,
        nickname:this.nickname,
        hometown:this.hometown,
        address :this.address
    }
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("users_info",function(err,collection){

            collection.update({username:update_user_info.username},{$set:{nickname:update_user_info.nickname,address:update_user_info.address,hometown:update_user_info.hometown}},{safe:true},function(err){
                db.close();
                callback(err,update_user_info);
            })

        })
    })
}

module.exports=Update_user_info;