/**
 *  topic.js 话题控制层
 *  @author: JY
 *  @since: 2013-03-03
 */
var EventProxy = require('eventproxy').EventProxy
  , models = require('../models')
  , Topic = models.Topic
  , User = models.User
  , Comment = models.Comment
  , Category = models.Category
  , utils = require('../lib/util');

var Pagination = require('../lib/pagination').Pagination;

exports.index = function(req, res, next) {
    if (!req.session.is_login) {
        return res.redirect('login');
    }

    var proxy = new EventProxy();

    var render = function(categories) {
        res.render('topic/index', {
            categories: categories,
            session: req.session
        });
    };

    proxy.assign('findCategories', render);
    Category.find({}, function(err, categories) {
        if (err) {
            console.log(err)
            return next();
        }
        proxy.trigger('findCategories', categories);
    });
}

exports.create = function(req, res, next) {
    if (!req.session.is_login) {
        return res.redirect('login');
    }

    var proxy = new EventProxy();
    var render = function(data) {
        res.redirect('/');
    }

    proxy.assign('saveTopic', render);
    var topic = new Topic();
    var body = req.body;
    topic.title = body.title;
    topic.content = body.t_content;
    topic.type = body.categoryRadios;
    topic.create_date = new Date;
    topic._creator = req.session.user._id;

    topic.save(function(err) {
        if (err)
            return next();
        proxy.trigger('saveTopic');
    });
}

exports.list = function(req, res, next) {

    var page = req.query.page
      , pagesize = 15
      , search = req.body.search
      , type = req.params.id
      , proxy = new EventProxy;

    if (page && isNaN(page)) {
        res.redirect('404');
        return;
    } else if (page == undefined || page == 1) {
        page = 0;
    } else {
        page = page - 1;
    }

    var split = page * pagesize;
    var render = function(topics, topicscount, categorys, hots) {

        topics.forEach(function(item) {
            // use the util format date
            item['formate'] = utils.formatDate(item.create_date);
            item.content = item.content.length > 150 ? item.content.slice(0, 150) + '...': item.content;
        });

        res.render('index', {
            session: req.session,
            topics: topics,
            categorys: categorys,
            hots: hots,
            pagination: new Pagination({
                currentpage: page + 1,
                pagesize: pagesize,
                total: topicscount,
                url: '/topic?page='
            }).init()
        });
    };

    var where = {};

    if (search != '' && search != undefined) {
        where = {$or: [{'title': /search/}, {'content': /search/}]};
    }

    if (type != undefined) {
        where.type = type;
    }

    proxy.assign('topics', 'topicscount', 'categorys', 'hots', render);
    Topic.find(where).populate('_creator', 'username').populate('type', 'typename').sort({create_date: -1}).skip(split).limit(pagesize).exec(function(err, topics) {
        if (err)
            return next;
        if (topics != null) {
            proxy.trigger('topics', topics);
        }
    });

    Topic.count(where, function(err, counts) {
        if (err)
            return next();
        proxy.trigger('topicscount', counts);
    });

    Category.find({}, function(err, categoryRow) {
        if (err) {
            console.log(err)
            return next();
        }
        proxy.trigger('categorys', categoryRow);
    });

    Topic.find({}).sort({hits: -1}).limit(6).exec(function(err, hots) {
        if (err)
            return next();
        proxy.trigger('hots', hots);
    });
}

