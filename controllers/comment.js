/**
 *  comment.js 评论控制层
 *  @author: JY
 *  @since: 2013-03-06
 */
var EventProxy = require('eventproxy').EventProxy
    , models = require('../models')
    , Comment = models.Comment
    , Topic = models.Topic;

exports.create = function(req, res, next) {
    var proxy = new EventProxy();

    var body = req.body
        , topic_id = body.topic_id
        , comment_content = body.comment_content;

    if (comment_content.length <= 0 || comment_content.length > 10) {
        req.session.error = '评论内容不能为空或超过5000个字节';
        res.redirect('/topic/detail/' + topic_id);
        return;
    }

    var render = function(data) {
        res.redirect('/topic/detail/' + topic_id);
    };

    proxy.assign('saveComment', render);

    var comment = new Comment;
    comment.topic_id = topic_id;
    comment.content = comment_content;
    comment.user_id = req.session.user._id;
    comment.create_date = new Date;

    console.log(comment);
    Topic.findById(topic_id, function(err, topic) {
        if (err)
            return next();
        comment.save(function(err, comment) {
            if (err)
                return next();
            Topic.update({_id: topic_id}, {$inc: {comments: 1}}, function(err) {
                if (err)
                    return next();
                proxy.trigger('saveComment');
            });
        });
    });
}