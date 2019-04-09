const {db} = require('../Schema/mongoose')
const CommentSchema = require('../Schema/comment')
const Comment = db.model("comments",CommentSchema)
const articleSchema = require('../Schema/article')
const Article=db.model('articles',articleSchema)
const userSchema = require('../Schema/user')
const User=db.model('users',userSchema)
exports.comment = async cxt=>{
    let message={
        status:0,
        msg:"登录才能发表"
    }
    //验证状态
    if( cxt.session.isNew ){
        return cxt.body=message
    }
    //登录的状态
    const data = cxt.request.body
    data.from = cxt.session.uid
    const _comment =new Comment(data)
    await _comment
        .save()
        .then(data=>{
            message={
                status:1,
                msg:"发表成功"
            }
            //计数器
            Article.update({_id:data.article},{$inc:{commentNum:1}},err=> {
                    if (err) {
                         return console.log(err)
                    }
                }
            )
            //评论数量更新
            User.update({_id:data.from},{$inc:{commentNum:1}},err=>{
                if( err ){
                    //return console.log(err)
                }
            })
        })
        .catch(err=>{
            message={
                status:0,
                msg:err
            }
        })
    cxt.body = message

}
exports.comlist = async cxt=>{
    const uid = cxt.session.uid
    const data = await Comment.find({from:uid}).populate("article","title")
    cxt.body={
        code:0,
        count:data.length,
        data
    }

}
exports.del = async cxt=>{
    const comparms = cxt.params.id
    let res={
        state:1,
        message:"删除成功"
    }
    await Comment.findById(comparms)
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