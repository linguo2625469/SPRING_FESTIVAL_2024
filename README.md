# SPRING_FESTIVAL_2024
微信支付有优惠小程序龙年冲冲冲游戏刷免费提现券脚本,使用nodejs实现

```text
2024-02-02 更新新年活动
```
# 使用说明
```text
1. 抓包小程序 把url里的session_token=后面的东西填入脚本里的token变量

// 账号token
let token="ABBwEaIDAAABAAAAAAB8670JETviIVgOOqC8ZRAAAAClvZTgDOvAQq仅为示例请自行更改为自己的token"
// 大于多少分提交游戏领取提现券
let maxScore = 7000

2. 如果要玩pk模式 就修改game_pk_id变量 并将game_module改为true 例如

// 模式，true为开启pk，false为关闭 (js中首字母为小写)
let game_module = true
// pk_id 要pk的对应id
let game_pk_id  = "258919-00-ruUqYsOgvGUyMDaaaa"

```
运行环境
```text
Nodejs v18以上
```

模块安装：
```text
npm install
```

运行
```text
node index.js
```

#  新增pkg打包方法，不会打包的去release下载
首先安装pkg和ncc模块
```text
npm install pkg -g
npm install ncc -g
```
使用ncc将代码编译一次
```text
ncc build app.js -o dist
```
然后使用pkg打包编译后的js
```text
pkg ./dist/index.js -o app
```

然后你就看到目录下多了个app.exe 另外将config.txt放在统一文件夹内
首先修改config.txt中的参数 然后双击app.exe即可运行


pkg安装 打包失败的请参考
[Pkg打包nodejs程序过程中遇到的问题与处理](https://blog.csdn.net/qq_37887537/article/details/109692670)


若npm install 请自行百度更换npm源方法 或者使用pnpm cnpm 等

#  警告：软件免费开源，仅供学习交流使用，请勿用于非法用途！