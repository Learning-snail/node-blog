const {db} = require('../Schema/mongoose')
const userSchema = require('../Schema/user')
const User=db.model('users',userSchema)
const passwordHmac = require('../uit/encrypto')
const {join} = require('path')
const fs = require('fs')
exports.fn=async cxt=>{
    await User.find({username:"admin"},(err,data)=>{
        if( err ){
            return err
        }
        if( data.length===0 ){
            const _user=new User({
                username:"admin",
                password:passwordHmac("admin"),
                role:666
            })
            _user.save((err,data)=>{
                if( err )return err
            })
        }else{
            console.log("已被注册");
        }
    })
}
exports.admin=async cxt=>{
     if( cxt.session.isNew ){
         cxt.status=404
         return await cxt.render('404',{
             title:404
         })
     }
     const id = cxt.params.id
     const arr=fs.readdirSync(join(__dirname,"../views/admin"))
     let flag=false
           arr.forEach(v=>{
               const dir=v.replace(/(^admin\-)|(\.pug)$/g,"")
               if( dir===id ){
                   flag=true
               }
           })
    if( flag ){
        await cxt.render("./admin/admin-"+id,{
            role:cxt.session.role,
        })
    }else{
        cxt.status=404
        await cxt.render('404',{
            title:404
        })
    }
}
exports.userlist = async cxt=>{
    const data=await User.find().exec()
    cxt.body={
        code:0,
        count:data.length,
        data,
    }
}
exports.del = async cxt=>{
    const parmsId =cxt.params.id
    let res={
        state:1,
        message:"删除成功"
    }
    await User.findById(parmsId)
        .then(data=>{
            data.remove()
        })
        .catch(err=>{
            res={
                state:0,
                message:"删除失败"
            }
        })
    cxt.body = res
}
