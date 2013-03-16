/**
 *  comment.js 评论模型
 *  @author: JY
 *  @since: 2013-03-05
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var models = require('../models');
var User = models.User
  , Topic = models.Topic
  , ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    topic_id: {type: ObjectId, ref: 'Topic'},
    user_id: {type: ObjectId, ref: 'User'},
    reply_id: {type: ObjectId, ref: 'User'},
    content: String,
    create_date: {type: Date, Default: Date.now}
});

mongoose.model('Comment', CommentSchema);