/**
 *  topic.js 话题模型
 *  @author: JY
 *  @since: 2013-03-05
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var models = require('../models');
var User = models.User
  , Comment = models.Comment
  , Category = models.Category
  , ObjectId = Schema.Types.ObjectId;

var TopicSchema = new Schema({
    title: {type: String, index: true},
    content: String,
    _creator: {type: ObjectId, ref: 'User' },
    comments: {type: Number, default: 0},
    hits: {type: Number, default: 0},
    type: {type: ObjectId, ref: 'Category'},
    create_date: {type: Date, default: Date.now},
    update_date: {type: Date, default: Date.now}
});

mongoose.model('Topic', TopicSchema);