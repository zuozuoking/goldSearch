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
    html: `<div style="width: 100%; height: 300px;display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; position: relative; padding: 20px; box-sizing: border-box;">
    <h1 style="font-size: 36px; margin: 0;">今日特报</h1>
    <div style="background: linear-gradient(to right, rgba(255, 0, 0, 0.7), rgba(255, 165, 0, 0.7)); padding: 20px; border-radius: 8px; max-width: 80%; z-index: 2;">
        <p style="font-size: 20px; margin: 5px 0;">今天是${weatherInfo[0].weathers[0].week}</p>
        <p style="font-size: 20px; margin: 5px 0;">天气：${weatherInfo[0].weathers[0].weather}</p>
        <p style="font-size: 20px; margin: 5px 0;">最高温度为 ${weatherInfo[0].weathers[0].temp_night_c}℃</p>
        <p style="font-size: 20px; margin: 5px 0;">最低温度为 ${weatherInfo[0].weathers[0].temp_day_c}℃</p>
        <p style="font-size: 20px; margin: 5px 0;">当前金价为 ${buy_price} 元/g</p>
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
