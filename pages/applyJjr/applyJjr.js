// pages/applyJjr/applyJjr.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    msg:"",
    utoken:"",
    uid:"",
    userTx:"",
    userName:"",
    mobile:"",
    role:"",
    name: "",
    gs:"",
    md: "",
    gw: "",
    fmPic:"",
    navH: "132rpx"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })    
    var that=this;
    that.getData();
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          uid: res.data.UserId,
          utoken: res.data.Token,
          userTx: res.data.HeadImg,
          userName: res.data.NickName,
          mobile:res.data.Mobile,
          role: res.data.RoleType,
          fmPic: res.data.WxQRcode
        })
        that.getUser();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index'
    } 
  },
  confim(e) {
    var that = this;
    that.setData({
      show: false,
    })
  },  
  cancel(e) {
    var that = this;
    that.setData({
      show: false,
    })
  },  
  setMsg(e){
    console.log(e);
    var that=this;
    var type=e.currentTarget.dataset.t;
    var msg=e.detail.value;
    if(type=="name"){
      that.setData({
        name:msg
      })
    } else if (type == "gs"){
      that.setData({
        gs: msg
      })      
    } else if (type == "md") {
      that.setData({
        md: msg
      })
    } else if (type == "gw") {
      that.setData({
        gw: msg
      })
    }
  },
  rz(){
    var that=this;
    console.log(that.data.fmPic);
    if (that.data.name==''){
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
      })      
    } else if (that.data.gs == '') {
      wx.showToast({
        title: '请填写所在公司',
        icon: 'none',
      })
    }else{
      wx.showLoading({
        title: '认证中',
      })      
      wx.request({
        url: 'https://spapi.centaline.com.cn/SPXinFangApi/Users/UserIsAgentrz',
        method:"post",
        header:{
          "token":that.data.utoken
        },
        data:{
          FullName: that.data.name,
          CompanyDes: that.data.gs,
          StoreDes: that.data.md,
          StationDes: that.data.gw,
          WxQRcode: that.data.fmPic
        },
        success:res=>{
          console.log(res);
          if(res.data.code==1001){
            setTimeout(function(){
              setTimeout(function () {
                wx.hideLoading();
                wx.showToast({
                  title: '认证成功'
                }) 
                
              }, 1000)
             
              setTimeout(function(){
                that.getUser();
                wx.hideLoading();
                wx.reLaunch({
                  url: '../my/my',
                })
              },2500)
            },500)
           
          }else{
            wx.hideLoading();
            wx.showToast({
              title: "认证失败，请稍后再试",
              icon: "none"
            })            
          }
        }
      })
    }
  },
  getUser(){
    var that=this;
    wx.showLoading({
      title: '',
      icon:"none"
    })
    wx.request({
      url: 'https://spapi.centaline.com.cn/SPXinFangApi/Users/GetUser',
      data: { UserId: that.data.uid },
      header: {
        'token': that.data.utoken
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1001) {
          wx.hideLoading();
          that.setData({
            name: res.data.data.FullName,
            gs: res.data.data.CompanyDes,
            mobile: res.data.data.Mobile,
            md: res.data.data.StoreDes,
            gw: res.data.data.StationDes
          })
          wx.setStorage({
            key: 'userInfo',
            data: res.data.data,
          })
          that.setData({
            uid: res.data.data.UserId,
            utoken: res.data.data.Token,
            userTx: res.data.data.HeadImg,
            userName: res.data.data.NickName,
            mobile: res.data.data.Mobile,
            role: res.data.data.RoleType,
            fmPic: res.data.data.WxQRcode
          })
        } else if (res.data.Message =="已拒绝为此请求授权。"){
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
        }else{
          wx.showToast({
            title: "服务器错误，请稍后再试",
            icon: "none"
          })            
        }
        wx.hideLoading()   
      } 
  })
  }, 
  getData() {
    var that = this;
    wx.request({
      url: 'https://spapi.centaline.com.cn/SPXinFangApi/System/GetSystemConfigByKey',
      data: { Key: 2 },
      success: res => {
        console.log(res);
        if (res.data.code == 1001) {
          that.setData({
            msg: res.data.data.BrokerStoreSalePower
          })
        }
      }
    })
  },
  selectPic(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        that.setData({
          fmPic: tempFilePaths,
        })
        setTimeout(function(){
          that.saveMsg();
        },10)
      }
    })
  },
  removeImage(e) {
    var that = this;
    console.log(that.data.fmPic);
    that.setData({
      fmPic:""
    })
  },

  handleImagePreview(e) {
    console.log(e);
    const images = this.data.fmPic
    wx.previewImage({
      current: images,
      urls: [images],
    })
  },
  saveMsg(e) {
    var that = this;
    wx.showToast({
      title: '上传中...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    wx.getFileSystemManager().readFile({
      filePath: that.data.fmPic, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: r => { //成功的回调

        var baseUrl = 'data:image/jpg;base64,' + r.data;
        wx.request({
          url: 'https://spapi.centaline.com.cn/SPXinFangApi/System/PostImgByBase64',
          method: "post",
          data: {
            ImgBase64: baseUrl
          },
          success: r => {
            console.log(r);
            if (r.data.code == 1001) {
              var newImg = r.data.message;
              that.setData({
                fmPic: newImg
              })
              wx.hideToast();

            } else {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败,请稍后再试~',
                showCancel: false,
                success: function (res) { }
              })
            }
          }
        })
      }
    })
  }     
})