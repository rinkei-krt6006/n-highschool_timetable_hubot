'use strict';
const directory = "./";
let fs = require('fs');
let cron = require('cron').CronJob;

function member(){
    let now = new Date();
    let week = now.getDay();
    let temp = fs.readFileSync(directory + "schoolmember.txt", 'utf8');
    temp = temp.split("\r\n");
    for(let i=0;i<7;i++){
        if(week===i){
            temp=temp[i];
        }
    }
    temp+=" ";
    return temp;
}

module.exports = (robot) => {

    let ch = "#代々木CPチャイムbot"

    var send = function (channel, msg) {
        return robot.send({
            room: channel
        }, msg);
    };

    robot.hear(/add/i, (msg) => {
        let temp = fs.readFileSync(directory + "schoolmember.txt", 'utf8');
        temp = temp.split("\r\n");
        let msgtemp = msg.message.text;
        msgtemp = msgtemp.split(",");
        msgtemp = msgtemp[1];

        let week = ["sun","mon","tue","wed","thu","fri","sat"];
        for(let i=0;i<7;i++){
            if(msgtemp === week[i]){
                temp[i]+=",@"+msg.message.user.name;
                send(ch,"@"+msg.message.user.name+" 登録しました。");
            }
            if(msgtemp==="week"&&0<i&&i<6){
                temp[i]+=",@"+msg.message.user.name;
                send(ch,"@"+msg.message.user.name+" 登録しました。");
            }
        }
        let tmp = ""
        for(let i=0;i<7;i++){
            tmp+=temp[i]+"\r\n";
        };
        fs.writeFileSync(directory + 'schoolmember.txt',tmp,'utf8');
    });


    robot.hear(/remove/i,(msg)=>{
        let temp = fs.readFileSync(directory + "schoolmember.txt", 'utf8');
        temp = temp.split("\r\n");
        let msgtemp = msg.message.text;
        msgtemp = msgtemp.split(",");
        msgtemp = msgtemp[1];
        let week = ["sun","mon","tue","wed","thu","fri","sat"];
        for(let i=0;i<7;i++){
            if(msgtemp === week[i]){
                let tmp=temp[i].split(",");
                for(let i=0;i<tmp.length;i++){
                    if("@"+msg.message.user.name===tmp[i]){
                        tmp.splice(i,1);
                        send(ch,"@"+msg.message.user.name+" 削除しました。");
                    }
                }
                temp[i]=tmp;
            }
            if(msgtemp === "all"){
                let tmp=temp[i].split(",");
                for(let i=0;i<tmp.length;i++){
                    if("@"+msg.message.user.name===tmp[i]){
                        tmp.splice(i,1);
                        send(ch,"@"+msg.message.user.name+" 削除しました。");
                    }
                }
                temp[i]=tmp;
            }
        }
        let tmp = "";
        for(let i=0;i<7;i++){
            tmp+=temp[i]+"\r\n";
        }
        fs.writeFileSync(directory + 'schoolmember.txt',tmp,'utf8');
    });

    robot.hear(/check/i,(msg)=>{
        let temp = fs.readFileSync(directory + "schoolmember.txt", 'utf8');
        temp = temp.split("\r\n");
        let sendtemp ="登録メンバー一覧"
        let week = ["sun","mon","tue","wed","thu","fri","sat"];
        for(let i=0;i<7;i++){
            sendtemp += "\r\n"+week[i]+" "
                let tmp = temp[i].split(",@");
                sendtemp += tmp.join(",")
                }
                let sendtmp = sendtemp
        send(ch,sendtmp)
    })
/*
    new cron('* * * * * *', function () {
        return send(ch, member() + "テスト");
    }).start();
*/

    //秒,分,時間,日,月,曜日
    new cron('0 30 9 * * *', function () {
        return send(ch, member() + "1限開始時刻です。");
    }).start();
    new cron('0 30 10 * * *', function () {
        return send(ch, member() + "1限終了時刻です。");
    }).start();
    new cron('0 40 10 * * *', function () {
        return send(ch, member() + "2限開始時刻です。");
    }).start();
    new cron('0 30 11 * * *', function () {
        return send(ch, member() + "2限終了時刻です。");
    }).start();
    new cron('0 40 11 * * *', function () {
        return send(ch, member() + "3限開始時刻です。");
    }).start();
    new cron('0 30 12 * * *', function () {
        return send(ch, member() + "3限終了、昼休み開始時刻です。");
    }).start();
    new cron('0 0 13 * * *', function () {
        return send(ch, member() + "昼休み終了まであと10分です。");
    }).start();
    new cron('0 10 13 * * *', function () {
        return send(ch, member() + "4限開始時刻です。");
    }).start();
    new cron('0 40 13 * * *', function () {
        return send(ch, member() + "4限終了時刻です。");
    }).start();
    new cron('0 50 13 * * *', function () {
        return send(ch, member() + "5限開始時刻です。");
    }).start();
    new cron('0 40 14 * * *', function () {
        return send(ch, member() + "5限終了時刻です。");
    }).start();
    new cron('0 50 14 * * *', function () {
        return send(ch, member() + "6限開始時刻です。");
    }).start();
    new cron('0 40 15 * * *', function () {
        return send(ch, member() + "本日の授業はすべて終了です。\r\n使い方\r\n https://rinkei-krt6006.github.io/n-highschool_timetable_hubot/");
    }).start();
};
