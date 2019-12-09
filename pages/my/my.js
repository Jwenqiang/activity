// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:"",
    show:false,
    check:true,
    wxcode:"",
    utoken:"",
    userTx:"",
    userName:"",
    isLogin:false,
    mobile:"",
    isJjr:"",
    money:"",
    role:1,
    hasNum:false,
    navH: "132rpx",
    showHome:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    } 
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          isLogin: true,
          utoken: res.data.Token,
          userTx: res.data.HeadImg,
          uid: res.data.UserId,
          userName: res.data.NickName,
          isJjr: res.data.RoleType
        })
        if (res.data.Mobile != '' && res.data.Mobile != null) {
          that.setData({
            utoken: res.data.Token,
            hasNum: true,
            mobile: res.data.Mobile,
            check: res.data.MobileDisplayBl,
          })
          setTimeout(function () {
            that.getUser();
            that.getData();
          }, 100)
        }
      },
    })
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
  switchChange(e){
    console.log(e);
    var that=this;
    var data = e.currentTarget.dataset.c
    if (data==true){
      that.setData({
        show:true
      })
    }else{
      console.log(1)
      wx.request({
        url: 'https://spapi.centaline.com.cn/api/Users/UpdateMobileDisplayBl',
        method: "post",
        header: {
          "token": that.data.utoken
        },
        data: {
          MobileDisplayBl: true
        },
        success: res => {
          console.log(res);
          if (res.data.code == 1001) {
            wx.hideLoading();
            var u = wx.getStorageSync("userInfo");
            u.MobileDisplayBl = true;
            wx.setStorageSync("userInfo", u);
            that.setData({
              check: true
            })
          }
        }
      })         
    }
  },
  confim(e){
    var that = this; 
    that.setData({
      show: false
    })    
    wx.showLoading({
      title: '关闭中',
      icon:"none"
    })
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Users/UpdateMobileDisplayBl',
      method:"post",
      header:{
        "token":that.data.utoken
      },
      data:{
        MobileDisplayBl:false
      },
      success:res=>{
        console.log(res);
        if(res.data.code==1001){
          wx.hideLoading();
          var u=wx.getStorageSync("userInfo");
          u.MobileDisplayBl=false;
          wx.setStorageSync("userInfo", u);
          that.setData({
            check: false
          })
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
      }
    })   
  },
  cancel(e) {
    var that = this;
    that.setData({
      show: false,
    })
  },
  goMyself() {
    wx.navigateTo({
      url: '/pages/myself/myself',
    })
  },  
  goKf(){
    wx.navigateTo({
      url: '/pages/acKf/acKf',
    })
  },
  goJjr() {
    wx.navigateTo({
      url: '/pages/applyJjr/applyJjr',
    })
  },
  goMoney(){
    wx.navigateTo({
      url: '../myMoney/myMoney',
    })
  },

  getCode: function () {
    var that = this;
    wx.login({
      success(res) {
        console.log(res);
        that.setData({
          wxcode: res.code
        })
      }
    })  
  },
  //通过绑定手机号登录
  getPhoneNumber: function (e) {
    console.log(this.data.wxcode);
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData;
    var that = this;
    //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
      console.log(e);
    } else { //授权通过执行跳转
      wx.showLoading({
        title: '授权中',
        mask: true
      })   
          wx.request({
            url: 'https://spapi.centaline.com.cn/api/Users/UserLogin', //接口地址
            data: {
              code: that.data.wxcode,
              encryptedData: telObj,
              iv: ivObj,
              Type: 6,
              AuthorizeType:1
            },
            method: "post",
            success: function (res) {
              console.log(res);
              if (res.data.code == 1001) {
                that.setData({
                  utoken: res.data.data.Token,  
                  uid: res.data.data.UserId
                })
                setTimeout(function(){
                  that.getUser();
                },100)
                
              }
              else {
                wx.showToast({
                  title: "登录失败，请稍后再试",
                  icon: "none"
                })
              }
              wx.hideLoading();
            }
          })  
    }     
    wx.hideLoading();
    //---------登录有效期检查
    // wx.checkSession({
    //   success: function () {
    //     console.log(1);
    //     //session_key 未过期，并且在本生命周期一直有效     



    //   },
    //   fail: function () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     console.log(2);
    //     wx.login() //重新登录
    //   }
    // });
  },  
  getUser() {
    var that = this;
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Users/GetUser',
      data: { UserId: that.data.uid },
      header: {
        'token': that.data.utoken
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1001) {
          wx.setStorage({
            key: 'userInfo',
            data: res.data.data,
          })
          that.setData({
            isLogin: true,
            utoken: res.data.data.Token,
            userTx: res.data.data.HeadImg,
            userName: res.data.data.NickName,
            mobile: res.data.data.Mobile,
            isJjr: res.data.data.RoleType,
            check: res.data.data.MobileDisplayBl,
            money: res.data.data.RotateStartUserAmountTotal,
            hasNum:true 
          })
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
        wx.hideLoading()
      }
    })
  }, 
  goYy(){
    wx.navigateTo({
      url: '../myYy/myYy',
    })
  },
  goList() {
    wx.navigateTo({
      url: '../asaleList/asaleList',
    })
  }, 
  getData(){
    var that=this
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Discount/GetDiscountReceiveList',
      data: { Mobile: that.data.mobile, PageSize:1000 },
      success(r){
        console.log(r)
        if(r.data.code==1001){
          that.setData({
            list:r.data.data.DataList
          })
        }
      }  
    }) 
  } 
})