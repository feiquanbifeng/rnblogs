/**
 *  user.js 用户模型
 *  @author: JY
 *  @since: 2013-03-02
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
    username: String,
    account: String,
    pwd: String,
    email: String,
    locked: {type: Number, default: 0},
    profile: String,
    remark: String,
    avatar: String,
    profile: String,
    follower: [ObjectId],
    following: [ObjectId],
    active: {type: Number, default: 0},
    create_date: {type: Date, default: Date.now},
    update_date: {type: Date, default: Date.now}
});

mongoose.model('User', UserSchema);
