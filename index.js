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
  return "我们已经在一起：" + day + "天啦"
}


function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}

const color = ['#23C343', '#0DA5AA', '#3491FA', '#FF7D00', '#E13EDB', '#F754A8', '#9FDB1D', '#FBE842', '#F77234', '#DDBEF6']

async function mail(messageInfo, goldInfo, weatherInfo) {
  let { minVal = -Infinity, maxVal = Infinity } = messageInfo;
  let { buy_price } = goldInfo;
  minVal = parseFloat(minVal);
  maxVal = parseFloat(maxVal);
  buy_price = parseFloat(buy_price);
  if (minVal < buy_price && maxVal > buy_price) {
    return;
  }
  let textLucky;
  switch (weatherInfo[0].weathers[0].week) {
    case '星期一':
      textLucky = '愿你在新的一周里充满活力，迎接每一个挑战，开启美好的旅程！'
      break;
    case '星期二':
      textLucky = '祝你今天心情愉快，工作顺利，愿每一个小目标都能实现！'
      break;
    case '星期三':
      textLucky = '周中快乐！愿你在这一天找到灵感，继续向前迈进，收获满满！'
      break;
    case '星期四':
      textLucky = '祝你今天充满正能量，克服困难，向着周末的美好生活努力！'
      break;
    case '星期五':
      textLucky = '终于到周五了！愿你享受这一天的工作，期待一个愉快的周末！'
      break;
    case '星期六':
      textLucky = '开开心心，放松心情'
      break;
    case '星期日':
      textLucky = '乌拉拉，星期天啦，一周过完啦'
      break;
  }
  const mailOptions = {
    to: messageInfo.mail.replaceAll("、", ","), // 接收人列表,多人用','隔开
    subject: "今日小事-文",
    html: `<div style="width: 500px; height: auto;display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;position: relative; box-sizing: border-box;color: #555555;overflow: hidden;margin: 10px auto;padding: 15px 15px 15px 35px;border-radius: 10px;box-shadow: 6px 0 12px -5px rgb(253, 223, 234), -6px 0 12px -5px rgb(215, 240, 243);background-color: #FFDEE9;background-image: linear-gradient(0deg,#ffdee9c4 0%,#b5fffc8f 100%);background-image: -webkit-linear-gradient(0deg,#ffdee9c4 0%,#b5fffc8f 100%);">
        <p style="font-size: 16px; margin: 5px 0;">今天是<span style="color:${color[getRandomNumber()]}"> ${weatherInfo[0].weathers[0].week}</span></p>
        <p style="font-size: 16px; margin: 5px 0;"><span style="color:${color[getRandomNumber()]}">${textLucky}</span></p>
        <p style="font-size: 16px; margin: 5px 0;"><span style="color:${color[getRandomNumber()]}">${time('2024,1,27', weatherInfo[0].weathers[0].date)}</span></p>
        <p style="font-size: 16px; margin: 5px 0;">天气：<span style="color:${color[getRandomNumber()]}">${weatherInfo[0].weathers[0].weather} </span></p>
        <p style="font-size: 16px; margin: 5px 0;"><span style="color:${color[getRandomNumber()]}">${weatherInfo[0].indexes[2].content} </span></p>
        <p style="font-size: 16px; margin: 5px 0;">最高温度: <span style="color:${color[getRandomNumber()]}">${weatherInfo[0].weathers[0].temp_day_c} </span>℃</p>
        <p style="font-size: 16px; margin: 5px 0;">最低温度:<span style="color:${color[getRandomNumber()]}"> ${weatherInfo[0].weathers[0].temp_night_c} </span>℃</p>
        <p style="font-size: 16px; margin: 5px 0;">当前金价:<span style="color:${color[getRandomNumber()]}">${buy_price}</span>元/g</p>
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
