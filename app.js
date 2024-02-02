const fs = require('fs');
const { game_create, game_report, game_get, award_obtain, get_game_score, sleep } = require('./utils.js');
async function start() {
    let configFile = fs.readFileSync('config.txt', 'utf-8')
    let { token, maxScore, activity_id, game_module, game_pk_id } = JSON.parse(configFile)
    if (!token) {
        console.log("请填写token")
        return
    }
    if (game_module) {
        console.log('开启pk模式');
        if (!game_pk_id) {
            console.log("请填写pk_id")
            return
        }
    } else {
        console.log('正常模式');
        game_pk_id = ""
    }
    while (true) {
        let res = await game_create(token, game_pk_id, activity_id);
        // console.log(res);
        if (!!!res.data) {
            console.log(res)
            console.log("创建游戏失败")
            await sleep(1000)
            continue
        }
        let game_id = res.data.game_id
        let gameResult = get_game_score(res, activity_id)
        // console.log(gameResult);
        let game_score = gameResult.game_report_score_info.game_score
        let pk_score
        if (game_module) {
            console.log("由于当前为pk模式，开始获取对方pk分数");
            let res3 = await game_get(token, game_id, activity_id);
            pk_score = res3.data.game_detail_info.game_pk_info.opponent_play_score
            console.log("对方分数：" + pk_score + "，已将本次目标分数改为" + pk_score + "分以上");
            maxScore = pk_score
        }
        if (game_score <= maxScore) {
            console.log("本次游戏分数：" + game_score + "，分数未达标，继续努力")
            await sleep(100)
            continue
        }
        if (game_module) {
            gameResult.game_report_score_info.total_score = pk_score + game_score
        }
        console.log("本次游戏分数：" + game_score + "，分数达标，等待30秒后上报");
        await sleep(30 * 1000)
        let res2 = await game_report(token, gameResult);
        console.log(res2);
        if (res2.errcode === 0) {
            console.log("分数上报成功，即将领取" + gameResult.game_report_score_info.total_score + "提现券");
            console.log("本次游戏id(用于其他人pk你)：" + game_id);
        } else {
            console.log("分数上报失败，错误信息：" + res2.msg);
            return
        }

        let res4 = await award_obtain(token, game_id, activity_id);
        console.log(res4);
        if (res4.errcode === 0) {
            console.log("奖励领取成功成功");
            return
        } else {
            console.log("奖励领取失败，可能是你领取过了，错误信息：" + res4.msg);
            return
        }
    }
}

const readline = require('readline');
// 创建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
// 检查文件是否存在于当前目录中。 
fs.access("config.txt", fs.constants.F_OK, (err) => {
    console.log(`config.txt ${err ? '不存在' : '存在'}`);
    if (err) {
        console.log("检测到当前目录下不存在config.txt文件，请先创建config.txt文件并填写相关信息后再运行脚本")
        try {
            fs.writeFileSync('config.txt',
                `{
            "token":"你的token",
            "maxScore":7000,
            "activity_id":1000013,
            "game_module":false,
            "game_pk_id":""
        }`, 'utf-8'
            )
            rl.question('已自动为您创建config.txt文件，请填写相关信息后再运行脚本(按回车键退出)' , (port) => {
                rl.close();
            });
        } catch (error) {
            console.log("创建config.txt文件失败，请手动创建config.txt文件并填写相关信息后再运行脚本");
        }
        return
    }else{
        start()
    }
});