const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    utoken:"",
    navH: "132rpx",
    activeId:"",
    mobile:"",
    bmPhone:"",
    list:[],
    showHouseInfo:false,
    uhouse:"",
    current: 0,
    markers: "",
    lng: "",
    lat: "" ,
    hasBm:false,
    hasSale:false ,
    animationBm: "",
    hasBm: false,      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })  
    var that=this;
    wx.getStorage({
      key: 'asaleList',
      success: function(res) {
        that.setData({
          list:res.data,
          activeId: res.data[0].RotateId
        })
      },
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res.data.NickName != '' && res.data.NickName != null) {
          that.setData({
            utoken: res.data.Token,
            mobile: res.data.Mobile,
            bmPhone: res.data.Mobile,
          })
        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  reverseLocation: function (lon, lat) {
    var that = this;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '3XABZ-EAL33-UKR3S-YHJBW-QFHYK-VGFP3' // 必填
    });
    // 调用接口
    demo.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lon
      },
      coord_type: 3,//baidu经纬度
      success: function (res) {

        var mark = [{
          id: "1",
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          iconPath: "../../img/mark.jpg",
          title: that.data.uhouseName,
          // 标签      
          label: { content: that.data.uhouseName, bgColor: "#fa5e3c", padding: "5px", borderRadius: "3", anchorX: "20", anchorY: "-40", color: "#fff" },
          width: 40,
          height: 40
        }];
        that.setData({
          markers: mark,
          lng: res.result.location.lng,
          lat: res.result.location.lat
        })

      }
    });
  }, 
  swiperChange: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        current: e.detail.current
      })
    }
  },   
  showHouse(e) {
    var that = this;
    if (e.currentTarget.dataset.j == 'yes') {
      that.setData({
        isList: true,
        uhouse: e.currentTarget.dataset.p
      })
    }
    if (that.data.showHouseInfo == false) {
      var arr = [];
      var ban = that.data.uhouse.Estate.EstatePhotosAllList;
      for (const i of ban) {
        arr.push(i.FilePath)
      }
      // 轮播列表
      that.setData({
        uhouseName: that.data.uhouse.ProjectName,
        bannerList: arr
      })
      // 百度地图经纬度转腾讯地图
      that.reverseLocation(that.data.uhouse.AddressXpoint, that.data.uhouse.AddressYpoint);
    }
    that.data.showHouseInfo = !that.data.showHouseInfo
    that.setData({
      showHouseInfo: that.data.showHouseInfo
    })
  },
  goDetail(e) {
    var id = e.currentTarget.dataset.houseid;
    wx.navigateTo({
      url: '../uhDetail/uhDetail?id=' + id,
    })
  },  
  goUban(e) {
    var id = e.currentTarget.dataset.hx;
    wx.navigateTo({
      url: '../uhBan/uhBan?id=' + id,
    })
  },
  bigBan(e) {
    var that = this;
    var u = e.currentTarget.dataset.u
    wx.previewImage({
      current: u,
      urls: that.data.bannerList
    })
  },
  openConfirm: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.tel != '' && e.currentTarget.dataset.tel != null) {
      wx.showModal({
        title: String(e.currentTarget.dataset.tel),
        content: '点确认拨打上面的电话号码，并根据提示输入分机号',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: e.currentTarget.dataset.tel,
            })
          } else {
            console.log('用户点击辅助操作')
          }
        }
      });
    } else {
      wx.showModal({
        title: String(e.currentTarget.dataset.m),
        content: '点确认拨打上面的手机号码',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: e.currentTarget.dataset.m,
            })
          } else {
            console.log('用户点击辅助操作')
          }
        }
      });
    }


  },
  //点击标注点进行导航 
  gotohere: function (res) {
    var that = this;
    wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
      latitude: that.data.lat,//纬度
      longitude: that.data.lng,//经度
      name: that.data.uhouseName,
      success: function (res) {
      },
      fail: function (res) {
      }
    })
  }, 
  getCode: function () {
    var that = this;
    return new Promise(function (resolve) {
      wx.login({
        success(res) {
          console.log(res);
          that.setData({
            wxcode: res.code
          })
        }
      })
    })
  },  
  //通过绑定手机号登录
  getPhoneNumber1: function (e) {
    console.log(e);
    var projectId = e.currentTarget.dataset.id;
    var discountType = e.currentTarget.dataset.t;
    var discountContent = e.currentTarget.dataset.c;
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData;
    var that = this;

    //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
      wx.showToast({
        title: "同意后才能领取优惠哦",
        icon: "none"
      })
    } else { //授权通过执行跳转 
      if (that.data.wxcode != '') {
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
            Type: 4,
            AuthorizeType: 1
          },
          method: "post",
          success: function (res) {
            console.log(res);
            if (res.data.code == 1001) {
              wx.setStorage({   //存储数据并准备发送给下一页使用
                key: "userInfo",
                data: res.data.data,
              })
              that.setData({
                mobile: res.data.data.Mobile
              })
              wx.request({
                url: 'https://spapi.centaline.com.cn/api/Rotate/AddRotateProjectDiscount',
                method: "post",
                data: {
                  RotateId: that.data.activeId,
                  ProjectId: projectId,
                  DiscountType: discountType,
                  DiscountContent: discountContent,
                  Mobile: that.data.mobile
                },
                success: r => {
                  if (r.data.code == 1001) {
                    setTimeout(function () {
                      that.showSale()
                    }, 500)
                  } else {
                    wx.showToast({
                      title: "网络异常，请稍后再试",
                      icon: "none"
                    })
                  }
                }
              })

            }
            else {
              wx.showToast({
                title: "授权失败，请稍后再试",
                icon: "none"
              })
              that.getCode()
            }
            wx.hideLoading();
          }
        })
      }
    }
  },
  // 已授权手机号领取
  getSale(e) {
    wx.showLoading({
      title: '领取中',
    })
    var that = this;
    console.log(e);
    var projectId = e.currentTarget.dataset.id;
    var discountType = e.currentTarget.dataset.t;
    var discountContent = e.currentTarget.dataset.c;
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Rotate/AddRotateProjectDiscount',
      method: "post",
      data: {
        RotateId: that.data.activeId,
        ProjectId: projectId,
        DiscountType: discountType,
        DiscountContent: discountContent,
        Mobile: that.data.mobile
      },
      success: r => {
        console.log(r);
        if (r.data.code == 1001) {
          setTimeout(function () {
            wx.hideLoading()
            that.showSale()
          }, 500)

        } else {
          wx.showToast({
            title: "网络异常，请稍后再试",
            icon: "none"
          })
        }
      }
    })
  }, 
  showSale() {
    this.data.hasSale = !this.data.hasSale;
    var that = this;
    that.setData({
      hasSale: that.data.hasSale
    })
  },  
  showBm(e) {
    this.data.hasBm = !this.data.hasBm;
    var that = this;
    // 显示遮罩层 
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease-out",
      delay: 0
    })
    animation.translateY(-400).step()
    that.setData({
      animationBm: animation.export(),
      hasBm: that.data.hasBm
    })
    animation.translateY(0).step()
    that.setData({
      animationBm: animation.export()
    })
  }, 

  setMsg(e) {
    var that = this;
    var type = e.currentTarget.dataset.t;
    var msg = e.detail.value;
    console.log(msg);
    if (type == "name") {
      that.setData({
        bmName: msg
      })
    } else if (type == "dh") {
      that.setData({
        bmPhone: msg
      })
    } else if (type == "rs") {
      that.setData({
        bmNum: msg
      })
    }
  },
  bm() {
    var that = this;
    if (that.data.bmName == "") {
      wx.showToast({
        title: "请填写姓名~",
        icon: "none"
      })
    } else if (that.data.bmPhone == "") {
      wx.showToast({
        title: "请填写手机号~",
        icon: "none"
      })
    } else if (that.data.bmPhone.length != 11 || !(/^1[345678]\d{9}$/.test(that.data.bmPhone))) {
      wx.showToast({
        title: "手机号格式错误~",
        icon: "none"
      })
    } else if (that.data.bmNum == "") {
      wx.showToast({
        title: "请填写人数~",
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.request({
        url: 'https://spapi.centaline.com.cn/api/Rotate/AddRotateEnroll',
        method: "post",
        data: {
          RotateId: that.data.activeId,
          FullName: that.data.bmName,
          Mobile: that.data.bmPhone,
          Number: that.data.bmNum
        },
        header: {
          "token": that.data.utoken
        },
        success: res => {
          console.log(res);
          if (res.data.code == 1001) {
            setTimeout(function () {
              wx.hideLoading();
              wx.showModal({
                title: '恭喜您报名成功~',
                content: '稍后会有相应的工作人员为您确认，请留意电话~',
                showCancel: false,
                success: function (r) {
                  if (r.confirm) {
                    that.setData({
                      hasBm: false
                    })
                  }
                }
              })
            }, 500)
          } else {
            wx.hideLoading();
            wx.showToast({
              title: "报名失败，请稍后再试",
              icon: "none"
            })
          }
        }
      })
    }
  },    
})