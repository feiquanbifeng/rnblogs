/**
 *  util.js 工具类
 *  @author: JY
 *  @since: 2013-03-05
 */
exports.merge = function(target, source, covered) {
    var key;
    for (key in source) {
        if (!covered || !(key in target)) {
            target[key] = source[key];
        }
    }
    return target;
};

exports.formatDate = function(data) {
    var D = new Date(data)
        , hour = D.getHours()
        , since;

    if (hour >= 12 && hour < 18) {
        since = '下午';
    }

    if (hour >= 18 && hour < 20) {
        since = '傍晚';
    }

    if (hour >= 20 && hour < 24) {
        since = '夜晚';
    }

    if (hour >= 0 && hour < 6) {
        since = '凌晨';
    }

    if (hour >= 6 && hour < 9) {
        since = '早晨';
    }

    if (hour >= 9 && hour < 12) {
        since = '上午';
    }

   return D.getFullYear() + '-' + (D.getMonth() + 1) + '-' + D.getDate();
};

exports.formatCommentDate = function(data) {
    var D = new Date(data)
        , hour = D.getHours()
        , format = '';

    if (D.getFullYear() != new Date().getFullYear()) {
        format = D.getFullYear()+ '年';
    }
    format += (D.getMonth() + 1) + '月' + D.getDate() + '日';
    return format
};

exports.paramUrl = function(url) {
    var ret = {}
        , data = url.split('&');
    for (var i = 0; i < data.length; i++) {
        var oc = data[i].split('=');
        ret[oc[0]] = oc[1];
    }
    return ret;
};