// pages/WaitPay/WaitPay.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID: '', //订单ID
    orderInfor: '', //订单信息
    userID: '', //登录用户ID
    OrdActInfor: '', //预定活动信息
    ordMatchInfor: '', //预定票档信息
    ordTicketType: '', //预定票类信息
    time: 15 * 60 * 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("传参", e);
    let arr = e.Arrorder.split('---');
    console.log("切割数组", arr);
    console.log("登录用户openID", app.globalData.user_openid);
    let ResidualTime = parseInt(arr[0])
    that.setData({
      orderID: arr[1],
      userID: app.globalData.user_openid,
      time: (15 - ResidualTime) * 60 * 1000
    })
    // 获取订单信息
    that.getOrderInfor();
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
  // 获取该订单信息
  getOrderInfor() {
    let that = this;
    wx.cloud.database().collection('booking')
      .where({
        _id: that.data.orderID,
        BookUserId: that.data.userID
      })
      .get()
      .then(res => {
        console.log("该订单信息获取成功", res.data[0]);
        that.setData({
          orderInfor: res.data[0]
        })
        // 获取预定活动信息
        that.getOrdActInfo();
      })
      .catch(err => {
        console.log("该订单信息获取失败", err);
      })
  },
  // 获取预定活动信息
  getOrdActInfo() {
    let that = this;
    wx.cloud.database().collection('activity')
      .where({
        _id: that.data.orderInfor.activityID
      })
      .get()
      .then(res => {
        console.log("预定活动信息获取成功", res.data[0]);
        that.setData({
          OrdActInfor: res.data[0]
        })
        // 获取预定票档信息
        that.getOrdTicketInfor();
      })
      .catch(err => {
        console.log("预定活动信息获取失败", err);
      })
  },
  //获取预定票档信息
  getOrdTicketInfor() {
    let that = this;
    wx.cloud.database().collection('ticketInformation')
      .where({
        _id: that.data.orderInfor.matchesID,
      })
      .get()
      .then(res => {
        console.log("预定票档信息获取成功", res.data[0]);
        console.log("预定票档类型", res.data[0].ticketType[that.data.orderInfor.pickTicketUnder]);
        that.setData({
          ordMatchInfor: res.data[0], //预定票档信息
          ordTicketType: res.data[0].ticketType[that.data.orderInfor.pickTicketUnder], //预定票类信息
        })
      })
      .catch(err => {
        console.log("预定票档信息获取失败", err);
      })
  },

  //取消订单
  cancleOrder() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除该订单吗',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          if (that.data.userID == app.globalData.user_openid) {
            console.log("当前账号openID", app.globalData.user_openid);
            console.log("当前取消订单号", that.data.orderID);
            wx.cloud.callFunction({
                name: 'getDate',
                data: {
                  num: 'deletOrderBooking',
                  _id: that.data.orderID, //订单号
                  BookUserId: app.globalData.user_openid //订单发起者
                }
              })
              .then(res => {
                console.log("订单删除成功", res);
                wx.switchTab({
                  url: '../Mine/Mine',
                })
                wx.showToast({
                  icon: 'success',
                  title: '删除成功',
                })
              })
              .catch(err => {
                console.log("订单删除失败", err);
              })
          } else {
            wx.showToast({
              icon: 'error',
              title: '您无法取消',
            })
          }
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },

  //提交订单
  SubmitOrder() {
    let that = this;
    console.log("orderInfor 当前订单信息", that.data.orderInfor); //订单信息
    console.log("OrdActInfor 当前预定活动信息", that.data.OrdActInfor); //预定活动信息
    console.log("ordMatchInfor 当前预定票档信息", that.data.ordMatchInfor); //预定票档信息
    console.log("ordTicketType 当前预定票类信息", that.data.ordTicketType); //预定票类信息

    if (that.data.orderInfor.ContactName == '' || that.data.orderInfor.ContactPhone == '') {
      wx.showToast({
        icon: 'error',
        title: '信息残缺无法付款',
      })
    } else {
      if (that.data.orderInfor.ticketNumber > that.data.ordTicketType.ticketTotalNumber - that.data.ordTicketType.soldNumber) {
        wx.showToast({
          icon: 'error',
          title: '余票不足',
        })
      } else if (that.data.ordTicketType.ticketTotalNumber == that.data.ordTicketType.soldNumber || (that.data.ordTicketType.soldNumber == that.data.ordTicketType.ticketTotalNumber && that.data.ordTicketType.sellingState == true) || that.data.ordTicketType.sellingState == true) {
        wx.showToast({ //票订完，无法预定
          icon: 'error',
          title: '此票已售完',
        })
      } else if (that.data.ordTicketType.soldNumber != that.data.ordTicketType.ticketTotalNumber && that.data.ordTicketType.sellingState == false) {
        wx.cloud.database().collection('booking') //有余票，可以预定
          .where({
            _id: that.data.orderID, //订单ID
            BookUserId: that.data.userID, //用户账号ID
          })
          .update({
            data: {
              orPayState: 1, //支付状态 更改为 付款成功
              finallPay: that.data.orderInfor.ticketTotalPrtice, //最终付款金额
            }
          })
          .then(res => {
            console.log("付款成功，订单信息更新成功");
            wx.showToast({
              icon: 'success',
              title: '付款成功',
            })
            //更新票数
            //如果 目前票数+本次购买票数==总票数  更改为true
            if ((that.data.ordTicketType.soldNumber + that.data.orderInfor.ticketNumber) == that.data.ordTicketType.ticketTotalNumber) {
              //更新票数
              wx.cloud.callFunction({
                  name: "getDate",
                  data: {
                    num: "UpdateTicketNumber",
                    _id: that.data.ordMatchInfor._id, //票档信息ID
                    activityID: that.data.orderInfor.activityID, //预约活动ID
                    ticketTime: that.data.ordMatchInfor.ticketTime, //预约票档时间
                    nowTicketNumber: that.data.ordTicketType.soldNumber, //当前已经售完的票数
                    pickTicketUnder: that.data.orderInfor.pickTicketUnder, //票档数组下标
                    ticketName: that.data.ordTicketType.ticketName, //预定票名
                    buyNumber: that.data.orderInfor.ticketNumber, //预定票的张数
                    sellingState: true, //票档售卖情况
                  }
                })
                .then(res => {
                  console.log("票档数信息更新成功", res);
                })
                .catch(err => {
                  console.log("票档数信息更新失败", err);
                })
              //跳转核销页面
              wx.redirectTo({
                url: '../VerificationOrder/VerificationOrder?orderId=' + that.data.orderID,
              })
            } else if ((that.data.ordTicketType.soldNumber + that.data.orderInfor.ticketNumber) != that.data.ordTicketType.ticketTotalNumber) { //目前票数+本次购买票数!=总票数 不用更改
              //更新票数
              wx.cloud.callFunction({
                  name: "getDate",
                  data: {
                    num: "UpdateTicketNumber",
                    _id: that.data.ordMatchInfor._id, //票档信息ID
                    activityID: that.data.orderInfor.activityID, //预约活动ID
                    ticketTime: that.data.ordMatchInfor.ticketTime, //预约票档时间
                    nowTicketNumber: that.data.ordTicketType.soldNumber, //当前已经售完的票数
                    pickTicketUnder: that.data.orderInfor.pickTicketUnder, //票档数组下标
                    ticketName: that.data.ordTicketType.ticketName, //预定票名
                    buyNumber: that.data.orderInfor.ticketNumber, //预定票的张数
                    sellingState: false, //票档售卖状态
                  }
                })
                .then(res => {
                  console.log("票档数信息更新成功", res);
                })
                .catch(err => {
                  console.log("票档数信息更新失败", err);
                })
              //跳转核销页面
              wx.reLaunch({
                url: '../VerificationOrder/VerificationOrder?orderId=' + that.data.orderID,
              })
            }
          })
          .catch(err => {
            console.log("付款状态未知,订单信息更新成功",err);
          })
      }
    }
  },


  // 时间结束
  EndTime() {
    let that = this;
    console.log("倒计时结束");
    // 取消订单
    that.cancleOrder();
  }


})