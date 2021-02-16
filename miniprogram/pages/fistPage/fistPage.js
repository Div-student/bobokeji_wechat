let _pageNumb = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval:5000,
    // 导航图标
    topImgs:[],
    navyItems:[
      {
        icon: '../../images/cake.png',
        title: "创意网红",
        titleValue: "internetCelebrity",
        id:111
      },
      {
        icon: '../../images/time.png',
        title: "当日达",
        titleValue: "currentday",
        id:222
      },
      {
        icon: '../../images/hot.png',
        title: "热卖",
        titleValue: "hotSall",
        id:333
      },
      {
        icon: '../../images/all.png',
        title: "全部",
        titleValue: "all",
        id:444
      }
    ],

    // 分类图片
    imgList:[],

    title:{
      cn: "品牌特供",
      en:"Brand Supply"
    },

    hotTitle:{
      cn: "热卖精选",
      en:"Best Sall"
    },

    commoditylist:[],

    toTopHeight: '',
    isFixedTop: false
  },
  // 跳转至分类列表页面
  toClassificationPage(e){
    let title = e.currentTarget.dataset.title
    let titleValue = e.currentTarget.dataset.titlevalue
    wx.navigateTo({
      url: `../classificationList/classificationList?title=${title}&titleValue=${titleValue}`,
    })
  },

  // 获取导航栏距离顶部的距离
  getTopHeight(){
    let query = wx.createSelectorQuery()
    query.select("#navigation").boundingClientRect(res=>{
      this.data.toTopHeight = res.top
    }).exec()
  },

  // 跳转至商品详情页面
  toDetailPage(e){
    let productInfo = e.currentTarget.dataset.commodityinfo
    wx.navigateTo({
      url: `../commendyDetail/commendyDetail?productId=${productInfo.id}`,
    })
  },

  // 从首页轮播图跳转至详情页面
  skipDetailPage(e){
    let productId = e.currentTarget.dataset.commodityid
    wx.cloud.callFunction({
      name:"getProductInfo",
      data: {
        $url:"getProductList",
        pageNumb: 0,
        pageCount: 10,
        productId: productId
      }
    }).then(res=>{
      let tempInfo = res.result.data[0]
      if(tempInfo){
        wx.navigateTo({
          url: `../commendyDetail/commendyDetail?productId=${tempInfo.productId}`,
        })
      }
    })
  },

  // 获取轮播图
  getLunbotuList(){
    wx.cloud.callFunction({
      name:"getProductInfo",
      data:{
        $url:"getLunboTu"
      }
    }).then(res=>{
      let tempRes = res.result.data
      this.setData({
        topImgs: tempRes
      })
    })
  },
  
  // 获取品牌特供图片
  getBrandPic(){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.cloud.callFunction({
      name:"getProductInfo",
      data:{
        $url:"getBrandPic"
      }
    }).then(res=>{
      let tempRes = res.result.data
      this.setData({
        imgList:tempRes
      })
      wx.hideLoading()
    })
  },

  // 获取商品列表
  getProductList(pageNumb){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.cloud.callFunction({
      name: "getProductInfo",
      data: {
        $url:"getProductList",
        pageNumb: pageNumb*10,
        pageCount: 10,
        orderBy: {
          key: "price",
          value: "asc"
        }
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
          isExchange: res.isExchange,
          downLoadImgUrl: res.downLoadImgUrl,
          inventory: res.inventory
        }
      })
      let tempList = [...this.data.commoditylist, ...productList]
      this.setData({
        commoditylist: tempList
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopHeight()
    this.getLunbotuList()
    this.getBrandPic()
    this.getProductList(_pageNumb)
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
    _pageNumb = 0
    this.data.commoditylist = []
    this.getProductList(_pageNumb)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    _pageNumb++
    this.getProductList(_pageNumb)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 监听页面滚动
   */
  onPageScroll(e){
    if(this.data.isFixedTop === e.scrollTop > this.data.toTopHeight) return
    this.setData({
      isFixedTop: e.scrollTop > this.data.toTopHeight
    })
  }
})