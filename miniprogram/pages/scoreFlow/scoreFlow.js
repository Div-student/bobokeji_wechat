import formateDate from '../../utils/fomateDate'

let Current_Page = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scoreList:[]
  },
  getScoreFlowList(pageNumb){
    wx.showLoading({
      title: 'loading',
    })
    wx.cloud.callFunction({
      name:"getUserInfos",
      data:{
        $url:"getScoreFlow",
        pageNumb: pageNumb * 15,
        pageCount: 15
      }
    }).then(res=>{
      let resList = res.result.data.map(item => {
        return{
          changeScore:item.changeScore,
          changeType: this.getFlowType(item.changeType),
          creatTime: formateDate(new Date(item.creatTime)),
          openId: item.openId,
          _id: item._id
        }
      })
      let tempList = [...this.data.scoreList, ...resList]
      this.setData({
        scoreList:tempList
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  getFlowType(type){
    switch(type){
      case "invited":
        return "接受邀请"
        break
      case 'invite':
        return "邀请"
        break
      default:
        return "商品兑换"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Current_Page = 0
    this.getScoreFlowList(Current_Page)
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
    Current_Page = 0
    this.data.scoreList = []
    this.getScoreFlowList(Current_Page)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    Current_Page++
    this.getScoreFlowList(Current_Page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})