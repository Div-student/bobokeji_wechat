// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navyList:[
      {
        name:'人气推荐',
        value:"hotIndex"
      },
      {
        name:'按品牌',
        value:"classBand"
      },
      {
        name:'按口味',
        value:"classTast"
      },
      {
        name:'按人群',
        value:"classPerson"
      },
    ],
    commedyList:[]
  },
  searchData(val){
    wx.showLoading({
      title: 'loading',
    })
    wx.cloud.callFunction({
      name: "getProductInfo",
      data: {
        $url: "getProductList",
        productName: val.detail,
        pageNumb: 0,
        pageCount: 10
      }
    }).then(res => {
      wx.hideLoading()
      let tempRes = res.result.data
      let productList = tempRes.map(res => {
        return {
          url: res.productImge,
          title: res.productName,
          discript: res.subName,
          id: res.productId,
          price: res.price,
          RotationImg: res.RotationImg,
          productDsc: res.productDsc,
          productScore: res.productScore,
          commentCount:res.commentCount,
          productIdDetailImg:res.productIdDetailImg,
          forSalePrice: res.forSalePrice,
          isExchange: res.isExchange,
          downLoadImgUrl: res.downLoadImgUrl,
          inventory: res.inventory
        }
      })
      this.setData({
        commedyList: productList
      })
    })
  },
  getCurrentId(val){
    wx.showLoading({
      title: 'loading',
    })
    wx.cloud.callFunction({
      name:"getProductInfo",
      data:{
        $url: "getProductList",
        productType: val.detail,
        pageNumb: 0,
        pageCount: 10
      }
    }).then(res=>{
      wx.hideLoading()
      let tempRes = res.result.data
      let productList = tempRes.map(res => {
        return {
          url: res.productImge,
          title: res.productName,
          discript: res.subName,
          id: res.productId,
          price: res.price,
          RotationImg: res.RotationImg,
          productDsc: res.productDsc,
          productScore: res.productScore,
          commentCount:res.commentCount,
          productIdDetailImg:res.productIdDetailImg,
          forSalePrice: res.forSalePrice,
          isExchange: res.isExchange,
          downLoadImgUrl: res.downLoadImgUrl,
          inventory: res.inventory
        }
      })
      this.setData({
        commedyList: productList
      })
    })
  },
  toDetailPage(e){
    let selectedProduct = e.currentTarget.dataset.productinfo
    wx.navigateTo({
      url: `../commendyDetail/commendyDetail?productId=${selectedProduct.id}`,
    })
  },
  async getClassList(){
    let temRes = await wx.cloud.callFunction({
      name: "getUserInfos",
      data: {
        $url: "getConfig"
      }
    })
    if(temRes.result.data && temRes.result.data.length > 0){
      this.setData({
        navyList: temRes.result.data[0].classList
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClassList()
    this.getCurrentId({detail:"hotIndex"})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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