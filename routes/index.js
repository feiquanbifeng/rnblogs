/**
 *  index.js 路由选择规则
 *  @author: JY
 *  @since: 2013-03-02
 */
var user = require('../controllers/user')
  , index = require('../controllers/index')
  , login = require('../controllers/login')
  , topic = require('../controllers/topic')
  , comment = require('../controllers/comment')
  , about  = require('../controllers/about');

module.exports = function (app) {

    app.get('/', topic.list);
    app.get('/index', topic.list);
    app.post('/', topic.list);
    app.get('/topic/category/:id', topic.list);

    app.get('/signup', login.reg);
    app.post('/signup', login.register);
    app.get('/signup/active/:active', login.active);

    app.get('/login', login.index);
    app.post('/login', login.login);
    app.get('/logout', login.logout);

    app.get('/forgot_password', login.forgot);
    app.post('/forgot_password', login.sendmail);

    app.get('/password/reset/:active', login.resetpwd);
    app.post('/password/reset/:active', login.updatepwd);

    app.get('/topic/index', topic.index);
    app.post('/topic/create', topic.create);
    app.get('/topic/:page?', topic.list);
    app.get('/topic/detail/:id', topic.detail);
    app.get('/topic/remove/:id', topic.remove);
    app.get('/topic/list/:id', topic.userlist);

    app.post('/comment/create', comment.create);

    app.get('/user/setting', user.setting);
    app.post('/user/profile', user.profile);

    app.get('/about', about.index);

    app.get('/image', user.readImage);
}
