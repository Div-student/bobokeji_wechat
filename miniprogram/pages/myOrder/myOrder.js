// pages/myOrder/myOrder.js
let Page_Numb = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[]
  },

  async getMyOrderList(pageNumb){
    wx.showLoading({
      title: 'loading',
      mask:true
    })
   let resList = await wx.cloud.callFunction({
      name: "getProductInfo",
      data:{
        $url: "getMyOrderList",
        pageNumb: pageNumb*15,
        pageCount: 15
      }
    })
    let tempList = [...this.data.orderList, ...resList.result.data]
    this.setData({
      orderList: tempList
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
    Page_Numb = 0
    this.getMyOrderList(0)
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
    Page_Numb = 0
    this.data.orderList = []
    this.getMyOrderList(Page_Numb)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    Page_Numb++
    this.getMyOrderList(Page_Numb)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})