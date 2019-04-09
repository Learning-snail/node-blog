const koa=require('koa')
const static = require('koa-static')
const router = require('./router/routers')
const { join } = require('path')
const views = require('koa-views')
const logger = require('koa-logger')
const body = require('koa-body')
const session = require('koa-session')
//生成koa实例
const app = new koa
app.keys=['王']
//session的配置对象
const CONFIG = {
    key:"Sid",
    maxAge:36e5,
    signed:true,
    rolling:true
}
//注册日志模块
//app.use(logger())
//注册session
app.use(session(CONFIG,app))
//配置静态资源目录
app.use(static(join(__dirname,"public")))
//配置视图模板
app.use(views(join(__dirname,"views"),{
   extension: "pug"
}))
app.use(body())
//绑定路由
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000,()=>{
    console.log("监听3000");
})
