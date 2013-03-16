/**
 *  topic.js 话题控制层
 *  @author: JY
 *  @since: 2013-03-03
 */
var EventProxy = require('eventproxy').EventProxy
  , models = require('../models')
  , Topic = models.Topic
  , Comment = models.Comment
  , Category = models.Category
  , utils = require('../lib/util');

var Pagination = require('../lib/pagination').Pagination;

exports.index = function(req, res, next) {
    res.render('topic/index', {
        session: req.session
    });
}

exports.create = function(req, res, next) {
    if (!req.session.is_login) {
        res.redirect('login');
        return;
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
        , pagesize = 2
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
            item.content = item.content.length > 100 ? item.content.slice(0, 100) + '...': item.content;
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

    console.log(search);
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
        console.log('简单来说'+categoryRow)
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
        if (comments.length > 0) {
            comments.forEach(function(comment) {
                comment['format'] = utils.formatCommentDate(comment.create_date);
            });
        }

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
        proxy.trigger('findTopicById', topic);
    });

    Comment.find({topic_id: id}).populate('user_id', 'username').sort({create_date: -1}).exec(function(err, comments) {
        if (err)
            return next();

        proxy.trigger('findComments', comments);
    });
}