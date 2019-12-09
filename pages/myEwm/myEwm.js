// pages/myEwm/myEwm.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
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
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          utoken:res.data.Token,
          fmPic: res.data.WxQRcode  
        })
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
  selectPic(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        console.log(e);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        that.setData({
          fmPic: tempFilePaths,
          show:true
        })
        console.log(that.data.fmPic);
      }
    })
  },
  removeImage(e) {
    var that=this;
    if (that.data.fmPic.indexOf('http://tmp')>-1){
      that.setData({
        fmPic: "",
        show:false
      })
    }else{
    wx.showModal({
      title: '删除提示',
      content: '确定删除已上传的二维码？',
      success:r=>{
        if (r.confirm) {           
          wx.showToast({
            title: '删除中...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })      
          wx.request({
            url: 'https://spapi.centaline.com.cn/SPXinFangApi/Users/UpdateWxQRcode',
            header: { token: that.data.utoken },
            method:"post",
            data:{
              WxQRcode:''
            },
            success:r=>{
              console.log(r);  
              if(r.data.code=="1001"){
                wx.showToast({
                  title: '删除成功',
                })  
                that.setData({
                  fmPic: "",
                  show: false
                })
                // setTimeout(function () {
                //   wx.navigateTo({
                //     url: '../my/my',
                //   })
                // }, 500)                                               
              }
              else if (r.data.Message="已拒绝为此请求授权。"){
                wx.showToast({
                  title: '登录信息已失效',
                  icon: 'loading',
                  mask: true,
                  duration: 2000                        
                }) 
                // setTimeout(function(){
                //   wx.navigateTo({
                //     url: '../login/login',
                //   })
                // },500)                     
              }
            }
          })
        }
      }
    })      
    }
  },

  handleImagePreview(e) {
    console.log(e);
    const images = this.data.fmPic
    wx.previewImage({
      current: images,
      urls: [images],
    })
  },
  saveMsg(e){
    var that=this;
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
      wx.getFileSystemManager().readFile({
        filePath: that.data.fmPic, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: r => { //成功的回调
          console.log('data:image/png;base64,' + r.data);
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
                wx.request({
                  url: 'https://spapi.centaline.com.cn/SPXinFangApi/Users/UpdateWxQRcode',
                  header: { token: that.data.utoken },
                  method:"post",
                  data:{
                    WxQRcode:that.data.fmPic
                  },
                  success:r=>{
                    console.log(r);  
                    if(r.data.code=="1001"){
                      wx.showToast({
                        title: '保存成功',
                      })
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 1000)                        
                    }else{
                      wx.showToast({
                        title: '登录信息已失效',
                        icon: 'loading',
                        mask: true,
                        duration: 2000                        
                      }) 
                      setTimeout(function(){
                        wx.reLaunch({
                          url: '../my/my',
                        })
                      },300)                     
                    }

                  }
                })

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