/**
 *  user.js 用户账户控制层
 *  @author: JY
 *  @since: 2013-03-02
 */
var models = require('../models');
var fs = require('fs');
var User = models.User;
var EventProxy = require('eventproxy').EventProxy;
var BaseProvider = require('../models/base').BaseProvider;
var baseModel = new BaseProvider('192.168.1.119', 27017);
/*var Canvas = require('canvas');
 var Image = Canvas.Image;*/

exports.reg = function(req, res, next) {

}

exports.setting = function(req, res, next) {
    res.render('user/setting', {
        session: req.session,
        filepath: ''
    });
}

exports.profile = function(req, res, next) {
    var tmp_path = req.files.thumbnail.path;
    var filename = req.files.thumbnail.name

    console.log(tmp_path + filename + '===' +req.body.profilenew);
    var target_path = './public/images/uploads/' + filename;

    var realData = req.body.profile;
    /*img = new Image;


     img.onload = function() {
     var canvas,ctx;

     canvas = new Canvas(width,height);
     ctx = canvas.getContext('2d');
     ctx.drawImage(img, 20,50 ,120, 120, 0, 0,58,58);
     canvas.toBuffer(function(err, buf) {
     if (err) callback(err);
     });
     img.onerror = function(err) {
     console.log(err);
     callback(err);
     };

     img.src = realData;
     };*/
    var base64Data = realData.replace(/^data:image\/\w+;base64,/, "");
    var binaryData = new Buffer(base64Data, 'base64').toString('binary');

    process.nextTick(function () {
        baseModel.createImage(binaryData, function (result) {
            console.log('file id:' + result._id);
            var obj = {imgId: result._id};

            baseModel.save(obj, 'items', function (err, item) {
                console.log('save to mongodb:' + obj._id);
            });
        });
    });

    /* fs.rename(tmp_path, target_path, function(err) {
     if (err)
     return next();

     fs.unlink(tmp_path, function() {
     if (err) throw err;
     res.render('user/setting',{'filepath': '/images/uploads/' + filename, session: req.session});
     });
     });*/
};

exports.readImage = function(req, res) {
    console.log('get image');
    res.contentType('image/png');
    var fileId = req.param('fileId');
    baseModel.findImage(fileId, function (data) {
        console.log('read data');
        res.send(data);
    });
};
