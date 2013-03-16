var models = require('../models')
  , Category = models.Category;

var arr = ['架构设计', 'IT业界', '云计算', '数据库', '编程语言', 'Web前端'];
for (var i = 0; i < 5; i++) {
    var cat = new Category();
    cat.typename = arr[i];
    cat.create_date = new Date();

    cat.save(function(err) {

    });
}