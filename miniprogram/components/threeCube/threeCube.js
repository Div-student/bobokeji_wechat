// components/threeCube/threeCube.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgList:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickLeft(e){
      this.skipDetailPage(e.currentTarget.dataset.productid)
    },
    clickRightTop(e){
      this.skipDetailPage(e.currentTarget.dataset.productid)
    },
    clickRightBottom(e){
      this.skipDetailPage(e.currentTarget.dataset.productid)
    },

    skipDetailPage(productId){
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
            url: `../../pages/commendyDetail/commendyDetail?productId=${tempInfo.productId}`,
          })
        }
      })
    },
  }
})
