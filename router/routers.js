const Router = require('koa-router')
const router = new Router
const article = require('../control/article')
//拿到user操作的逻辑对象
const user = require('../control/user')
const comment = require('../control/comment')
const admin = require('../control/admin')
const upload = require('../uit/upload')


router.get('/',user.keepLogin,article.getList)
router.get(/^\/user\/(?=(login|reg))/,async cxt=>{
    const show = /reg$/.test(cxt.path)
    await cxt.render('register',{show})
})


//用户注册路由
router.post('/user/reg',user.reg)
//用户登录路由
router.post('/user/login',user.login)
//用户退出路由
router.get('/user/logout',user.logout)
//用户发表文章
router.get('/article',user.keepLogin,article.addPage)
//添加文章
router.post('/article',user.keepLogin,article.addarticle)
//文章分页
router.get('/page/:id',article.getList)
//文章详情页
router.get('/article/:id',user.keepLogin,article.detail)
//评论
router.post('/comment',user.keepLogin,comment.comment)
//添加管理员
admin.fn()
//文章管理页面
router.get('/admin/:id',user.keepLogin,admin.admin)
//头像上传
router.post('/upload',user.keepLogin,upload.single("file"),user.upload)
//查询评论
router.get('/user/comments',user.keepLogin,comment.comlist)
//查询文章
router.get('/user/articles',user.keepLogin,article.artlist)
//管理员查询用户
router.get('/user/users',user.keepLogin,admin.userlist)
//删除评论
router.delete('/comment/:id',user.keepLogin,comment.del)
//删除文章
router.delete('/article/:id',user.keepLogin,article.del)
//删除用户
router.delete('/user/:id',user.keepLogin,admin.del)
//404
router.get('*',async cxt=>{
    await cxt.render('404',{
        title:'404'
    })
})
module.exports = router