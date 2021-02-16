
let currentPage = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topRangList:[]
  },

  getRangeList(pageNumb, pageCount){
    wx.showLoading({
      title: 'loading',
    })
    wx.cloud.callFunction({
      name:"getUserInfos",
      data:{
        $url: "getRangeList",
        pageNumb,
        pageCount
      }
    }).then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      let tempList = [...this.data.topRangList, ...res.result.data]
      this.setData({
        topRangList:tempList
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentPage = 0
    this.getRangeList(currentPage,15)
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
    currentPage = 0
    this.data.topRangList = []
    this.getRangeList(currentPage*15, 15)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    currentPage++
    this.getRangeList(currentPage*15, 15)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})