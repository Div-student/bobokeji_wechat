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
      let configs = await db.collection("configs").get()
      let vipNumber = "VIP"
      let currentVipNumber = configs.data[0].defaultVipNumber
      let configId = configs.data[0]._id
      if(currentVipNumber==0 || currentVipNumber < 10){
        vipNumber = vipNumber + "00000" + (currentVipNumber + 1)
        await db.collection('configs').where({
          _id: configId
        }).update({
          data: {
            defaultVipNumber: currentVipNumber + 1
          }
        })
      }else if(currentVipNumber>=10 && currentVipNumber<100){
        vipNumber = vipNumber + "0000" + (currentVipNumber + 1)
        await db.collection('configs').where({
          _id: configId
        }).update({
          data: {
            defaultVipNumber: currentVipNumber + 1
          }
        })
      }else if(currentVipNumber>= 100 && currentVipNumber<1000){
        vipNumber = vipNumber + "000" + (currentVipNumber + 1)
        await db.collection('configs').where({
          _id: configId
        }).update({
          data: {
            defaultVipNumber: currentVipNumber + 1
          }
        })
      }else if(currentVipNumber>=1000 && currentVipNumber<10000){
        vipNumber = vipNumber + "00" + (currentVipNumber + 1)
        await db.collection('configs').where({
          _id: configId
        }).update({
          data: {
            defaultVipNumber: currentVipNumber + 1
          }
        })
      }else if(currentVipNumber>=10000 && currentVipNumber<100000){
        vipNumber = vipNumber + "0" + (currentVipNumber + 1)
        await db.collection('configs').where({
          _id: configId
        }).update({
          data: {
            defaultVipNumber: currentVipNumber + 1
          }
        })
      }else if(currentVipNumber>=100000 && currentVipNumber<1000000){
        vipNumber = vipNumber + (currentVipNumber + 1)
        await db.collection('configs').where({
          _id: configId
        }).update({
          data: {
            defaultVipNumber: currentVipNumber + 1
          }
        })
      }
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
        _id: new Date().getTime() + openid,
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
    // 查询vip码对应的用户信息
    let resultInfo = await db.collection('userInfor').where({
      vipNumber: event.vipNumber
    }).field({
      nickName: true,
      openId: true,
      fatherOpenId: true
    }).get()
    if(resultInfo.data.length){
      // 查询当前用户是否已被其他用户邀请
      if(resultInfo.data[0].fatherOpenId == openid){
        userInforList = {
          upLevelName: "1"
        }
      }else{
        await db.collection('userInfor').where({
          openId: openid
        }).update({
          data:{
            fatherOpenId: resultInfo.data[0].openId,
            upLevelName: resultInfo.data[0].nickName,
          }
        })
        userInforList = {
          upLevelName: resultInfo.data[0].nickName
        }
      }
    }
    ctx.body = userInforList
  })

  return app.serve()
}