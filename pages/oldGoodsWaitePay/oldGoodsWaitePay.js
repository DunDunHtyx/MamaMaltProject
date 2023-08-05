// pages/oldGoodsWaitePay/oldGoodsWaitePay.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitPayID: '', //待付款订单ID
    waitPayInfo: [], //待付款订单信息
    time: 15 * 60 * 1000,
    times:'',//服务器时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("e",e.LagTime);
    console.log("未付款ID", e.OrderID);
    that.setData({
      waitPayID: e.OrderID,
      time: (15 - e.LagTime) * 60 * 1000
    })
    //获取待付款商品信息
    that.getWaitePayOrderInfo();
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

  //获取未付款订单信息
  getWaitePayOrderInfo() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'getWaitePayOrderInfo',
          orderID: that.data.waitPayID
        }
      })
      .then(res => {
        console.log("待付款商品信息获取成功", res.result.list[0]);
        that.setData({
          waitPayInfo: res.result.list[0]
        })
      })
      .catch(err => {
        console.log("待付款商品信息获取失败", err);
      })
  },

  //取消订单
  DeleatOldGoodOrder() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要取消订单',
      complete: (res) => {
        if (res.cancel) {
          console.log("用户取消");
        }
        if (res.confirm) {
          console.log("用户确定");
          if (that.data.waitPayInfo.BuyersID == app.globalData.user_openid) {
            console.log("您可以取消订单");
            wx.cloud.callFunction({
                name: "getDate",
                data: {
                  num: 'deletOldGoodOrderBooking',
                  _id: that.data.waitPayInfo._id,
                  BuyersID: app.globalData.user_openid,
                }
              })
              .then(res => {
                console.log("取消订单成功", res);
                wx.showToast({
                  icon:'error',
                  title: '订单取消成功',
                })
                wx.switchTab({
                  url: '../Mine/Mine',
                })
              })
              .catch(err => {
                console.log("取消订单失败", err);
              })
          } else {
            wx.showToast({
              icon: 'error',
              title: '您无法取消',
            })
          }
        }
      }
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
      times: dataTime
    })
  },

  //去付款
  goPay() {
    let that = this;
    that.time();
    if (that.data.waitPayInfo.BuyersID == app.globalData.user_openid) {
      if (that.data.waitPayInfo.goodState == 0) { //商品再买状态
        wx.cloud.callFunction({
            name: 'getDate',
            data: {
              num: 'PayWaiteOldGoodOrderBooking',
              _id: that.data.waitPayInfo._id,
              BuyersID: app.globalData.user_openid,
              finallPrtice: that.data.waitPayInfo.totalPrtice,
              BuyTime: that.data.times
            }
          })
          .then(res => {
            console.log("付款成功", res);
            wx.showToast({
              icon:"success",
              title: '支付成功',
            }) 
            setTimeout(function(){
              wx.redirectTo({
                url: '../oldGoodSuccess/oldGoodSuccess?OrderID='+that.data.waitPayInfo._id,
              })
            },2000)      
          })
          .catch(err => {
            console.log("付款失败", err);
          })
      } else {
        wx.showToast({
          icon: 'error',
          title: '商品已下架',
        })
      }
    } else {
      wx.showToast({
        icon: 'error',
        title: '您无法付款',
      })
    }
  },

    // 时间结束
    EndTime() {
      let that = this;
      console.log("倒计时结束");
      // 取消订单
      that.DeleatOldGoodOrder();
    }
})