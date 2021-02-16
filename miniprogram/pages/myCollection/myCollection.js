let Current_PageNum = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: []
  },

  async getMyCollection(pageNumb){
    wx.showLoading({
      title: 'loading',
    })
    let res = await wx.cloud.callFunction({
      name: "getProductInfo",
      data: {
        $url: "getProductCollection",
        pageNumb: pageNumb * 15,
        pageCount: 15
      }
    })
    this.setData({
      collectionList: res.result.data
    })
    wx.stopPullDownRefresh()
    wx.hideLoading()
  },

  toProductDetail(event){
    let tempId = event.currentTarget.dataset.productid
    wx.redirectTo({
      url: `../commendyDetail/commendyDetail?productId=${tempId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Current_PageNum = 0
    this.getMyCollection(Current_PageNum)
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
    Current_PageNum = 0
    this.data.collectionList = []
    this.getMyCollection(Current_PageNum)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    Current_PageNum++
    this.getMyCollection(Current_PageNum)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})