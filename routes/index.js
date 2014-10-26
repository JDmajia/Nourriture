var crypto=require("crypto");
var User=require("../models/User");

var User_info = require("../models/user_info");
var Update_user_info=require("../models/update_user_info");

exports.index = function(req, res){
    res.render("index",{title:"首页"});
};

exports.user=function(req,res){
    User.find(req.params.user,function(err,user){
       if(!user){
           req.session.error="用户不存在";
            return res.redirect("/");
       }
       Post.find(user.name,function(err,posts){
            if(err){
                req.session.error=err;
                return req.redirect("/");
            }
           res.render("user",{title:user.name,})
       });
    });
}
exports.post=function(req,res){
    var currentUser=req.session.user;
    var post=new Post(currentUser.name,req.body.post);
    post.save(function(err){
        if(err){
            req.session.error=err;
            return res.redirect("/");
        }
        req.session.success="发表成功";
        res.redirect("/u/"+currentUser.name);
    });
}

exports.doUser_info=function(req,res){
    var currentUser=req.session.user;
    var user_info = new User_info(currentUser.name,req.body.nickname,req.body.hometown,req.body.address);
    user_info.save(function(err){
        if(err){
            req.session.error=err;
            return res.redirect("/");
        }
        req.session.success="Thank you for your register";
        res.redirect("/");
    })
}
exports.doUpdate_user_info=function(req,res){
    var currentUser=req.session.user;
    var update_user_info = new Update_user_info(currentUser.name,req.body.nickname,req.body.hometown,req.body.address);
    update_user_info.save(function(err){
        if(err){
            req.session.error=err;
            return res.redirect("/");
        }
        req.session.success="Change Success";
        res.redirect("/update_user_info");
    })

}

/**
 * 跳转注册页面
 * @param req
 * @param res
 */
exports.reg=function(req,res){
    res.render('reg', { title: "Register Page"});
}
/**
 * 注册操作
 * @param req
 * @param res
 * @return {*}
 */
exports.doReg=function(req,res){
    //检验用户两次输入的口令是否一致
    if(req.body["password-repeat"]!=req.body['password']){
        req.session.error="两次输入的口令不一致";
        return res.redirect("/reg");
    }
    //生成口令的散列值，我们使用md5加密
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest("base64");
    //声明需要添加的用户
    var newUser=new User({
        name:req.body.username,
        password:password
    });
    User.find(newUser.name,function(err,user){
       //如果用户已经存在
       if(user){
           req.session.error="This Telphone Number Already Exists, Please Log In";
           return res.redirect("/reg");
       }
       //如果不存在则添加用户
        newUser.save(function(err){
            if(err){
                req.session.error=err;
                return res.redirect("/reg");
            }
            req.session.user=newUser;
            req.session.success="注册成功";
            res.redirect("/user_info");
        })
    })
}
/**
 * 跳转登录页面
 * @param req
 * @param res
 */
exports.login=function(req,res){
    res.render('login', { title: "登录页面"});
}
exports.user_info = function(req,res){
    res.render("user_info", { title: "Complete Your Info"});
}

/**
 * 登录操作
 * @param req
 * @param res
 */
exports.doLogin=function(req,res){
    //将登录的密码转成md5形式
    var md5=crypto.createHash("md5");
    var password=md5.update(req.body.password).digest("base64");
    //验证用户
    User.find(req.body.username,function(err,user){
        //首先根据用户名查询是否存在
        if(!user){
            req.session.error="User Not Exists";
            return res.redirect("/login");
        }
        //验证密码是否正确
        if(user.password!=password){
            req.session.error="Please Check Your Telphone or Password";
            return res.redirect("/login");
        }
        req.session.user=user;
        req.session.success="Welcome";
        res.redirect("/");
    })
}
/**
 * 退出操作
 * @param req
 * @param res
 */
exports.logout=function(req,res){
    req.session.user=null;
    req.session.success="退出成功";
    res.redirect("/");
}

exports.admin_login=function(req,res){
    res.render("admin", { title: "Admin"});
}

exports.share=function(req,res){
    res.render("share", { title: "Share"});
}

exports.zone=function(req,res){
    res.render("zone", { title: "Zone"});
}

exports.update_user_info=function(req,res){
    res.render("update_user_info", { title: "Update"});
}

