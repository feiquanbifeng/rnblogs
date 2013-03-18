/**
 *  base.js 基本模型
 *  @author: JY
 *  @since: 2013-03-17
 */
var mongoose = require('mongoose')
  , BSON = require('mongodb').BSON
  , ObjectID = require('mongodb').ObjectID
  , GridStore = require('mongodb').GridStore;

var BaseProvider = function() {
    this.db = mongoose.connection.db;
};

BaseProvider.prototype.createImage = function (data, callback) {
    //process.nextTick(function(){
    console.log(this.db)
    var gridStore = new GridStore(this.db, new ObjectID(), 'w', {"content_type": "image/png", "chunk_size": data.length});
    gridStore.open(function(err, gridStore) {
        gridStore.write(data, function() {
            gridStore.close(function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('insert ok.');
                    callback(result);
                }
            });
        });
    });
    //});
};

BaseProvider.prototype.findImage = function(fileId, callback) {
    console.log('read ...'+fileId);
    var gridStore = new GridStore(this.db, new ObjectID(fileId));
    gridStore.open(function (err, gridStore) {
        if (err) {
            console.log(err);
        } else {
            gridStore.read(function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('read ok');
                    callback(data);
                }
            });
        }
    });
};

BaseProvider.prototype.getCollection = function(collection, callback) {
    this.db.collection(collection, function(error, collection) {
        if (error) {
            callback(error);
        } else {
            callback(null, collection);
        }
    });
};

BaseProvider.prototype.save = function(data, collection, callback) {
    this.getCollection(collection, function(error, collection) {
        if (error) {
            callback(error)
        } else {
            collection.insert(data, function() {
                callback(null, data);
            });
        }
    });
};

exports.BaseProvider = BaseProvider;
