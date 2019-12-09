// {
//   pagePath: "/pages/house/house",
//     iconPath: "/img/house.png",
//       selectedIconPath: "/img/house1.png",
//         text: "房源"
// }
Component({
  data: {
    selected: 0,
    color: "#999",
    selectedColor: "#ff4631",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/img/zyz.png",
      selectedIconPath: "/img/zyz1.png",
      text: "优惠卷"
    }, {
        pagePath: "/pages/my/my",
        iconPath: "/img/wd.png",
        selectedIconPath: "/img/wd1.png",
        text: "我的"
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(data);
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },
  }
})