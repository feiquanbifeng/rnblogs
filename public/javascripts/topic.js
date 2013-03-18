function submitValidate(flg) {
    var msg = '<h4>警告!</h4>';


    if ($('#title').val() == undefined || $('#title').val() == '') {
        msg += '请填写文章标题';
        $('#title').focus();
        showMsg(msg);
        return false;
    } else {
        if ($('#title').val().length > 100) {
            msg += '文章标题不能超过100个字数';
            $('#title').focus();
            showMsg(msg);
            return false;
        }
    }


    if ($('#wmd-input').val() == undefined || $('#wmd-input').val() == '') {
        msg += '文章内容不能为空，请输入内容';
        $('#wmd-input').focus();
        showMsg(msg);
        return false;
    }

    return true;
}

function showMsg(msg) {
    $('#warning-info').empty();
    $('#warning-info').show();
    $('#warning-info').append(msg);
}