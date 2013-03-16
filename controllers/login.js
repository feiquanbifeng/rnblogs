/**
 *  login.js 用户登录控制层
 *  @author: JY
 *  @since: 2013-03-03
 */
var crypto = require('crypto')
    , EventProxy = require('eventproxy').EventProxy
    , smtpTransport = require('../lib/mail')
    , base64 = require('../lib/base64')
    , util = require('../lib/util')
    , constants = require('../lib/constant');

var models = require('../models');
var User = models.User;

exports.reg = function(req, res, next) {
    req.session.error = req.flash('error');
    res.render('login/register', {
        session: req.session
    });
}

exports.register = function(req, res, next) {
    // 检验用户两次输入的口令是否一致
    if (req.body['password_confirmation'] != req.body['password']) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/register');
    }

    // 生成口令的散列值
    var md5 = crypto.createHash('md5');
    var ppassword = md5.update(req.body.password).digest('base64');

    var pusername = req.body.username
        , pemail = req.body.email;

    if (pusername == '' || pemail == '') {
        req.flash('error', '信息输入不完整!');
        return res.redirect('/register');
    }

    User.find({email: pemail}, function (err, userRow) {
        if (err) {
            return next(err);
        }
        if (userRow.length > 0) {
            req.flash('error', '该邮箱已经被注册过，请选择其他邮箱!');
            req.session.error = req.flash('error');
            res.render('login/register', {
                session: req.session
            });
            return;
        }

        user = new User();
        user.username = pusername;
        user.pwd = ppassword;
        user.email = pemail;
        user.active = 0;
        user.save(function (err) {
            if (err)
                return next(err);

            try {
                var activateURL = 'http://localhost:3000/register/active/' + encodeURIComponent(base64.encode('accounts=' + encodeURIComponent(pemail) + '&timestamp=' + new Date().getTime() + '&nick=' + encodeURIComponent(pusername)));
            } catch(e) {
                console.log('注册报错:' + e);
                return;
            }
            var mailOptions = {
                from: 'FloatBlog <rnblogs.jy@gmail.com',
                to: pemail,
                subject: pusername + '欢迎注册飞扬博客！',
                html: '<p><b>亲爱的' + pusername + '! </b>欢迎注册飞扬博客。</p><p>这是来自飞扬博客中心的验证邮件，用来验证您的注册邮箱真实有效。</p><p>请点击以下链接激活帐号。</p><p><a href="' + activateURL + '" target="_blank">' + activateURL + '</a></p>'
            };
            smtpTransport.sendMail(mailOptions);
            res.render('login/send_mail', {
                session: req.session,
                subject: '激活账号'
            });
            return;
        });
    });
}

exports.index = function(req, res, next) {
    req.session.error = req.flash('error');
    res.render('login/index', {
        session: req.session
    });
}

exports.login = function (req, res, next) {
    if (req.session.is_login) {
        res.redirect('/');
    } else {
        var proxy = new EventProxy()
            , pname = req.body.username.trim()
            , ppwd = req.body.password.trim();

        var render = function(data) {
            res.redirect('/');
        };

        // 生成口令的散列值
        var md5 = crypto.createHash('md5');
        var ppassword = md5.update(ppwd).digest('base64');

        proxy.assign('findUser', render);

        var where = {};
        where = {'email': pname, 'pwd': ppassword};

        if (pname && ppassword) {
            User.findOne(where, function(err, userRow) {
                if (err)
                   return next(err);
                if (userRow != null) {
                    if (userRow.active == 0) {
                        req.flash('error', '账号还没有激活，请激活！');
                        return res.redirect('/login');
                    } else {
                        req.session.is_login = true;
                        req.session.user = userRow;
                        proxy.trigger('findUser', userRow);
                    }
                } else {
                    req.flash('error', '用户名或密码错误！');
                    return res.redirect('/login');
                }
            });
        } else {
            req.flash('error', '请输入完整信息！');
            return res.redirect('/login');
        }
    }
}

exports.logout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
}

exports.forgot = function(req, res, next) {
    req.session.error = req.flash('error');
    console.log(req.flash('error')+'周四送大礼分类登录')
    res.render('login/forgot_password', {
        session: req.session
    });
}

