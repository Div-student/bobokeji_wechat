// components/inputWindow/inputWindow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHidden:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({
        isHidden: true
      })
    },
    getInput(val){
      this.data.inputValue = val.detail.value
    },
    getInputValue(){
      this.triggerEvent("getInputValue", this.data.inputValue)
    }
  }
})
