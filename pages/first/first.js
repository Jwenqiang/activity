//index.js
//获取应用实例
const app = getApp()

//计数器
var interval = null;

//值越大旋转时间越长  即旋转速度
var intime = 50;

Page({
  data: {
    color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    //奖品金额
    money:["20","60","80","10","200","500"],
    // btnconfirm: '/img/dianjichoujiang.png',
    // clickLuck: 'clickLuck',
    luckPosition: 0,
    isHas:false,
    show:true,
    utoken:"",
    uid:"",
    role:""
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          utoken: res.data.Token,
          uid: res.data.UserId,
          role: res.data.RoleType,
          show: false
        })

      },
      fail(e) {
      // this.loadAnimation();
      // this.clickLuck()
      }
    })    
  },

  input: function (e) {
    var data = e.detail.value;
    this.setData({
      luckPosition: data
    })
  },


  //点击抽奖按钮
  clickLuck: function () {

    var e = this;

    //判断中奖位置格式
    // if (e.data.luckPosition == null || isNaN(e.data.luckPosition) || e.data.luckPosition > 5) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写正确数值',
    //     showCancel: false,
    //   })
    //   return;
    // }



    //设置按钮不可点击
    // e.setData({
    //   btnconfirm: '/img/dianjichoujiangd.png',
    //   clickLuck: '',
    // })
    //清空计时器
    clearInterval(interval);
    var index = 0;
    console.log(e.data.color[0]);
    //循环设置每一项的透明度
    interval = setInterval(function () {
      if (index > 5) {
        index = 0;
        e.data.color[5] = 0.5
      } else if (index != 0) {
        e.data.color[index - 1] = 0.5
      }
      e.data.color[index] = 1
      e.setData({
        color: e.data.color,
      })
      index++;
    }, intime);

    //模拟网络请求时间  设为两秒
    var stoptime = 2000;
    setTimeout(function () {
      e.stop(e.data.luckPosition);
    }, stoptime)

  },

  //也可以写成点击按钮停止抽奖
  // clickStop:function(){
  //   var stoptime = 2000;
  //   setTimeout(function () {
  //     e.stop(1);
  //   }, stoptime)
  // },

  stop: function (which) {
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var color = e.data.color;
    for (var i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;

    e.stopLuck(which, index, intime, 10);
  },


  /**
   * which:中奖位置
   * index:当前位置
   * time：时间标记
   * splittime：每次增加的时间 值越大减速越快
   */
  stopLuck: function (which, index, time, splittime) {
    var e = this;
    //值越大出现中奖结果后减速时间越长
    var color = e.data.color;
    setTimeout(function () {
      //重置前一个位置
      if (index > 5) {
        index = 0;
        color[5] = 0.5
      } else if (index != 0) {
        color[index - 1] = 0.5
      }
      //当前位置为选中状态
      color[index] = 1
      e.setData({
        color: color,
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 400 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        e.stopLuck(which, index, time, splittime);
      } else {
        //1秒后显示弹窗
        setTimeout(function () {
          e.setData({
            isHas:true
          })
          // if (which == 1 || which == 3 || which == 5) {
          //   //中奖
          //   wx.showModal({
          //     title: '提示',
          //     content: '恭喜中奖',
          //     showCancel: false,
          //     success: function (res) {
          //       if (res.confirm) {
          //         //设置按钮可以点击
          //         e.setData({
          //           btnconfirm: '/img/dianjichoujiang.png',
          //           clickLuck: 'clickLuck',
          //         })
          //         e.loadAnimation();
          //       }
          //     }
          //   })
          // } else {
          //   //中奖
          //   wx.showModal({
          //     title: '提示',
          //     content: '很遗憾未中奖',
          //     showCancel: false,
          //     success: function (res) {
          //       if (res.confirm) {
          //         //设置按钮可以点击
          //         e.setData({
          //           btnconfirm: '/img/dianjichoujiang.png',
          //           clickLuck: 'clickLuck',
          //         })
          //         e.loadAnimation();
          //       }
          //     }
          //   })
          // }
        }, 1000);
      }
    }, time);
    console.log(time);
  },
  //进入页面时缓慢切换
  loadAnimation: function () {
    var e = this;
    var index = 0;
    // if (interval == null){
    interval = setInterval(function () {
      if (index > 5) {
        index = 0;
        e.data.color[5] = 0.5
      } else if (index != 0) {
        e.data.color[index - 1] = 0.5
      }
      e.data.color[index] = 1
      e.setData({
        color: e.data.color,
      })
      index++;
    }, 1000);
    // }  
  },

  //通过绑定手机号登录
  getUserInfo: function (e) {
    console.log(e);
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData;
    var tx = e.detail.userInfo.avatarUrl;
    var name = e.detail.userInfo.nickName;
    var that = this;
    console.log(ivObj);
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    wx.login({
      success(res) {
        console.log(res);
        // that.setData({
        //   wxcode: res.code
        // })
        wx.request({
          url: 'https://spapi.centaline.com.cn/SPXinFangApi/Users/UserLogin', //接口地址
          data: {
            code: res.code,
            encryptedData: telObj,
            iv: ivObj,
            Type: 4,
            AuthorizeType: 2
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
                show:false
              })
              // this.loadAnimation();
              that.clickLuck()
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
    })

    //   }
    // });

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
})
