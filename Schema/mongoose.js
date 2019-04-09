const mongoose = require('mongoose')
const db = mongoose.createConnection('mongodb://localhost:27017/blogproject',{
    useNewUrlParser:true
})
mongoose.Promise = global.Promise
db.on("err",()=>{
    console.log("连接失败");
})
db.on("open",()=>{
    console.log("连接成功");
})
const Schema = mongoose.Schema



module.exports={
    db,
    Schema
}