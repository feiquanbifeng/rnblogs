/**
 *  about.js 关于控制层
 *  @author: JY
 *  @since: 2013-03-05
 */
exports.index = function(req, res, next) {
    res.render('about/index', {
        session: req.session
    });
};