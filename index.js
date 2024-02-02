// 账号token
let token=""
// 大于多少分提交游戏领取提现券
let maxScore = 7000
// 游戏activity_id
let activity_id = 1000013
// 模式，true为开启pk，false为关闭 (js中首字母为小写)
let game_module = true
// pk_id 要pk的对应id
let game_pk_id  = ""
// 以下为游戏代码，若有问题可自行更改

const { game_create,game_report,game_get,award_obtain,get_game_score,sleep } = require('./utils.js');
if(!token){
    console.log("请填写token")
    return
}
if(game_module){
    console.log('开启pk模式');
    if(!game_pk_id){
        console.log("请填写pk_id")
        return
    }
}else{
    console.log('正常模式');
    game_pk_id = ""
}

async function start() {
    while (true) {
        let res = await game_create(token, game_pk_id, activity_id);
        // console.log(res);
        if(!!!res.data) {
            console.log("创建游戏失败")
            await sleep(1000)
            continue
        }
        let game_id = res.data.game_id
        let gameResult = get_game_score(res,activity_id)
        // console.log(gameResult);
        let game_score = gameResult.game_report_score_info.game_score
        let pk_score
        if(game_module){
            console.log("由于当前为pk模式，开始获取对方pk分数");
            let res3 = await game_get(token, game_id, activity_id);
            pk_score = res3.data.game_detail_info.game_pk_info.opponent_play_score
            console.log("对方分数："+pk_score+"，已将本次目标分数改为"+pk_score+"分以上");
            maxScore = pk_score
        }
        if(game_score <= maxScore){
            console.log("本次游戏分数："+game_score+"，分数未达标，继续努力")
            await sleep(100)
            continue
        }
        if(game_module){
            gameResult.game_report_score_info.total_score = pk_score + game_score
        }
        console.log("本次游戏分数："+game_score+"，分数达标，等待30秒后上报");
        await sleep(30 * 1000)
        let res2 = await game_report(token,gameResult);
        console.log(res2);
        if(res2.errcode === 0){
            console.log("分数上报成功，即将领取"+gameResult.game_report_score_info.total_score+"提现券");
            console.log("本次游戏id(用于其他人pk你)：" + game_id);
        }else{
            console.log("分数上报失败，错误信息："+res2.msg);
            return
        }

        let res4 = await award_obtain(token, game_id, activity_id);
        console.log(res4);
        if(res4.errcode === 0){
            console.log("奖励领取成功成功");
            return
        }else{
            console.log("奖励领取失败，可能是你领取过了，错误信息："+res4.msg);
            return
        }
    }
}

start()