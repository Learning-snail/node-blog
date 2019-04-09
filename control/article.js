const {db} = require('../Schema/mongoose')
const articleSchema = require('../Schema/article')
const Article=db.model('articles',articleSchema)
const userSchema = require('../Schema/user')
const User=db.model('users',userSchema)
const CommentSchema = require('../Schema/comment')
const Comment=db.model('comments',CommentSchema)
//发表文章页
exports.addPage = async cxt=>{
    await cxt.render('add-article',{
        title:'文章发表页',
        session:cxt.session
    })
}
//发表文章
exports.addarticle = async cxt=>{
    if( cxt.session.isNew ){
        return cxt.body={
            msg:'用户未登录',
            status:0
        }
    }
    const data=cxt.request.body
     data.author = cxt.session.uid
     data.commentNum=0
    await new Promise((resolve,reject)=>{
            new Article(data)
            .save((err,data)=>{
                if( err ){
                    return reject(err)
                }
                resolve(data)
            })
    })
        .then(data=>{
            cxt.body={
                msg:"发表成功",
                status:1
            }
            //文章数量更新
            User.updateOne({_id:data.author},{$inc:{articleNum:1}},err=>{
                if( err ){
                    return console.log(err)
                }
            })
        })
        .catch(err=>{
            cxt.body={
                msg:"发表失败",
                status:0
            }
            }

        )
}
//显示文章页数
exports.getList = async cxt=>{
    let page = cxt.params.id || 1
    const maxNum = await Article.estimatedDocumentCount((err,num)=>err?console.log(err):num)
    --page
    const artList=await Article
        .find()
        .sort('-created')
        .skip(5*page)
        .limit(5)
        .populate({
            path:'author',
            select:'username _id avatar'
        })
        .then(data=>data)
        .catch(err=>{
            console.log(err);
        })
    await cxt.render("index",{
        title:'博客首页',
        session:cxt.session,
        artList,
        maxNum,

    })
}
//文章详情页
exports.detail = async cxt=>{
    const id = cxt.params.id
    const article=await Article
        .findById(id)
        .populate("author","username")
        .then(data=>data)
        .catch(err=>{
            console.log(err);})
    const comment=await Comment
        .find({article:id})
        .populate("from","username avatar")
        .then(data=>data)
        .catch(err=>err)
        await cxt.render('article',{
            title:article.title,
            session:cxt.session,
            article,
            comment
        })

}
//文章列表
exports.artlist = async cxt=>{
    const uid = cxt.session.uid
    const data = await Article.find({author:uid})
    cxt.body={
        code:0,
        count:data.length,
        data
    }
}
//文章删除
exports.del = async cxt=>{
    const parmsId = cxt.params.id
    let res={
        state:1,
        message:"删除成功"
    }
    await Article.findById(parmsId)
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