exports.detail = function(req, res, next) {

    var id = req.param('id');
    var proxy = new EventProxy();

    var render = function(topic, comments) {
        req.session.error = req.flash('error');
        /*if (comments.length > 0) {
            comments.forEach(function(comment) {
                comment['replyers'] = [];
                comment['format'] = utils.formatCommentDate(comment.create_date);*/
               /* Comment.find({topic_id: comment.topic_id, reply_id: comment._id}).populate('user_id', 'username').exec(function(err, replies) {
                    if (err)
                        return next()
                    console.log(replies+'这是关联的啊')
                 comment['replyers'] = replies;
                });*/

                /*if (comment.replyers.length > 0) {
                    comment.replyers.forEach(function(reply) {
                        console.log(reply.user_id + '======='+reply);
                        reply['id'] = reply.user_id;


                            User.findById(reply['id']).select('username').exec(function(err, user) {
                                reply['username'] = user.username;
                                console.log(user+'[[[[[[[[[[[[[[[[[[[[[')
                            });

                        console.log('&&&&&&&&&&')
                        reply['format'] = utils.formatCommentDate(reply.create_date);
                        console.log(reply['username']+'******************'+reply['id'])
                    });
                }*/
           /* });
        }*/

        console.log(comments + '领导是否了')
        res.render('topic/detail', {
            session: req.session,
            topic: topic,
            comments: comments
        });
    };

    proxy.assign('findTopicById', 'findComments', render);
    Topic.findByIdAndUpdate(id, {$inc: {hits: 1}}).populate('_creator', 'username').exec(function(err, topic) {
        if (err)
            return next();
        if (topic != null) {
            topic['formate'] = utils.formatDate(topic.create_date);
        }
        console.log(topic+'阵法地方')
        proxy.trigger('findTopicById', topic);
    });

    Comment.find({topic_id: id}).populate('user_id', 'username').sort({create_date: -1}).exec(function(err, comments) {
        if (err)
            return next();
        console.log('ddf')
        var replies2 = [];

        for (var i = comments.length - 1; i >= 0; i--) {
            comments[i]['format'] = utils.formatCommentDate(comments[i].create_date);
            if (comments[i].reply_id) {
                replies2.push(comments[i]);
                comments.splice(i, 1);
            }
        }

        for (var j = 0; j < comments.length; j++) {
            comments[j].replies = [];
            for (var k = 0; k < replies2.length; k++) {

                var id1 = comments[j]._id;
                var id2 = replies2[k].reply_id;
                if (id1.toString() === id2.toString()) {
                    comments[j].replies.push(replies2[k]);
                }
            }
            console.log(comments[j].replies);
            comments[j].replies.reverse();
        }

        console.log(comments+'不得了了')
        /*comments.forEach(function(comment) {
            if (comment.reply_id) {
                replies2.push(comment);
                comments.splice(i, 1);
            }
            comment['replyers'] = [];
            comment['format'] = utils.formatCommentDate(comment.create_date);
            Comment.find({topic_id: comment.topic_id, reply_id: comment._id}).populate('user_id', 'username').exec(function(err, replies) {
                if (err)
                    return next()
                console.log(replies+'这是关联的啊')
                comment['replyers'] = replies;
            });
        });*/


        proxy.trigger('findComments', comments);
    });
}

exports.remove = function(req, res, next) {
    var proxy = new EventProxy()
      , id = req.param('id');

    if (!req.session.is_login) {
        res.redirect('/login');
        return;
    }

    render = function() {
        res.redirect('/index');
    }

    proxy.assign('removeComment', 'removeTopic', render);

    Comment.remove({topic_id: id}, function(err, comments) {
        if (err) {
            return next();
        } else {
            proxy.trigger('removeComment');
        }
    });

    Topic.remove({_id: id}, function(err, topics) {
        if (err) {
            return next();
        } else {
            proxy.trigger('removeTopic');
        }
    });
}

exports.userlist = function(req, res, next) {

    var page = req.query.page
      , pagesize = 15
      , search = req.body.search
      , userid = req.param('id')
      , proxy = new EventProxy;

    if (page && isNaN(page)) {
        res.redirect('404');
        return;
    } else if (page == undefined || page == 1) {
        page = 0;
    } else {
        page = page - 1;
    }

    var split = page * pagesize;
    var render = function(topics, topicscount) {
        console.log(topics+'lsdflsd'+topicscount)
        topics.forEach(function(item) {
            // use the util format date
            item['formate'] = utils.formatCommentDate(item.create_date);
        });

        res.render('topic/list', {
            session: req.session,
            topics: topics,
            pagination: new Pagination({
                currentpage: page + 1,
                pagesize: pagesize,
                total: topicscount,
                url: '/topic/list?page='
            }).init()
        });
    };

    var where = {};

    if (search != '' && search != undefined) {
        where = {$or: [{'title': /search/}, {'content': /search/}]};
    }

    where._creator = userid;
    console.log(where)
    proxy.assign('topics', 'topicscount', render);
    Topic.find(where, {title: 1, create_date: 1, comments: 1, hits: 1}).sort({create_date: -1}).skip(split).limit(pagesize).exec(function(err, topics) {
        if (err)
            return next;
        if (topics != null) {
            proxy.trigger('topics', topics);
        }
    });

    Topic.count(where, function(err, counts) {
        if (err)
            return next();
        proxy.trigger('topicscount', counts);
    });
}