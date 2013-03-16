/**
 *  type.js 分类模型
 *  @author: JY
 *  @since: 2013-03-14
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    typename: String,
    create_date: {type: Date, default: Date.now}
});

mongoose.model('Category', CategorySchema);