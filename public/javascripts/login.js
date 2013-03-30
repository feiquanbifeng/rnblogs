function submitValidate(flg) {
    var msg;

    if ($('#user_email').length != 0) {
        if ($('#user_email').val() == undefined || $('#user_email').val() == '') {
            msg = '请填写登录邮箱！';
            $('#user_email').focus();
            showMsg(msg);
            return false;
        } else {
            if (!$('#user_email').val().match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)) {
                msg = '格式不正确！请重新输入';
                $("#user_email").focus();
                showMsg(msg);
                return false;
            }
        }
    }

    if ($('#user_password').length != 0) {
        if ($('#user_password').val() == undefined || $('#user_password').val() == '') {
            msg = '请填写密码！';
            $('#user_password').focus();
            showMsg(msg);
            return false;
        }
    }


    return true;
}

function showMsg(msg) {
    $('#validate_info').empty();
    $('#validate_info').show();
    $('#validate_info').append('<h3 style="margin: 0">' + msg +'</h3>');
}