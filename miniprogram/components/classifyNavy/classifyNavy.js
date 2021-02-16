// components/classifyNavy/classifyNavy.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navyList:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    navyClassList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickItems(e){
      let tempIndex = e.currentTarget.dataset.index
      let currentId = e.currentTarget.dataset.id
      let tempArray = []
      this.triggerEvent('currentId', currentId)
      this.data.navyList.forEach((res, index)=>{
        if(index === tempIndex){
          tempArray.push(true)
        }else{
          tempArray.push(false)
        }
      })
      this.setData({
        navyClassList: tempArray
      })

    }
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      let tempList = []
      this.properties.navyList.forEach((r, index) => {
        if(index > 0){
          tempList.push(false)
        }else{
          tempList.push(true)
        }
        this.setData({
          navyClassList:tempList
        })
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
