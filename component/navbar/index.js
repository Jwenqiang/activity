// components/navbar/index.js
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    pageColor: String,
    showNav: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navH: ""
  },
  lifetimes: {
    attached: function () {
      console.log(this.data.pageName)
      console.log(this.data.showHome)
      this.setData({
        navH: App.globalData.navHeight
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function () {
      wx.navigateBack({
        delta: 1,
        fail:error=>{
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    },
    //回主页
    toIndex: function () {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
  }
})