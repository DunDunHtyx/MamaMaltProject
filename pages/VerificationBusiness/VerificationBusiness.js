var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID: '', //订单ID
    AccountID: '', //账号ID
    activityInformation: '', //活动信息
    orderInformation: '', //订单信息
    matchesInformation: '', //约定场次信息
    ticketInformation: '', //预定票价信息
    time:'',//核销时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    console.log("此订单ID", e.orderID);
    console.log("账号ID", app.globalData.user_openid);
    that.setData({
      orderID: e.orderID,
      AccountID: app.globalData.user_openid
    })
    //获取订单信息
    that.getOrderData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that=this;
    that.getOrderData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let that=this;
      that.getOrderData();
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

  },
  //活动订单信息
  getOrderData() {
    let that = this;
    wx.cloud.database().collection('booking')
      .where({
        _id: that.data.orderID
      })
      .get()
      .then(res => {
        console.log("活动订单信息获取成功", res.data);
        that.setData({
          orderInformation: res.data[0]
        })
        console.log("data中订单信息", that.data.orderInformation);
        console.log("预定活动ID", that.data.orderInformation.activityID);
        console.log("预定活动场次", that.data.orderInformation.matchesID);
        that.getActivityData();
      })
      .catch(err => {
        console.log("活动订单获取失败", err);
      })
  },
  //预约活动信息
  getActivityData() {
    let that = this;
    wx.cloud.database().collection('activity')
      .where({
        _id: that.data.orderInformation.activityID
      })
      .get()
      .then(res => {
        console.log("预约活动信息获取成功", res.data[0]);
        that.setData({
          activityInformation: res.data[0]
        })
        //获取 预定场次信息
        that.getMatchesInformation();
      })
      .catch(err => {
        console.log("预约活动信息获取失败", err);
      })
  },
  //获取预定场次信息
  getMatchesInformation() {
    let that = this;
    wx.cloud.database().collection('ticketInformation')
      .where({
        _id: that.data.orderInformation.matchesID
      })
      .get()
      .then(res => {
        console.log("预定场次信息获取成功", res.data[0]);
        that.setData({
          matchesInformation: res.data[0],
          ticketInformation: res.data[0].ticketType[that.data.orderInformation.pickTicketUnder]
        })
        console.log("预定票档信息", that.data.ticketInformation);
      })
      .catch(err => {
        console.log("预定场次信息获取失败", err);
      })
  },

  //获取核销时间
  //获取当前的时间

  gettime: function (e) {
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

  //核销订单信息
  Verification() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否要核销',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          that.gettime();
          console.log("核销时间",that.data.time);
          wx.cloud.callFunction({
            name: 'getDate',
            data: {
              num: "VerificationOrder",
              _id: that.data.orderID,
              AccountID: that.data.AccountID,
              orVerification: true,
              VerificationTime:that.data.time,//核销时间
            }
          })
          .then(res=>{
            console.log("核销成功",res);
            wx.switchTab({
              url: '../Mine/Mine',
            })
            wx.showToast({
              icon:'success',
              title: '核销成功',
            })
          })
          .catch(err=>{
            console.log("核销失败",err);
          })
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  }
})