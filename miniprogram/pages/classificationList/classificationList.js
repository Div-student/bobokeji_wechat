// pages/classificationList/classificationList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commoditylist:[],
    showPlaceHolder: false
  },

  toDetail(e){
    let selectedProduct = e.currentTarget.dataset.productinfo
    wx.navigateTo({
      url: `../commendyDetail/commendyDetail?productId=${selectedProduct.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    wx.cloud.callFunction({
      name: "getProductInfo",
      data:{
        $url:"getProductList",
        pageNumb: 0,
        pageCount: 10,
        hotType: options.titleValue
      }
    }).then(res => {
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
          distributionMode: res.DistributionMode,
          isExchange: res.isExchange,
          downLoadImgUrl: res.downLoadImgUrl,
          inventory: res.inventory
        }
      })
      this.setData({
        commoditylist: productList
      })
    })
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