//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:"",
    id:"",
    current:0,
    hxObj:{},
    banList:[]
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
    var that=this
    if(e.id){
      that.setData({
        id:e.id
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
  swiperChange: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        current: e.detail.current
      })
    }
  }, 
  changeBig(e){
    var that=this;
    var u = e.currentTarget.dataset.u
    wx.previewImage({
      current: u,
      urls: that.data.banList
    })    
  },
  getData(id){
    var that=this;
    wx.request({
      url: 'https://hfugapi.centaline.com.cn/Estate/GetPropertyRoomTypeByRoomTypeID',
      data:{
        RoomTypeID: id
      },
      success(res){
        console.log(res);
        if(res.data.code==1001){
          that.setData({
            hxObj:res.data.data,
          })
          let arr=[];
          for (let i of res.data.data.EstatePhotosList){
            arr.push(i.FilePath)
          }
          that.setData({
            banList:arr
          })
        }
        setTimeout(function(){
          wx.hideLoading()
        },10)
      }
    })
  } 
})