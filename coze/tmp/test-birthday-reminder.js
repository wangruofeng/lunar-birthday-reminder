// 测试生日提醒计算逻辑
const { Lunar, Solar } = require('lunar-javascript');

console.log('=== 测试生日提醒计算逻辑 ===\n');

// 模拟当前日期
const today = new Date();
today.setHours(0, 0, 0, 0);
console.log(`今天日期：${today.toISOString().split('T')[0]}\n`);

// 测试数据：假设今天是2024-12-01，添加一个农历六月初十的生日
// 这个时候农历六月初十对应的阳历是2024-07-15
// 但在2025年，农历六月初十对应的阳历应该重新计算
const currentYear = today.getFullYear();

console.log('=== 测试用例1：农历六月初十 ===');
const birthday = {
  name: '张三',
  lunarMonth: 6,
  lunarDay: 10,
  solarMonth: 7,  // 这是2024年的阳历月份
  solarDay: 15    // 这是2024年的阳历日期
};

console.log(`农历生日：${birthday.lunarMonth}月${birthday.lunarDay}日`);
console.log(`保存的阳历日期（添加时的年份）：${birthday.solarMonth}月${birthday.solarDay}日`);

// 错误的计算方式（当前代码）
console.log('\n【错误计算方式】直接使用保存的阳历日期：');
const solarDateWrong = new Date(currentYear, birthday.solarMonth - 1, birthday.solarDay);
console.log(`计算结果：${solarDateWrong.toISOString().split('T')[0]}`);

// 正确的计算方式
console.log('\n【正确计算方式】根据农历生日重新计算阳历日期：');
const lunar = Lunar.fromYmd(currentYear, birthday.lunarMonth, birthday.lunarDay);
const solar = lunar.getSolar();
const solarDateCorrect = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
console.log(`计算结果：${solarDateCorrect.toISOString().split('T')[0]}`);

console.log('\n=== 对比结果 ===');
console.log(`错误方式计算的阳历日期：${solarDateWrong.toISOString().split('T')[0]}`);
console.log(`正确方式计算的阳历日期：${solarDateCorrect.toISOString().split('T')[0]}`);

// 计算距离今天的天数
const daysUntilWrong = Math.floor((solarDateWrong.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
const daysUntilCorrect = Math.floor((solarDateCorrect.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

console.log(`\n距离今天的天数：`);
console.log(`错误方式：${daysUntilWrong} 天`);
console.log(`正确方式：${daysUntilCorrect} 天`);

if (daysUntilWrong !== daysUntilCorrect) {
  console.log('\n❌ 计算结果不一致！当前代码有bug！');
  console.log(`相差：${Math.abs(daysUntilWrong - daysUntilCorrect)} 天`);
} else {
  console.log('\n✅ 计算结果一致');
}

console.log('\n=== 测试用例2：农历正月初一（春节）===');
const birthday2 = {
  name: '李四',
  lunarMonth: 1,
  lunarDay: 1,
  solarMonth: 2,
  solarDay: 10,
  solarYear: 2024
};

console.log(`农历生日：${birthday2.lunarMonth}月${birthday2.lunarDay}日`);
console.log(`保存的阳历日期（2024年的）：${birthday2.solarMonth}月${birthday2.solarDay}日`);

console.log('\n【错误计算方式】直接使用保存的阳历日期：');
const solarDateWrong2 = new Date(currentYear, birthday2.solarMonth - 1, birthday2.solarDay);
console.log(`计算结果：${solarDateWrong2.toISOString().split('T')[0]}`);

console.log('\n【正确计算方式】根据农历生日重新计算阳历日期：');
const lunar2 = Lunar.fromYmd(currentYear, birthday2.lunarMonth, birthday2.lunarDay);
const solar2 = lunar2.getSolar();
const solarDateCorrect2 = new Date(solar2.getYear(), solar2.getMonth() - 1, solar2.getDay());
console.log(`计算结果：${solarDateCorrect2.toISOString().split('T')[0]}`);

console.log('\n=== 对比结果 ===');
console.log(`错误方式计算的阳历日期：${solarDateWrong2.toISOString().split('T')[0]}`);
console.log(`正确方式计算的阳历日期：${solarDateCorrect2.toISOString().split('T')[0]}`);

const daysUntilWrong2 = Math.floor((solarDateWrong2.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
const daysUntilCorrect2 = Math.floor((solarDateCorrect2.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

console.log(`\n距离今天的天数：`);
console.log(`错误方式：${daysUntilWrong2} 天`);
console.log(`正确方式：${daysUntilCorrect2} 天`);

if (daysUntilWrong2 !== daysUntilCorrect2) {
  console.log('\n❌ 计算结果不一致！当前代码有bug！');
  console.log(`相差：${Math.abs(daysUntilWrong2 - daysUntilCorrect2)} 天`);
} else {
  console.log('\n✅ 计算结果一致');
}
