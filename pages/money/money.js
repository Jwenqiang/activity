// pages/money/money.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyList:[],
    navH: "132rpx",
    isMoney:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      navH: app.globalData.navHeight
    })      
    var that=this;   
    if(e.id==1){
      that.setData({
        isMoney:true
      })
      wx.getStorage({
        key: 'moneyList',
        success: function (res) {
          that.setData({
            moneyList: res.data
          })
        },
      })       
    } else if(e.id == 2){
      that.setData({
        isMoney: false
      })
      wx.getStorage({
        key: 'funsList',
        success: function (res) {
          that.setData({
            moneyList: res.data
          })
        },
      })       
    }
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
    return {
      path: '/pages/index/index'
    }   
  },
  goUfriends(r) {
    var that = this;
    var aId = r.currentTarget.dataset.activeid;
    var uId = r.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../uFriends/friends?activeId=' + aId + "&userId=" + uId,
    })
  }
})