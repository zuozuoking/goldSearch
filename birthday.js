// 引入 lunar-javascript 库
const { Lunar } = require('lunar-javascript');

const getDateNum = (data, year) => {
  let currentBirthDate = data.split('-')
  currentBirthDate.splice(0, 1, year)
  return currentBirthDate
}
/**
 * 
 * @param {*} birthDate 
 * @param {*} type   0 是阳历 1是阴历
 * @param {*} nowDate  当前时间  2024-11-29
 * @param {*} name    
 * @returns 
 */
function getNextLunarBirthday(birthDate, type, nowDate, name) {
  const today = new Date(nowDate).getTime(); // 获取当前日期
  const currentYear = new Date(nowDate).getFullYear()
  let currentBirthDate = getDateNum(birthDate, currentYear)
  if (type) {
    let yData = Lunar.fromYmd(...currentBirthDate)
    currentBirthDate = new Date(yData.getSolar().toString()).getTime()
  } else {
    currentBirthDate = new Date(currentBirthDate.join('-')).getTime()
  }
  if (currentBirthDate === today) {
    return `祝${name}生日快乐！`;
  }
  if (currentBirthDate < today) {
    if (type) {
      yData = Lunar.fromYmd(...getDateNum(birthDate, currentYear + 1))
      currentBirthDate = new Date(yData.getSolar().toString()).getTime()
    } else {
      currentBirthDate = new Date(getDateNum(birthDate, currentYear + 1).join('-')).getTime()
    }
  }
  const result = Math.ceil((currentBirthDate - today) / (1000 * 60 * 60 * 24))
  return `距离${name}生日还有${result}天`


}

// 调用方法
// console.log(getNextLunarBirthday('1998-1-27', 0, '2024-11-29', '宝宝'))


module.exports = {
  getNextLunarBirthday
}
