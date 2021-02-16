// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({event})
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID

  // 获取用户信息
  app.router('getUserInfo', async ctx => {
    
    let userInforList = ''
    // 1. 根据openId查询表里是否有信息
    let resInfo = await db.collection('userInfor').where({
      openId: openid
    }).get()
    if(resInfo.data.length){ // 如果用户信息存在直接查询信息并返回给前台
      userInforList = resInfo.data
    }else{ // 如果用户信息不存在则往用户表里新增一条用户信息
      let vipNumber = ""
      let uuId = function guid() {
        return 'xxyy4xyxyy'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
      }
      vipNumber = uuId()
      await db.collection('userInfor').add({
        data:{
          avatarUrl: event.avatarUrl,
          nickName: event.nickName,
          vipNumber: vipNumber,
          country: event.country,
          province: event.province,
          city: event.city,
          openId: openid,
          score: 0
        }
      })
      userInforList = [{
        _id: db.serverDate().getTime() + openid,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        vipNumber: vipNumber,
        score: 0
      }]
    }
    ctx.body = userInforList
  })

  // 填写用户邀请码
  /**
   * 接口返回值upLevelName
   * 1: 代表当前用户是目标用户的邀请者（不能互为邀请者）
   */
  app.router('writeVipNumber', async ctx => {
    let userInforList = ''
    let checkOut = await cloud.openapi.security.msgSecCheck({
      content: event.vipNumber
    })
    if (checkOut && checkOut.errCode.toString() === '87014'){
      userInforList = {
        upLevelName: "含有违法内容"
      }
    }else{
      let resultInfo = await db.collection('userInfor').where({
        vipNumber: event.vipNumber
      }).field({
        nickName: true,
        openId: true,
        fatherOpenId: true
      }).get()
      if(resultInfo.data.length){
        if(resultInfo.data[0].fatherOpenId == openid){
          userInforList = {
            upLevelName: "1"
          }
        }else{
          // 更新当前客户的积分
          await db.collection('userInfor').where({ 
            openId: openid
          }).update({
            data:{
              fatherOpenId: resultInfo.data[0].openId,
              upLevelName: resultInfo.data[0].nickName,
              score:db.command.inc(5)
            }
          })
          // 更新目标客户的积分
          await db.collection('userInfor').where({ 
            openId: resultInfo.data[0].openId
          }).update({
            data:{
              score:db.command.inc(5)
            }
          })
          //更新积分流水表
          await db.collection('scoreFlow').add({
            data:{
              openId: openid,
              creatTime: db.serverDate(),
              changeScore: 5,
              changeType: "invited"
            }
          })
          await db.collection('scoreFlow').add({
            data:{
              openId: resultInfo.data[0].openId,
              creatTime: db.serverDate(),
              changeScore: 5,
              changeType: "invite"
            }
          })

          userInforList = {
            upLevelName: resultInfo.data[0].nickName
          }
        }
      }
    }
    ctx.body = userInforList
  })

  // 获取玩法列表
  app.router('getRules', async ctx => {
    let ruleList = await db.collection('rules').get()
    ctx.body = ruleList
  })

  // 获取积分排行列表
  app.router('getRangeList', async ctx => {
    let getRangeList = await db.collection('userInfor').field({
      nickName: true,
      openId: true,
      score: true,
      avatarUrl: true
    }).orderBy("score", "desc").limit(event.pageCount).skip(event.pageNumb).get()
    ctx.body = getRangeList
  })

  // 获取用户的积分记录
  app.router('getScoreFlow', async ctx => {
    let scoreFlowList = await db.collection('scoreFlow').where({
      openId: openid,
    }).skip(event.pageNumb).limit(event.pageCount).get()
    ctx.body = scoreFlowList
  })

  // 获取配置表
  app.router('getConfig', async ctx => {
    let configList = await db.collection('configs').get()
    if(configList.data.length > 0){
      configList.data[0].openId = openid
    }
    ctx.body = configList
  })

  return app.serve()
}