exports.sendmail = function(req, res, next) {

    var proxy = new EventProxy()
        , pemail = req.body.email;

    var render = function(data) {

        res.render('login/send_mail', {
            session: req.session,
            subject: '密码重置'
        });
    };

    proxy.assign('sendMail', render);

    User.findOne({email: pemail}, function(err, userRow) {
        if (err) {
            return next();
        }

        if (userRow == null) {
            req.flash('error', '对不起！该邮箱尚未注册，请确认输入正确的邮箱地址！');
            res.redirect('/forgot_password');
            return;
        }
        var nick = userRow.username;
        try {
            var activateURL = 'http://localhost:3000/password/reset/' + encodeURIComponent(base64.encode('accounts=' + encodeURIComponent(pemail) + '&timestamp=' + new Date().getTime() + '&nick=' + encodeURIComponent(nick)));
        } catch(e) {
            console.log('注册报错:' + e);
            return;
        }

        var mailOptions = {
            from: 'FloatBlog <rnblogs.jy@gmail.com',
            to: pemail,
            subject: '[FloatBlog]找回您的账户密码！',
            html: '<p><b>亲爱的' + nick + '您好! </b></p><p>您收到这封这封电子邮件是因为您 (也可能是某人冒充您的名义) 申请了一个新的密码。假如这不是您本人所申请, 请不用理会这封电子邮件, 但是如果您持续收到这类的信件骚扰, 请您尽快联络管理员。</p><p>要使用新的密码, 请使用以下链接启用密码。</p><p><a href="' + activateURL + '" target="_blank">' + activateURL + '</a></p>'
        };
        smtpTransport.sendMail(mailOptions);
        proxy.trigger('sendMail');
    });
}

exports.resetpwd = function(req, res, next) {
    res.render('login/reset_password', {
        session: req.session
    });
}

exports.updatepwd = function(req, res, next) {
    var proxy = new EventProxy()
        , activeData = util.paramUrl(base64.decode(decodeURIComponent(req.params.active)));

    for(var i in activeData){
        activeData[i] = decodeURIComponent(activeData[i]);
    }

    // 生成口令的散列值
    var md5 = crypto.createHash('md5');
    var ppassword = md5.update(req.body.password).digest('base64');

    var render = function(args) {
        var message
            , checkUrl = args[0]
            , findUser = args[1]
            , updateUser = args[2];

        if (!checkUrl) {
            message = '重置密码的URL不合法或已经过期超时';
        } else if (!findUser) {
            message = '此帐号无效';
        } else if (!updateUser) {
            message = '密码重置失败请重试';
        }

        res.render('login/send_mail', {
            session: req.session,
            subject: message
        });
    };

    if (!activeData['accounts'] || ! activeData['timestamp'] || ! activeData['nick']) {
        proxy.immediate('render', render, [false]);
    } else if ((new Date()).getTime() - parseInt(activeData['timestamp'], 10) > 1000 * 60 * 60 * 3) {
        proxy.immediate('render', render, [false]);
    } else {
        User.findOne({email: activeData['accounts'], username: activeData['nick']}, function(err, userRow) {
            if (err) {
                proxy.immediate('render', render, [true, false]);
            } else {
                userRow.pwd = ppassword;
                userRow.save(function(err) {
                    if (err) {
                        return next();
                    }
                    proxy.immediate('render', render, [true, true, true]);
                });
            }
        });
    }
}

exports.active = function(req, res, next) {
    if (req.session.is_login) {
        res.redirect('/');
    } else {
        var proxy = new EventProxy(),
            activeData = util.paramUrl(base64.decode(decodeURIComponent(req.params.active)));
        for(var i in activeData){
            activeData[i] = decodeURIComponent(activeData[i]);
        }

        var render = function(args) {
            var message
                , checkUrl = args[0]
                , findUser = args[1]
                , updateUser = args[2];

            if (checkUrl && findUser && updateUser) {
                message = activeData['accounts'] + ' 帐号已经被激活，您可以登录以后修改密码！';
            } else if (!checkUrl) {
                message = '激活的URL不合法或已经过期超时';
            } else if (!findUser) {
                message = '此帐号已经被激活了';
            } else if (!updateUser) {
                message = '激活失败请重试';
            }

            res.render('login/send_mail', {
                session: req.session,
                subject: message
            });
        };

        if (!activeData['accounts'] || ! activeData['timestamp'] || ! activeData['nick']) {
            proxy.immediate('render', render, [false]);
        } else if ((new Date()).getTime() - parseInt(activeData['timestamp'], 10) > 1000 * 60 * 60 * 3) {
            proxy.immediate('render', render, [false]);
        } else {
            User.findOne({email: activeData['accounts'], username: activeData['nick']}, function(err, userRow) {
                if (err) {
                    proxy.immediate('render', render, [true, false]);
                } else {
                    userRow.active = 1;
                    userRow.save(function(err) {
                        if (err) {
                            return next();
                        }
                        proxy.immediate('render', render, [true, true, true]);
                    });
                }
            });
        }
    }
}