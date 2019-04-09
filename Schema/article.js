const {Schema} = require('./mongoose')
const ObjectID =Schema.Types.ObjectId
const ArticleSchema = new Schema({
    title:String,
    content:String,
    author:{
        type:ObjectID,
        ref:"users"
    },
    tips:String,
    commentNum:Number
},{
    versionKey:false,
    timestamps:{
        createdAt:"created"
    }
})
    ArticleSchema.post("remove",doc=>{
        const {db} = require('../Schema/mongoose')
        const CommentSchema = require('../Schema/comment')
        const Comment=db.model('comments',CommentSchema)
        const userSchema = require('../Schema/user')
        const User=db.model('users',userSchema)
        User.updateOne({_id:doc.author},{$inc:{articleNum:-1}}).exec()
        Comment.find({article:doc._id}).then(data=>{
            data.forEach(v=>{v.remove()})
        })
    })
module.exports=ArticleSchema