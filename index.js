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

async function getWeather() {
  const result = await axios.get(`http://api.k780.com/?app=weather.realtime&cityNm=${encodeURIComponent('长沙')}&ag=today&appkey=${nowapiConfig.AppKey}&sign=${nowapiConfig.Sign}&format=json`)
  return result.data.result
}

async function getWeather2() {
  const result = await axios.get(`http://aider.meizu.com/app/weather/listWeather?cityIds=101250106`)
  return result.data.value
}

function time(futimg) {
  var nowtime = new Date().getTime(); // 现在时间转换为时间戳
  var futruetime = new Date(futimg).getTime(); // 未来时间转换为时间戳
  var msec = nowtime - futruetime; // 毫秒 未来时间-现在时间
  var time = (msec / 1000);  // 毫秒/1000
  var day = parseInt(time / 86400); // 天  24*60*60*1000 
  console.log(nowtime, 'nowtime')
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
    subject: "今日特报！",
    html: `<div style="width: 300px; height: 300px;display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; position: relative; padding: 16px; box-sizing: border-box;">
        <h1 style="font-size: 36px; margin: 0;">今日特报</h1>
        <div style="background: linear-gradient(to right, rgba(255, 0, 0, 0.7), rgba(255, 165, 0, 0.7)); padding: 16px; border-radius: 8px; max-width: 80%; z-index: 2;">
        <p style="font-size: 16px; margin: 5px 0;">今天: ${weatherInfo[0].weathers[0].week}</p>
        <p style="font-size: 16px; margin: 5px 0;">${time('2024,1,27')}</p>
        <p style="font-size: 16px; margin: 5px 0;">天气：${weatherInfo[0].weathers[0].weather}</p>
        <p style="font-size: 16px; margin: 5px 0;">最高温度: ${weatherInfo[0].weathers[0].temp_day_c}℃</p>
        <p style="font-size: 16px; margin: 5px 0;">最低温度: ${weatherInfo[0].weathers[0].temp_night_c}℃</p>
        <p style="font-size: 16px; margin: 5px 0;">${weatherInfo[0].indexes[2].content}</p>
        <p style="font-size: 16px; margin: 5px 0;">当前金价: ${buy_price}元/g</p>
      
    </div>
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
