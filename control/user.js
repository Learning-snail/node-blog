const {db} = require('../Schema/mongoose')
const userSchema = require('../Schema/user')
const User=db.model('users',userSchema)
const passwordHmac = require('../uit/encrypto')

// 注册模块
exports.reg =async (cxt)=>{
    const user=cxt.request.body
    const username = user.username
    const password = user.password
    await new Promise((resolve,reject)=>{
        User.find({username},(err,data)=>{
            if( err )return reject(err)
            //说明已注册
            if( data.length!==0 ){
                return resolve("")
            }
            //说明没被注册
               const _user=new User({
                   username,
                   password:passwordHmac(password)
               })
                _user.save((err,data)=>{
                    if( err ){
                        reject(err)
                    }else{
                        resolve(data)
                    }
                })

        })
    })
        .then(async data=>{
            if( data ){
                await cxt.render('isOk',{
                    status:'注册成功'
                })
            }else{
                await cxt.render('isOk',{
                    status:'已被注册'
                })
            }
        })
        .catch(async err=>{
            await cxt.render('isOk',{
                status:'注册失败请重试'
            })
        })
}
//登录模块
exports.login = async cxt=>{
    const user=cxt.request.body
    const username = user.username
    const password = user.password
    await new Promise((resolve,reject)=>{
        User.find({username,password:passwordHmac(password)},(err,data)=>{
            if( err ){
                return reject(err)
            }
            //存在账号
            if( data.length!==0 ){
                return resolve(data)
            }
            //不存在账号
                return resolve("")
        })
    })
        .then(async data=>{
            if( data ){
                cxt.cookies.set("username",username,{
                    domain:"localhost",
                    path:"/",
                    maxAge:36e5,
                    httpOnly:true,//不能让前端访问这个cookie
                    overwrite:false
                })
                cxt.cookies.set("uid",data[0]._id,{
                    domain:"localhost",
                    path:"/",
                    maxAge:36e5,
                    httpOnly:true,//不能让前端访问这个cookie
                    overwrite:false
                })
                cxt.session={
                    username,
                    uid:data[0]._id,
                    avatar:data[0].avatar,
                    role:data[0].role
                }
                await cxt.render('isOk',{
                    status:'登录成功'
                })
            }else{
                await cxt.render('isOk',{
                    status:'账号或密码不正确'
                })
            }
        })
        .catch(async err=>{
            await cxt.render('isOk',{
                status:'登录失败'
            })
        })
}
//判断状态
exports.keepLogin = async (cxt,next)=> {
    if( cxt.session.isNew ){//没有session
        if( cxt.cookies.get("username") ){
            let uid =cxt.cookies.get("uid")
            let avatar= await User.find({_id:uid}).then(data=>data.avatar)
            cxt.session={
                username:cxt.cookies.get("username"),
                uid:cxt.cookies.get("uid"),
                avatar
            }
        }
}
    await next()
}
//退出模块
exports.logout = async cxt=>{
    cxt.cookies.set("username",null,{
        maxAge:0
    })
    cxt.cookies.set("uid",null,{
        maxAge:0
    })
    cxt.session=null
    cxt.redirect('/')
}
//头像上传
exports.upload = async cxt=>{
    const filename = cxt.req.file.filename
    let data={}
    await User.updateOne({_id:cxt.session.uid},{$set:{avatar:"/avatar/"+filename}},(err,d)=>{
        if( err ){
            data={
                status:0,
                message:err
            }
        }else{
            data={
                status:1,
                message:"上传成功"
            }
        }
    })
    cxt.body=data
}



