// pages/Mine/Mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID: '', //订单ID
    activityID: '', //活动ID
    activityUserInfo: '', //活动扫码者
    userInfor: '', //用户信息
    SettledInfor:'<p>如果您想开通商家线下活动或者想进行商业&amp;媒体广告合作</p><p>请联系客服微信</p><p>&nbsp; &nbsp;13082126628</p><p>立即开通商家活动入驻，共同打造优质线下活动</p><p>&nbsp;</p>',
    OrHidden: false, //是否打开遮罩层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    // 获取用户信息
    that.getUserInfor();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 获取用户信息
  getUserInfor() {
    let that = this;
    console.log("用户的openid", app.globalData.user_openid);
    wx.cloud.database().collection('user')
      .where({
        _openid: app.globalData.user_openid
      })
      .get()
      .then(res => {
        console.log("用户信息获取成功", res.data[0]);
        that.setData({
          userInfor: res.data[0]
        })
        // console.log("data中用户信息",that.data.userInfor);
      })
      .catch(err => {
        console.log("用户信息获取失败", err);
      })
  },
  //扫码
  saoMa() {
    let that = this;
    wx.scanCode({ //扫描API
      success: function (res) {
        console.log("扫码成功", res.result); //输出回调信息
        wx.showToast({
          title: '成功',
          duration: 2000
        })
        that.setData({
          orderID: res.result //订单ID
        })
        //获取订单信息
        that.getOrderInformation();
      }
    })
  },
  //获取活动信息
  getActivity() {
    let that = this;
    wx.cloud.database().collection('activity')
      .where({
        _id: that.data.activityID
      })
      .get()
      .then(res => {
        console.log("获取活动信息成功", res.data[0].ScanCoder);
        that.setData({
          activityUserInfo: res.data[0].ScanCoder
        })
        //判断匹配
        that.compare();
      })
      .catch(err => {
        console.log("获取活动信息失败", err);
      })
  },
  //获取订单信息
  getOrderInformation() {
    let that = this;
    wx.cloud.database().collection('booking')
      .where({
        _id: that.data.orderID
      })
      .get()
      .then(res => {
        console.log("订单信息获取成功", res.data[0]);
        that.setData({
          activityID: res.data[0].activityID //活动Id
        })
        //获取活动ID
        that.getActivity();
      })
      .catch(err => {
        console.log("订单信息获取失败", err);
      })
  },
  //对比 当前 扫码用户账号 是否 与商家订单 相匹配
  compare() {
    let that = this;
    console.log("当前账号ID", app.globalData.user_openid);
    console.log("本活动授权账号ID", that.data.activityUserInfo);
    let AuthorizedUsers = that.data.activityUserInfo;
    for (let i = 0; i < AuthorizedUsers.length; i++) {
      if (AuthorizedUsers[i] == app.globalData.user_openid) {
        wx.navigateTo({
          url: '../VerificationBusiness/VerificationBusiness?orderID=' + that.data.orderID,
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: '您无权限',
        })
      }
    }
  },
  //跳转 实名认证
  goRealname() {
    let that = this;
    console.log("实名认证");
    console.log("用户信息", that.data.userInfor.orAttestation);
    if (that.data.userInfor.orAttestation == true) {
      wx.showToast({
        icon: "none",
        title: '您已实名认证',
      })
    } else {
      wx.navigateTo({
        url: '../RealNameAccredited/RealNameAccredited',
      })
    }
  },
  //跳转 地址管理
  goAddressManagement() {
    console.log("地址管理");
    wx.navigateTo({
      url: '../AddressManagePage/AddressManagePage?GoodID=-999'+'&type='+1,
    })
  },
  //跳转 个人信息
  goPersonalInformation() {
    console.log("个人信息");
    wx.navigateTo({
      url: '../PersonInforPage/PersonInforPage',
    })
  },
  //跳转 线下活动
  goOfflineEvents() {
    console.log("线下活动");
    wx.navigateTo({
      url: '../underActive/underActive',
    })
  },
  //跳转 通知
  goNotice() {
    console.log("通知");
    wx.navigateTo({
      url: '../NoticePage/NoticePage',
    })
  },
  //跳转 帖子
  goPost() {
    console.log("帖子");
    wx.navigateTo({
      url: '../PostPage/PostPage',
    })
  },
  //跳转 我发布的
  goPublish() {
    console.log("我发布的");
    wx.navigateTo({
      url: '../BuyAndSell/BuyAndSell?type=0',
    })
  },
  //跳转 我卖出的
  goSell() {
    console.log("我卖出的");
    wx.navigateTo({
      url: '../BuyAndSell/BuyAndSell?type=1',
    })
  },
  //跳转 我买到的
  goBuy() {
    console.log("我买到的");
    wx.navigateTo({
      url: '../BuyAndSell/BuyAndSell?type=2',
    })
  },
  //跳转 商家入驻
  goMerchantsSettle() {
    console.log("商家入驻");
  },
  //跳转 设置
  goSet() {
    console.log("设置");
    wx.navigateTo({
      url: '../setup/setup',
    })
  },
  //关闭遮罩层
  conceal() {
    let that = this;
    that.setData({
      OrHidden: false
    })
  },
  //打开遮罩层
  show() {
    let that = this;
    that.setData({
      OrHidden: true
    })
  },
})