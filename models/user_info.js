
//引入数据库操作模块
var mongodb=require("./db");
//声明User类
function User_info(username,nickname,hometown,address){

    this.username=username;
    this.nickname=nickname;
    this.hometown=hometown;
    this.address=address;
}

User_info.prototype.save=function save(callback){
    //存入mongodb的文档
    var user_info={
        username:this.username,
        nickname:this.nickname,
        hometown:this.hometown,
        address :this.address
    }
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection("users_info",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为username属性添加索引
            collection.ensureIndex("username");
            collection.insert(user_info,{safe:true},function(err){
                db.close();
                callback(err,user_info);
            })
        })
    })
}

module.exports=User_info;