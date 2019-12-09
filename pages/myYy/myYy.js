// pages/myMoney/myMoney.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    utoken: "",
    ptotal: 0,
    pidx: 2,
    pval: "",
    no: false,
    load:false,
    navH: "132rpx"   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })      
    wx.showLoading({
      title: '加载中'
    });    
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          utoken: res.data.Token
        })
        setTimeout(function () {
          that.getData();
        }, 100)

      },
    })
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
    if (Math.ceil(that.data.ptotal / 10) >= that.data.pidx) {
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
  getData(num) {
    var that = this;
    if (num == undefined) {
      num = 1
    }    
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Rotate/GetRotateEnrollPageList',
      header: {
        "token": that.data.utoken
      },
      data: { PageIndex: num },
      success: res => {
        console.log(res);
        if(res.data.code==1001){
          that.setData({            
            ptotal: res.data.data.TotalRecord,
            no: false,
            load:true
          })
          if (num == 1) {
            that.setData({
              list: res.data.data.DataList
            })
          }
          if (num > 1) {
            that.setData({
              list: that.data.list.concat(res.data.data.DataList)
            })
          } 
        } else if (res.data.Message == "已拒绝为此请求授权。") {
          wx.showModal({
            title: "登录信息已失效",
            content: '非常抱歉！您的登录状态已失效，请重新登录',
            showCancel: false,
            success: function (r) {
              if (r.confirm) {
                wx.clearStorage();
                wx.reLaunch({
                  url: '../my/my',
                })
              }
            }
          });
        } else {
          wx.showToast({
            title: "服务器错误，请稍后再试",
            icon: "none"
          })
        }
        wx.hideLoading();
      }
    })
  },
  goFriend(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../mclick/mclick?id=' + id +"&uid="+uid,
    })
  },
  call(e) {
    var that = this;
    var num = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: num,
    })
  },  
})