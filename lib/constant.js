/**
 *  constant.js 常量配置处理类
 *  @author: JY
 *  @since: 2013-03-11
 */
exports.config = function(type, subject, email) {
    var head
      , body;
    switch (type) {
        case 1:
            this.head = subject || '激活账号邮件已发送成功!';
            this.body = '我们已将邮件发送至您的<strong>' + email + '</strong>在24小时内容激活账号. 如果几分钟内还没收到，查看是否当做了垃圾邮件处理.'
            break;
        case 2:
            this.head = subject || '账号成功激活!';
            this.body = '您的账号\<strong\>' + (email || '') + '\</strong\>已经激活. 登录成功后可以直接修改密码.'
            break;
        case 3:
            this.head =  ubject || '激活账号邮件已发送成功!';
            this.body = '我们已将邮件发送至您的\<strong\>' + email + '\</strong\>在24小时内容重置依然有效. 如果几分钟内还没收到，查看是否当做了垃圾邮件处理.'
            break;
        default:
            throw new Error('常量封装出错');
    }
    return this;
}