//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:"",
    product:"",
    mainInfo:"",
    id:"",
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.showLoading({
      title: '',
    })
    this.setData({
      navH: app.globalData.navHeight
    })
    var that=this;
    console.log(e);
    if (e.id) {
      that.setData({
        id: e.id
      })
      that.getData(e.id);
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

  },
  getData(id) {
    var that = this;
    wx.request({
      url: 'https://hfugapi.centaline.com.cn/Project/GetProjectById',
      data: {
        id: id
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1001) {
          that.setData({
            product: res.data.data,
            mainInfo: res.data.data.Estate,
            show:true
          })             
          wx.hideLoading()
        }
      }
    })
  }   
})