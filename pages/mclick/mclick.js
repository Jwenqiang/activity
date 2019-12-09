// pages/friends/friends.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickList:[],
    id:"",
    uid:"",
    ptotal: 0,
    pidx: 2,
    pval: "",
    no: false,  
    navH: "132rpx"  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      navH: app.globalData.navHeight
    })        
    wx.showLoading({
      title: '加载中'
    })     
    var that = this;
    if(e.id){
      that.setData({
        id:e.id
      })
    }
    if(e.uid){
      that.setData({
        uid: e.uid
      })      
    }
    setTimeout(function(){
      that.getData();
    },100)
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
    var that = this;
    if (Math.ceil(that.data.ptotal / 20) >= that.data.pidx) {
      wx.showLoading({
        title: '加载中'
      });

      that.getData(that.data.pidx);

      that.setData({
        pidx: that.data.pidx + 1
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
    } else {
      that.setData({
        no: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index'
    }  
  },
  getData(num){
    var that=this;
    if (num == undefined) {
      num = 1
    }    
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Rotate/GetRotateUserClickList',
      method:"post",
      data:{
        RotateId:that.data.id,
        StartUserId: that.data.uid,
        PageIndex:num,
        PageSize:20
      },
      success:res=>{
        console.log(res);
        if (res.data.code == 1001) {
          that.setData({
            ptotal: res.data.data.TotalRecord,
            no: false
          })
          if (num == 1) {
            that.setData({
              clickList: res.data.data.DataList
            })
          }
          if (num > 1) {
            that.setData({
              clickList: that.data.clickList.concat(res.data.data.DataList)
            })
          }
          wx.hideLoading();
        }        
      }
    })
  }
})