let Collection_Flag = "IN"
let Timer = ""
let _ProductId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productDetail:{},
    commentsList:[],
    hiddenHeart: false
  },
  consultingService(){

  },
  comments(){
    wx.showModal({
      title: '提示',
      content: '功能开发中,敬请期待....',
      showCancel: false
    })
  },
  on_exchange(event){
    let _this = this
    let productPrice = this.data.productDetail.forSalePrice
    if(!this.data.productDetail.isExchange){
      wx.showModal({
        title:'该商品暂不支持积分兑换'
      })
      return
    }
    // 获取当前用户的积分数
    if(event.detail.userInfo){
      wx.showLoading({
        title: 'loading',
      })
      let tempInfo = event.detail.userInfo
      wx.cloud.callFunction({
        name: "getUserInfos",
        data:{
          $url: "getUserInfo",
          avatarUrl: tempInfo.avatarUrl,
          nickName: tempInfo.nickName,
          country: tempInfo.country,
          province:tempInfo.province,
          city: tempInfo.city
        }
      }).then(res => {
        wx.hideLoading()
        let userScore = res.result[0].score
        if(userScore/10 >= productPrice){
          wx.showModal({
            content:`此次兑换将扣除您「 ${productPrice*10}」积分，您确定兑换吗？`,
            success(result){
              if(result.confirm){
                _this.generateOrder()
              }
            }
          })
        }else{
          wx.showModal({
            content:"您的积分不足，去我邀请好友赚取积分吧",
            success(res){
              if(res.confirm){
                wx.reLaunch({
                  url: '../profie/profie',
                })
              }
            }
          })
        }
      })
    }else{
      wx.showModal({
        title:'只有授权的用户才能免费兑换哦^_^'
      })
    }
  },

  generateOrder(){
    let productDe = this.data.productDetail
    wx.cloud.callFunction({
      name: "getProductInfo",
      data:{
        $url: "generateOrder",
        productId: productDe.id,
        productName: productDe.title,
        forSalePrice:Number(productDe.forSalePrice),
        exchangeScore: Number(productDe.forSalePrice)*10,
        productImage: productDe.RotationImg[0],
        downLoadImgUrl: productDe.downLoadImgUrl
      }
    }).then(res => {
        wx.showModal({
        confirmText:"立即秀出",
        content:"恭喜您兑换成功,赶紧找客服秀出您的二维码吧^_^",
        success(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../qrcode/qrcode',
            })
          }
        }
      })
    })
  },

  async collectProduct(){
    this.data.hiddenHeart = !this.data.hiddenHeart
    let productDe = this.data.productDetail
    if(this.data.hiddenHeart){
      this.setData({
        hiddenHeart: true
      })
      Collection_Flag = 'IN'
    }else{
      this.setData({
        hiddenHeart: false
      })
      Collection_Flag = 'OUT'
    }
    // 发送请求前做防抖
    clearTimeout(Timer)
    Timer = setTimeout(()=>{
      wx.cloud.callFunction({
        name: "getProductInfo",
        data:{
          $url: "collectProduct",
          productId: productDe.id,
          productName: productDe.title,
          forSalePrice: Number(productDe.forSalePrice),
          price: Number(productDe.price),
          productImage: productDe.RotationImg[0],
          flag: Collection_Flag
        }
      })
    },1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempProductID = ''
    if(options.productId){
      tempProductID = options.productId
      _ProductId = options.productId
      this.getProductInfor(tempProductID)
    }
  },

  async getProductInfor(productId){
    let res = await wx.cloud.callFunction({
      name: "getProductInfo",
      data:{
        $url: "getProductList",
        productId: productId,
        pageNumb: 0,
        pageCount: 1
      }
    })
    let tempInfo = res.result.data[0]
    let tempData = {
      url: tempInfo.productImge,
      title: tempInfo.productName,
      discript: tempInfo.subName,
      id: tempInfo.productId,
      price: tempInfo.price,
      RotationImg: tempInfo.RotationImg,
      productDsc: tempInfo.productDsc,
      productScore: tempInfo.productScore,
      commentCount: tempInfo.commentCount,
      productIdDetailImg: tempInfo.productIdDetailImg,
      forSalePrice: tempInfo.forSalePrice,
      isExchange: tempInfo.isExchange,
      downLoadImgUrl: tempInfo.isExchange,
      inventory: tempInfo.inventory
    }
    this.setData({
      productDetail: tempData
    })
    this.getCommentAndCollection(productId)
  },

  getCommentAndCollection(productId){
    wx.showLoading({
      title: 'loading',
    })
    // 获取商品评论
    wx.cloud.callFunction({
      name: "getProductInfo",
      data:{
        $url: "getCommentByProductId",
        productId: productId,
        pageNumb: 0,
        pageCount: 2
      }
    }).then(res => {
      wx.hideLoading()
      let tempComment = res.result.data
      this.setData({
        commentsList: tempComment
      })
    })

    // 判断商品是否已被收藏
    wx.cloud.callFunction({
      name: "getProductInfo",
      data:{
        $url: "getProductCollection",
        productId: productId
      }
    }).then(res => {
      if(res.result.data.length){
        this.setData({
          hiddenHeart: true
        })
        Collection_Flag = "IN"
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.generateOrder()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})