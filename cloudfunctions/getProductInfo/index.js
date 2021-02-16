// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  // 获取轮播图
  app.router('getLunboTu', async ctx=>{
    let lunbotuList = db.collection('lunbotu').get()
    ctx.body = lunbotuList
  })

  // 获取品牌特供图
  app.router('getBrandPic', async ctx=>{
    let brandPic = db.collection('brandPic').get()
    ctx.body = brandPic
  })

  // 获取首页商品列表
  app.router('getProductList', async ctx => {
    let conditon = {
      onShelf: true
    }
    let orderByCondition = {
      key: "createTime",
      value: "desc"
    }
    if(event.productType){
      conditon.productType = event.productType
    }
    if(event.productId){
      conditon.productId = event.productId
    }
    if(event.productName && event.productName.trim()){
      conditon.productName = db.RegExp({
        regexp:event.productName,
        options:'i'
      })
    }
    if(event.hotType && event.hotType.trim()){
      conditon.hotType = db.RegExp({
        regexp:event.hotType,
        options:'i'
      })
    }
    if(event.orderBy){
      orderByCondition = event.orderBy
    }
    let productList = db.collection('products').orderBy(orderByCondition.key, orderByCondition.value).where(conditon).skip(event.pageNumb).limit(event.pageCount).get()
    ctx.body = productList
  })

  // 获取商品评价
  app.router('getCommentByProductId', async ctx => {
    let res = db.collection('comments').where({
      productId: event.productId
    }).skip(event.pageNumb).limit(event.pageCount).get()
    ctx.body = res
  })

  // 生成商品订单
  app.router('generateOrder', async ctx => {
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID

    // 生成订单
    let res = await db.collection('order').add({
      data:{
        openId: openid,
        productId: event.productId,
        productName: event.productName,
        forSalePrice: event.forSalePrice,
        verify: false,
        productImage: event.productImage,
        exchangeScore: event.exchangeScore,
        downLoadImgUrl: event.downLoadImgUrl,
      }
    })

    // 扣除对应积分
    await db.collection('userInfor').where({openId: openid}).update({
      data:{
        score:db.command.inc(-event.exchangeScore)
      }
    })

    // 口除库存数量
    await db.collection('products').where({productId: event.productId}).update({
      data:{
        inventory:db.command.inc(-event.inventory || -1)
      }
    })

    // 新增一条流水
    await db.collection('scoreFlow').add({
      data:{
        openId: openid,
        creatTime: db.serverDate(),
        changeScore: -event.exchangeScore,
        changeType: "exchange"
      }
    })

    ctx.body = res
  })
  

  // 获取我的订单列表
  app.router('getMyOrderList', async ctx => {
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    if(event.openid){
      openid = event.openid
    }
    let res = await db.collection('order').where({
      openId: openid,
    }).skip(event.pageNumb).limit(event.pageCount).get()

    ctx.body = res
  })

  // 收藏商品
  app.router('collectProduct', async ctx => {
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    let resInfor = ""
    // 判断商品收藏表里当前用户是否收藏过该商品
    let result = await db.collection('productCollection').where({
      openId: openid,
      productId: event.productId,
    }).get()

    if(!result.data.length && event.flag == "IN"){
      // 收藏商品
      resInfor = await db.collection('productCollection').add({
        data:{
          openId: openid,
          productId: event.productId,
          productName: event.productName,
          forSalePrice: event.forSalePrice,
          price: event.price,
          productImage: event.productImage
        }
      })
    }

    if(result.data.length && event.flag == "OUT" ){
      // 取消收藏
      resInfor = await db.collection('productCollection').where({
        openId: openid,
        productId: event.productId,
      }).remove()
    }
    
    ctx.body = resInfor
  })

  // 获取我的收藏列表
  app.router('getProductCollection', async ctx=>{
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    let pageNumb = 0
    let pageCount = 1
    let condition = {
      openId: openid
    }
    if(event.productId){
      condition.productId = event.productId
    }
    if(event.pageNumb){
      pageNumb = event.pageNumb
    }
    if(event.pageCount){
      pageCount = event.pageCount
    }

    let result = await db.collection('productCollection').where(condition).skip(pageNumb).limit(pageCount).get()

    ctx.body = result
  })


  return app.serve()
}

