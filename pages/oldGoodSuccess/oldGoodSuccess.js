// pages/oldGoodSuccess/oldGoodSuccess.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    OrderID: '', //订单ID
    orderInfo: [], //订单详细信息
    goPageType:'',//跳转页面类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("e",e);
    that.setData({
      OrderID: e.OrderID,
      goPageType:e.goType
    })
    //获取商品订单信息
    that.getOrderInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //获取商品订单详细信息
  getOrderInfo() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'getWaitePayOrderInfo',
          orderID: that.data.OrderID
        }
      })
      .then(res => {
        console.log("获取商品订单详细信息成功", res.result.list[0]);
        that.setData({
          orderInfo: res.result.list[0]
        })
      })
      .catch(err => {
        console.log("获取商品订单详细信息失败", err);
      })
  },

  //返回首页
  goBackIndex() {
    wx.switchTab({
      url: '../Mine/Mine',
    })
  },

  //填写快递单号
  writeTrackingNumber(){
    let that=this;
    console.log("填写快递单号");
    wx.redirectTo({
      url: '../AddTrackingNumber/AddTrackingNumber?orderID='+that.data.OrderID,
    })
  },
 
  //联系商家
  phoneBusser() {
    let that = this;
    wx.makePhoneCall({
        phoneNumber: that.data.orderInfo.truePhone //仅为示例，并非真实的电话号码      ​
    })
  }
})