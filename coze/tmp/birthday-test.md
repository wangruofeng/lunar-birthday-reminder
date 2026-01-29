# 生日提醒计算Bug分析

## 问题场景
假设今天是 2025-06-18

添加一个生日：
- 姓名：张三
- 农历生日：六月初十
- 添加时间：2024-12-01（这个时候计算出的阳历日期是2024-07-15）

保存的数据：
```json
{
  "name": "张三",
  "lunarMonth": 6,
  "lunarDay": 10,
  "solarMonth": 7,
  "solarDay": 15,
  "solarYear": 2024
}
```

## 当前错误的计算逻辑
```typescript
// 使用保存的阳历月份和日期来计算今年的生日
let solarDate = new Date(currentYear, birthday.solarMonth - 1, birthday.solarDay);
// 结果：2025-07-15
```

这个逻辑的问题是：
- 它直接使用了添加时计算的阳历日期（2024年的7月15日）
- 而不是根据农历生日（六月初十）重新计算2025年的阳历日期

## 正确的阳历日期应该是
农历六月初十在2025年对应的阳历日期应该是：
- 2025年农历六月初十 = 2025年7月5日（需要用lunar-javascript库重新计算）

## 修复方案
应该使用 lunar-javascript 库根据农历生日（lunarMonth, lunarDay）重新计算今年的阳历日期：

```typescript
// 根据农历生日计算今年的阳历日期
const lunar = Lunar.fromYmd(currentYear, birthday.lunarMonth, birthday.lunarDay);
const solar = lunar.getSolar();
let solarDate = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
```
