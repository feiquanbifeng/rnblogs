/**
 *  mail.js 邮件处理类
 *  @author: JY
 *  @since: 2013-03-05
 */
var nodemailer = require('nodemailer');
var util = require('../lib/util');

var transport = nodemailer.createTransport('SMTP', {
    // use well known service
    service: 'Gmail',
    auth: {
        user: 'rnblogs.jy@gmail.com',
        pass: 'rnblogsjy'
    }
});

exports.sendMail = function(options, callback) {
    var _config = {
        sender: 'rnblogs.jy@gmail.com',
        headers: {}
    };

    util.merge(_config, options);
    transport.sendMail(_config, function(err) {
        if (err) {
            console.log('发送邮件错误!');
            console.log(err.message);
            return;
        }
    });
}