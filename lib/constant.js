/**
 *  constant.js 常量配置处理类
 *  @author: JY
 *  @since: 2013-03-11
 */
exports.config = function() {

    this.reset_password = {
        head: '重置密码邮件已发送成功!',
        body: '我们已将邮件发送至您的\<strong\>email\</strong\>在24小时内容重置依然有效. 如果几分钟内还没收到，查看是否当做了垃圾邮件处理.'
    };
    this.register = {
        head: '激活账号邮件已发送成功!',
        body: '我们已将邮件发送至您的\<strong\>email\</strong\>在24小时内容激活账号依然有效. 如果几分钟内还没收到，查看是否当做了垃圾邮件处理.'
    };
    this.active = {
        head: '',
        body: ''
    };
}