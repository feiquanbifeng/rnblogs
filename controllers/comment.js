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
        , topicid = body.topic_id
        , replyid = body.replyId
        , commentId = body.commentId
        , comment_content = body.comment_content;

    var render = function(data) {
        res.redirect('/topic/detail/' + topicid);
    };

    proxy.assign('saveComment', render);

    var comment = new Comment;
    comment.topic_id = topicid;
    comment.content = comment_content;
    comment.user_id = req.session.user._id;
    comment.create_date = new Date;

    console.log(replyid+'这收代理费顶上来')
    console.log(comment);
    Topic.findById(topicid, function(err, topic) {
        if (err)
            return next();
        if (replyid != undefined) {
           // Comment.findById(commentId, function(err, comm) {
               /* if (err)
                    return next();*/
                comment.reply_id = commentId;
                /*comment.save(function(err, next) {
                    if (err)
                        return next();
                    proxy.trigger('saveComment');
               });
                console.log(comm)*/
                /*comm.replyers.push(comment);
                comm.save(function(err) {
                    if (err)
                        return next()
                    proxy.trigger('saveComment');
                });*/
           // });
        } //else {
            comment.save(function(err, comment) {
                if (err)
                    return next();
                Topic.update({_id: topicid}, {$inc: {comments: 1}}, function(err) {
                    if (err)
                        return next();
                    proxy.trigger('saveComment');
                });
            });
        //}
    });
}