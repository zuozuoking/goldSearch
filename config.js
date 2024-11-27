const PASS = process.env.PASS;
const SEND_MAIL = process.env.SEND_MAIL
const APP_KEY = process.env.APP_KEY;
const SIGN = process.env.SIGN;


module.exports = {
  mail: {
    host: "smtp.qq.com", // 主机
    secureConnection: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
      user: `304160997@qq.com`, // 自己用于发送邮件的账号
      pass: `${PASS}`, // 授权码(这个是假的,改成自己账号对应即可,获取方法: QQ邮箱-->设置-->账户-->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务-->IMAP/SMTP开启 复制授权码)
    },
  },
  dbConfig: {
    host: "localhost",
    user: "root", //数据库账号
    password: "jyeontu", //数据库密码
    database: "test", //数据库名称
  },
  nowapiConfig: {
    AppKey: APP_KEY, //替换成自己的AppKey
    Sign: `${SIGN}`, //替换成自己的Sign
  },
};
