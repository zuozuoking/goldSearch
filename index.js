const axios = require("axios");
const sendMail = require("./mail.js");
const { nowapiConfig } = require("./config.js");

async function getTableDate() {
  return new Promise((resolve) => {
    resolve({
      type: "金价监控",
      minVal: "550",
      maxVal: "580",
      mail: "304160997@qq.com",
    });
  });
}
//获取黄金交易所今日金价
async function getGoldPrice() {
  const result = await axios.get(
    `https://sapi.k780.com/?app=finance.gold_price&goldid=1053&appkey=${nowapiConfig.AppKey}&sign=${nowapiConfig.Sign}&format=json`
  );
  return result.data.result.dtList["1053"];
}

async function getWeather2() {
  const result = await axios.get(`http://aider.meizu.com/app/weather/listWeather?cityIds=101250106`)
  return result.data.value
}

function time(futimg, now) {
  var nowtime = new Date(now).getTime(); // 现在时间转换为时间戳
  var futruetime = new Date(futimg).getTime(); // 未来时间转换为时间戳
  var msec = nowtime - futruetime; // 毫秒 未来时间-现在时间
  var time = (msec / 1000);  // 毫秒/1000
  var day = parseInt(time / 86400); // 天  24*60*60*1000 
  console.log(now, 'nowtime')
  return "我们已经在一起：<br>" + day + "天了"
}

async function mail(messageInfo, goldInfo, weatherInfo) {
  let { minVal = -Infinity, maxVal = Infinity } = messageInfo;
  let { buy_price } = goldInfo;
  minVal = parseFloat(minVal);
  maxVal = parseFloat(maxVal);
  buy_price = parseFloat(buy_price);
  if (minVal < buy_price && maxVal > buy_price) {
    return;
  }
  const mailOptions = {
    to: messageInfo.mail.replaceAll("、", ","), // 接收人列表,多人用','隔开
    subject: "今日小事-文",
    html: `<div style="width: 500px; height: 300px;display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;position: relative; box-sizing: border-box;color: #555555;overflow: hidden;margin: 10px auto;padding: 15px 15px 15px 35px;border-radius: 10px;box-shadow: 6px 0 12px -5px rgb(253, 223, 234), -6px 0 12px -5px rgb(215, 240, 243);background-color: #FFDEE9;background-image: linear-gradient(0deg,#ffdee9c4 0%,#b5fffc8f 100%);background-image: -webkit-linear-gradient(0deg,#ffdee9c4 0%,#b5fffc8f 100%);">
        <p style="font-size: 16px; margin: 5px 0;">今天: ${weatherInfo[0].weathers[0].week}</p>
        <p style="font-size: 16px; margin: 5px 0;">${time('2024,1,27', weatherInfo[0].weathers[0].date)}</p>
        <p style="font-size: 16px; margin: 5px 0;">天气：${weatherInfo[0].weathers[0].weather}</p>
        <p style="font-size: 16px; margin: 5px 0;">最高温度: ${weatherInfo[0].weathers[0].temp_day_c}℃</p>
        <p style="font-size: 16px; margin: 5px 0;">最低温度: ${weatherInfo[0].weathers[0].temp_night_c}℃</p>
        <p style="font-size: 16px; margin: 5px 0;">${weatherInfo[0].indexes[2].content}</p>
        <p style="font-size: 16px; margin: 5px 0;">当前金价: ${buy_price}元/g</p>
       </div>
        `,
  };
  await sendMail(mailOptions);
}
const main = async () => {
  const reqList = [getGoldPrice(), getTableDate(), getWeather2()];
  const [goldInfo, messageInfo, weatherInfo] = await Promise.all(reqList);
  await mail(messageInfo, goldInfo, weatherInfo);
  process.exit(0);
};

main();
