const {Schema} = require('./mongoose')

const userSchema = new Schema({
    username:String,
    password:String,
    avatar:{
        type:String,
        default:"/avatar/default.jpg"
    },
    role:{
        type:Number,
        default: 1
    },
    articleNum:{
      type:Number,
      default:0
    },
    commentNum:{
        type:Number,
        default:0
    }
},{
    versionKey:false
})
//删除用户
//删除用户的文章
//删除用户的评论及文章下的评论
//让各自的评论更新
userSchema.post("remove",doc=>{
    const {db} = require('../Schema/mongoose')
    const articleSchema = require('../Schema/article')
    const Article=db.model('articles',articleSchema)



    const CommentSchema = require('../Schema/comment')
    const Comment=db.model('comments',CommentSchema)
    Comment.find({from:doc._id}).then(data=>{
            data.forEach(v=>{v.remove()})
        }
    )
    Article.find({author:doc._id}).then(data=>{
        data.forEach(v=>{
            v.remove()
        })
    })

})

module.exports = userSchema