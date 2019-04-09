const {Schema} = require('./mongoose')
const ObjectId = Schema.Types.ObjectId
const CommontSchema = new Schema({
    content:String,
    article:{
        type:ObjectId,
        ref:"articles"
    },
    from:{
        type:ObjectId,
        ref:"users"
    }
},{
    versionKey:false,
    timestamps:{
        createdAt: "created"
    }
})
CommontSchema.post("remove",(doc)=>{
    const {db} = require('../Schema/mongoose')
    const articleSchema = require('../Schema/article')
    const Article=db.model('articles',articleSchema)
    const userSchema = require('../Schema/user')
    const User=db.model('users',userSchema)
    Article.updateOne({_id:doc.article},{$inc:{commentNum:-1}}).exec()
    User.updateOne({_id:doc.from},{$inc:{commentNum:-1}}).exec()
})
module.exports = CommontSchema
