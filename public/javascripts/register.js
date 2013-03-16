function submitValidate(flg) {
    var msg;

    if ($('#user_login').length != 0) {
        if ($('#user_login').val() == undefined || $('#user_login').val() == '') {
            msg = '请填写用户名！';
            $('#user_login').focus();
            showMsg(msg);
            return false;
        }
    }

    if ($('#user_email').length != 0) {
        if ($('#user_email').val() == undefined || $('#user_email').val() == '') {
            msg = '请填写电子邮箱！';
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

    if ($('#user_password_confirmation').length != 0) {
        if ($('#user_password_confirmation').val() == undefined || $('#user_password_confirmation').val() == '') {
            msg = '请填写确认密码！';
            $('#user_password_confirmation').focus();
            showMsg(msg);
            return false;
        }
    }

    if (($('#user_password').length != 0) && ($('#user_password_confirmation').length != 0)) {
        if ($('#user_password').val() != '' && $('#user_password_confirmation').val() != '') {
            if ($('#user_password').val() != $('#user_password_confirmation').val()) {
                msg = '两次输入密码不一致！';
                $('#user_password').focus();
                showMsg(msg);
                return false;
            }
        }
    }

    return true;
}

function showMsg(msg) {
    $('#validate_info').empty();
    $('#validate_info').show();
    $('#validate_info').append(msg);
}