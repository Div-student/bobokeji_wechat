// pages/profie/profie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    isHidden: true
  },

  seletUserInfo(event){
    if(event.detail.userInfo){
      if(!this.data.userInfo.openId){
        let tempInfo = event.detail.userInfo
        wx.showLoading({
          title: 'loading',
        })
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
          if(res.result[0].upLevelName){
            this.setData({
              userInfo: res.result[0]
            })
            wx.showModal({
              title:`您的邀请人是："${res.result[0].upLevelName}"，无需再填写邀请码。`
            })
          }else{
            this.setData({
              userInfo: res.result[0],
              isHidden: false
            })
          }
        })
      }else{
        this.setData({
          isHidden: false
        })
      }
    }else{
      wx.showModal({
        title:'只有授权的用户才能填写邀请码'
      })
    }
  },
  getInputValue(res){
    if(res.detail.trim() == this.data.userInfo.vipNumber){
      wx.showModal({
        showCancel:false,
        content:"不能输入自己的VIP码哦"
      })
    }else{
      wx.showLoading({
        title: 'loading',
      })
      wx.cloud.callFunction({
        name: 'getUserInfos',
        data: {
          $url: "writeVipNumber",
          vipNumber: res.detail.trim()
        }
      }).then(res => {
        wx.hideLoading()
        if(res.result.upLevelName == "1"){
          wx.showModal({
            title: '您已经邀请过该用户！',
          })
        }else if(res.result.upLevelName){
          wx.showModal({
            title: '邀请成功！您和被邀请者都会获得相应的积分',
          })
          this.setData({
            isHidden: true
          })
          this.getUserInfoById()
        }else{
          wx.showModal({
            title: '您输入的邀请码不存在！',
          })
        }
      })
    }
  },
  toRangeTop(){
    wx.navigateTo({
      url: '../topRange/topRange',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  copyNum(){
    wx.setClipboardData({
      data: this.data.userInfo.vipNumber || "我❤️你"
    })
  },

  on_getUserInfo(event){
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
        this.setData({
          userInfo: res.result[0]
        })
      })
    }else{
      wx.showModal({
        title:'只有授权的用户才能查询自己的积分哦哦'
      })
    }
  },

  toMethods(){
    wx.navigateTo({
      url: '../playMethod/playMethod',
    })
  },
  toScoreFlow(){
    wx.navigateTo({
      url: '../scoreFlow/scoreFlow',
    })
  },
  toQrcode(){
    wx.navigateTo({
      url: '../qrcode/qrcode',
    })
  },

  getUserInfoById(){
    wx.showLoading({
      title: 'loading',
    })
    wx.cloud.callFunction({
      name: "getUserInfos",
      data:{
        $url: "getUserInfo"
      }
    }).then(res => {
      wx.hideLoading()
      this.setData({
        userInfo: res.result[0]
      })
    })
  },

  toMyOrder(){
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },

  toMyCollection(){
    wx.navigateTo({
      url: '../myCollection/myCollection',
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