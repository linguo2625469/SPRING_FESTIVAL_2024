const axios = require("axios");
const headers = {
    "Content-Type": "application/json",
    Host: "payapp.weixin.qq.com",
    Origin: "https://td.cdn-go.cn",
    "Wepaytest-Proxyip": "905333",
    Referer: "https://td.cdn-go.cn/",
    "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.38(0x18002629) NetType/WIFI Language/zh_CN miniProgram/wxe73c2db202c7eebf",
};
function game_create(token, pk_id, activity_id) {
    return new Promise(async (resolve, reject) => {
        let data={
            activity_id: activity_id,
            game_pk_id: pk_id,
        }
        try {
            let res = await axios.post(
                "https://payapp.weixin.qq.com/coupon-center-activity/game/create?session_token=" + token,data
                ,
                {
                    headers: headers,
                }
            )
            resolve(res.data)
        } catch (error) {
            reject(error)
        }
    })
}

function game_report(token, reportBody) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await axios.post(
                "https://payapp.weixin.qq.com/coupon-center-activity/game/report?session_token=" +
                token,
                reportBody,
                {
                    headers: headers,
                }
            )
            resolve(res.data)
        } catch (error) {
            reject(error)
        }
    })
}

function award_obtain(token, game_id, activity_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await axios.post(
                "https://payapp.weixin.qq.com/coupon-center-activity/award/obtain?session_token=" + token,
                {
                    activity_id: activity_id,
                    game_id: game_id,
                    obtain_ornament: true,
                    request_id: "osd2L5dPS6045tkAuZfV9qJFU1" + getRandomString(16),
                    coutom_version: "6.49.0",
                },
                {
                    headers: headers,
                }
            )
            resolve(res.data)
        } catch (error) {
            reject(error)
        }
    })
}

function game_get(token, game_id, activity_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let res =  await axios.get(
                `https://payapp.weixin.qq.com/coupon-center-activity/game/get?session_token=${token}&activity_id=${activity_id}&game_id=${game_id}&need_share_qrcode_content=true&coutom_version=6.49.0`,
                {
                    headers: headers,
                }
            )
            resolve(res.data)
        } catch (error) {
            reject(error)
        }
    })
}



function get_game_score(body,activity_id) {
    let game_id = body.data.game_id;
    let dragon_boat_2023_play_script = []
    body.data.play_script.dragon_boat_2023_play_script.tracks.forEach(arr => {
        arr.props.forEach(arr2 => {
            dragon_boat_2023_play_script.push(arr2)
        })
    })
    // console.log(dragon_boat_2023_play_script);
    let game_score = 0
    let score_items = []
    dragon_boat_2023_play_script.forEach(item => {
        if (item.score > 0) {
            game_score = item.score + game_score
            score_items.push({
                "prop_id": item.prop_id,
                "award_score": item.score,
                "fetch_timestamp_ms": new Date().getTime()
            })
        }
    });
    let play_body = {
        "game_id": game_id,
        "activity_id": activity_id,
        "game_report_score_info": {
            "game_score": game_score,
            "total_score": game_score,
            "score_items": score_items
        }
    }
    return play_body
}

function getRandomString(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}


function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })

}




// 导出所有函数
module.exports = {
    game_create,
    game_report,
    award_obtain,
    game_get,
    get_game_score,
    getRandomString,
    sleep
}