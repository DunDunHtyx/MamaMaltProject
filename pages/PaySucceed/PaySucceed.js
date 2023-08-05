var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid: '', //订单id
    bookInformation: [], //订单信息
    bookActivityInfo: [], //订单活动信息
    matches: [], //订单场次和票档信息
    ticketInfo: [], //票档具体信息
    getCallName: '', //联系人
    getCallPhone: '', //手机号
    userID: '', //用户ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // console.log("用户ID",app.globalData.user_openid);
    // console.log("订单id",options.bookId);
    that.setData({
      bookid: options.bookId,
      userID: app.globalData.user_openid
    })
    that.getBookingInfor();

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取此订单信息
  getBookingInfor() {
    let that = this;
    wx.cloud.database().collection('booking')
      .where({
        _id: that.data.bookid
      })
      .get()
      .then(res => {
        console.log("订单信息获取成功", res.data[0]);
        that.setData({
          bookInformation: res.data[0]
        })
        //获取订单 活动信息
        that.getBookActivityInfor();
        //获取预约票 信息
        that.getTicketInfo();
      })
      .catch(err => {
        console.log("订单信息获取失败", err);
      })
  },

  //获取订单 活动的信息
  getBookActivityInfor() {
    let that = this;
    wx.cloud.database().collection('activity')
      .where({
        _id: that.data.bookInformation.activityID
      })
      .get()
      .then(res => {
        that.setData({
          bookActivityInfo: res.data[0]
        })
      })
      .catch(err => {
        console.log("订单活动信息获取失败", err);
      })
  },
  //获取预定票信息
  getTicketInfo() {
    let that = this;
    wx.cloud.database().collection('ticketInformation')
      .where({
        _id: that.data.bookInformation.matchesID
      })
      .get()
      .then(res => {
        console.log("预定票信息获取成功", res.data[0]);
        console.log("票档信息", res.data[0].ticketType[that.data.bookInformation.pickTicketUnder]);
        that.setData({
          matches: res.data[0],
          ticketInfo: res.data[0].ticketType[that.data.bookInformation.pickTicketUnder]
        })
      })
      .catch(err => {
        console.log("预定票信息获取失败", err);
      })
  },
  //获取输入的联系人姓名
  getCallName(e) {
    let that = this;
    that.setData({
      getCallName: e.detail.value
    })
  },
  //获取输入的联系人的手机号
  getCallPhone(e) {
    let that = this;
    that.setData({
      getCallPhone: e.detail.value
    })
  },

  //提交订单
  SubmitOrder() {
    let that = this;
    console.log("当前已售完的票", that.data.ticketInfo.soldNumber);
    console.log('预定的票数', that.data.bookInformation.ticketNumber);
    console.log("共准备票数", that.data.ticketInfo.ticketTotalNumber);
    var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/; 
    if (that.data.getCallName == '' || that.data.getCallPhone == '') {
      wx.showToast({
        icon: 'error',
        title: '信息未补全',
      })
    }else if(!reg_tel.test(that.data.getCallPhone)){
        wx.showToast({
          icon:'error',
          title: '手机号不合法',
        })
    }else {
      wx.showModal({
        title: '提示',
        content: '是否支付',
        success: function (res) {
          if (res.confirm) { //支付成功
            if (that.data.bookInformation.ticketNumber > that.data.ticketInfo.ticketTotalNumber - that.data.ticketInfo.soldNumber) {
              wx.showToast({
                icon: 'error',
                title: '余票不足',
              })
            } else if (that.data.ticketInfo.ticketTotalNumber == that.data.ticketInfo.soldNumber || (that.data.ticketInfo.soldNumber == that.data.ticketInfo.ticketTotalNumber && that.data.ticketInfo.sellingState == true) || that.data.ticketInfo.sellingState == true) {
              wx.showToast({ //票订完，无法预定
                icon: 'error',
                title: '此票已售完',
              })
            } else if (that.data.ticketInfo.soldNumber != that.data.ticketInfo.ticketTotalNumber && that.data.ticketInfo.sellingState == false) {
              wx.cloud.database().collection('booking') //有余票，可以预定
                .where({
                  _id: that.data.bookid, //订单ID
                  BookUserId: that.data.userID, //用户账号ID
                })
                .update({
                  data: {
                    ContactName: that.data.getCallName, //联系人姓名
                    ContactPhone: that.data.getCallPhone, //联系人电话
                    orPayState: 1, //支付状态 更改为 付款成功
                    finallPay: that.data.bookInformation.ticketTotalPrtice, //最终付款金额
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
                  if ((that.data.ticketInfo.soldNumber + that.data.bookInformation.ticketNumber) == that.data.ticketInfo.ticketTotalNumber) {
                    //更新票数
                    wx.cloud.callFunction({
                        name: "getDate",
                        data: {
                          num: "UpdateTicketNumber",
                          _id: that.data.matches._id, //票档信息ID
                          activityID: that.data.bookInformation.activityID, //预约活动ID
                          ticketTime: that.data.matches.ticketTime, //预约票档时间
                          nowTicketNumber: that.data.ticketInfo.soldNumber, //当前已经售完的票数
                          pickTicketUnder: that.data.bookInformation.pickTicketUnder, //票档数组下标
                          ticketName: that.data.ticketInfo.ticketName, //预定票名
                          buyNumber: that.data.bookInformation.ticketNumber, //预定票的张数
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
                      url: '../VerificationOrder/VerificationOrder?orderId=' + that.data.bookid,
                    })
                  } else if ((that.data.ticketInfo.soldNumber + that.data.bookInformation.ticketNumber) != that.data.ticketInfo.ticketTotalNumber) { //目前票数+本次购买票数!=总票数 不用更改
                    //更新票数
                    wx.cloud.callFunction({
                        name: "getDate",
                        data: {
                          num: "UpdateTicketNumber",
                          _id: that.data.matches._id, //票档信息ID
                          activityID: that.data.bookInformation.activityID, //预约活动ID
                          ticketTime: that.data.matches.ticketTime, //预约票档时间
                          nowTicketNumber: that.data.ticketInfo.soldNumber, //当前已经售完的票数
                          pickTicketUnder: that.data.bookInformation.pickTicketUnder, //票档数组下标
                          ticketName: that.data.ticketInfo.ticketName, //预定票名
                          buyNumber: that.data.bookInformation.ticketNumber, //预定票的张数
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
                    wx.redirectTo({
                      url: '../VerificationOrder/VerificationOrder?orderId=' + that.data.bookid,
                    })
                  }
                })
                .catch(err => {
                  console.log("付款状态未知,订单信息更新成功");
                })
            }
          } else { //未支付

            wx.cloud.database().collection('booking')
              .where({
                _id: that.data.bookid, //订单ID
                BookUserId: that.data.userID, //用户账号ID
              })
              .update({
                data: {
                  ContactName: that.data.getCallName, //联系人姓名
                  ContactPhone: that.data.getCallPhone, //联系人电话
                  orPayState: 0, //订单状态
                }
              })
              .then(res => {
                console.log("未付款，订单信息更新成功");
                wx.showToast({
                  icon: 'error',
                  title: '您取消付款',
                })
                //跳转 待付款页
                wx.redirectTo({
                  url: '../WaitPay/WaitPay?Arrorder='+"0" + "---" + that.data.bookid,
                })
              })
              .catch(err => {
                console.log("未付款，订单信息更新成功");
              })
          }
        }
      })
    }
  },
})