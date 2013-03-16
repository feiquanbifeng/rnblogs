/**
 *  index.js 首页控制层
 *  @author: JY
 *  @since: 2013-03-02
 */
var Pagination = require('../lib/pagination').Pagination;

exports.index = function (req, res, next) {
    res.render('index', {
        session: req.session,
        pagination: new Pagination({
            currentpage: 1,
            pagesize: 15,
            total: 142,
            url: '/topic?page='
        }).init()
    });
}
