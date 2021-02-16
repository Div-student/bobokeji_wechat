let inputValue = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  externalClasses:["iconfont","icon-search"],

  /**
   * 组件的初始数据
   */
  data: {
    ishowBtn: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    focusInput(){
      this.setData({
        ishowBtn: false
      })
    },
    blurInput(){
      this.setData({
        ishowBtn: true
      })
    },
    searchBtn(){
      this.triggerEvent("searchData", inputValue)
    },
    inputSearch(e){
      inputValue = e.detail.value
    }
  }
})
