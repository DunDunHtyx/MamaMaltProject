// pages/AddTrackingNumber/AddTrackingNumber.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    OrderID: '', //快递单号
    CourierCompanies: ['圆通快递', '中通快递', '申通快递', '顺丰快递', '韵达快递', '百世快递', '京东快递', 'EMS快递', '德邦快递', '天天快递', '鸡兔快递'],
    showCourier: '请选择快递公司',
    inputCourierNumber: '', //快递单号
    time:'',//时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("订单号", e.orderID);
    that.setData({
      OrderID: e.orderID
    })
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

  //下拉选择框
  ChoiceCourierCompanies(e) {
    let that = this;
    console.log("下拉选择框", e.detail.value);
    that.setData({
      showCourier: that.data.CourierCompanies[e.detail.value]
    })
  },

  //获取输入的快递单号
  getInputNumber(e) {
    let that = this;
    console.log("输入的单号", e.detail.value);
    that.setData({
      inputCourierNumber: e.detail.value
    })
  },

  //获取当前的时间

  time: function (e) {
    let that = this;
    //获取时间：年月日
    let dataTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    let hour = new Date().getHours()
    let minute = new Date().getMinutes()
    dataTime = `${yy}.${mm}.${dd} ${hour}:${minute}`;
    that.setData({
      time: dataTime
    })
  },

  //添加快递单号
  addCourierCompanies() {
    let that = this;
    that.time();
    if (that.data.showCourier === "请选择快递公司" || that.data.inputCourierNumber.length <= 0) {
      wx.showToast({
        icon: 'error',
        title: '请填全信息',
      })
    } else {
      wx.cloud.database().collection('OldGoodsBuyState')
        .where({
          _id: that.data.OrderID, //订单ID
          SellerID: app.globalData.user_openid, //卖家OpenID
        })
        .update({
          data: {
            CourierCompanies: that.data.showCourier, //快递公司
            TrackingNumber: that.data.inputCourierNumber, //快递单号
            shipmentsTime:that.data.time,//时间
            GoodsTransportState:1,//已发货,未确定收货
          }
        })
        .then(res => {
          console.log("商品订单信息更新成果",res);
          wx.showToast({
            icon:'success',
            title: '单号添加成功',
          })
          setTimeout(function(){
            wx.switchTab({
              url: '../Mine/Mine',
            })
          },3000)
        })
        .catch(err => {
          console.log("商品订单信息更新失败",err);
        })
    }
  }

})