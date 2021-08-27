## 开通@open

目前可以在uniCloud web控制台购买redis服务，**所购买的实例由阿里云提供，并非由DCloud提供，DCloud只提供购买入口**

1. 登录[uniCloud web控制台](https://unicloud.dcloud.net.cn/)
2. 选择一个**阿里云**服务空间
3. 选择左侧redis菜单，开通的redis实例会自动和当前服务空间绑定

![开通redis](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f184e7c3-1912-41b2-b81f-435d1b37c7b4/f7073761-7f19-497f-91cf-7b79270c06b4.jpg)

## 规格说明@type

|规格				|CPU核数|每秒新建连接数上限	|连接数上限	|带宽（MB/s）	|QPS参考值|
|--					|--			|--									|--					|--						|--				|
|256MB主从版|2			|10,000							|10,000			|10						|80,000		|
|1GB主从版	|2			|10,000							|10,000			|10						|80,000		|
|2GB主从版	|2			|10,000							|10,000			|16						|80,000		|
|4GB主从版	|2			|10,000							|10,000			|24						|80,000		|
|8GB主从版	|2			|10,000							|10,000			|24						|80,000		|

## 费用说明@fee

### 新购@new

购买redis实例时，选择较长的”购买时长“可以享受更多的折扣

### 续费@renew

在uniCloud web控制台redis详情页面可以对redis实例进行续费操作。

实例到期后的第1~7天，实例状态为被禁用，无法被访问。如需继续使用，您需要及时为实例续费

实例处于被禁用状态后，以您执行续费操作的时间为起点计算包年包月时长，例如您的实例在2021年04月10日到期，在2021年04月15日执行手动续费1个月的操作，那么实例的到期时间即为2021年5月15日。

### 升配@upgrade

在uniCloud web控制台redis详情页面可以对redis实例进行升配操作。升级配置需要按照剩余时间补足差额

升级实例配置所需费用 =（升级后实例每天的价格 - 升级前实例每天的价格）× 服务到期的剩余天数

### 降配@downgrade

在uniCloud web控制台redis详情页面可以对redis实例进行降配操作。

目前可以降配但是无法退还费用到您的账号，如果您有降配需求建议到套餐有效期快结束时