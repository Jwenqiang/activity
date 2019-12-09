// pages/acHb/acHb.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVideo: false,
    name:"",
    bgImg: "",
    ewm: "",
    tx:"",
    mobile:"",
    utoken:"",
    role:"",
    activeId: 5,
    oneId: 0,
    secondId: 0,
    navH: "132rpx"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      navH: app.globalData.navHeight
    })      
    if (e.Id) {
      this.setData({
        activeId: e.Id
      })
    }
    if (e.OneStartUserId) {
      this.setData({
        oneId: e.OneStartUserId
      })
    }
    if (e.StartUserId) {
      this.setData({
        secondId: e.StartUserId
      })
    } 
    var that = this;
    wx.getStorage({
      key: 'activeData',
      success: function (res) {
        that.setData({
          bgImg: res.data.Poster
        })
      },
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          utoken: res.data.Token,
          role: res.data.RoleType,
          tx: res.data.HeadImg,
          name: res.data.NickName,
        })
        if (res.data.HeadImg==''){
          tx:""
        }
        that.getUser();
      },
    })  
    setTimeout(function(){
      that.getEwm(); 
    },10)      
           
  
    // that.setData({
    //   bgImg: "https://hfugfile.centaline.com.cn/filedata/4/image/20190808/20190808162409_5984.png",
    //   ewm: "https://hfugweb.centaline.com.cn/img/smallR/rotate/ewm.jpg",
    //   tx:"https://hfugweb.centaline.com.cn/img/smallR/rotate/bj.jpg",
    //   mobile:"4555"
    // }) 
 
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
  //调用子组件的方法
  getSharePoster() {
    // this.setData({ showVideo: false})
    this.selectComponent('#getPoster').getAvaterInfo();
  },

  // myEventListener: function (e) {
  //   this.setData({ showVideo: true })
  // },
  getUser(){
    var that=this;
    wx.request({
      url: 'https://spapi.centaline.com.cn/SPXinFangApi/Users/GetUser',
      header:{
        'token':that.data.utoken
      },
      success: res=>{
        console.log(res);
        if(res.data.code==1001){
          if (that.data.role == 5 || that.data.role == 4){
            if (res.data.data.MobileDisplayBl){
              that.setData({
                mobile: res.data.data.Mobile
              })
            }
          }
          
        }
      }
    })
  },
  getEwm(){
    wx.showLoading({
      title: '获取数据',
      mask: true,
    });
    var that=this;
    wx.request({
      url: 'https://spapi.centaline.com.cn/SPXinFangApi/Rotate/GetWxQRcode',
      method:"post",
      data:{
        scene: 'Id=' + that.data.activeId + "," + that.data.oneId + "," + that.data.secondId +",3",
        page: 'pages/active/active'
      },
      success:res=>{
        console.log(res);
        if(res.data.code==1001){
          that.setData({
            ewm:res.data.message
          })
          setTimeout(function(){
            that.getSharePoster(); 
          },10)
          
        }else{
          wx.showToast({
            title: '网络异常,请稍后~',
            icon: 'none'
          }) 
          setTimeout(function(){
            wx.navigateBack({
              detail:1
            })
          },2000)          
        }
      }
    })
  }  
})