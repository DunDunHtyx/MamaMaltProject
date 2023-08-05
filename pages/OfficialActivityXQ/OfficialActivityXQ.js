// pages/actDetail/actDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://pic5.40017.cn/i/ori/LM3XlgM8w0.jpg',
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.ke2M3KHxJSE5EOoDuFuM6QHaE7?w=298&h=197&c=7&r=0&o=5&dpr=1.25&pid=1.7',
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.3Ez_BO9pXQ-lKa40StE4IAHaE7?w=243&h=180&c=7&r=0&o=5&dpr=1.25&pid=1.7'
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 2000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    inputShowed: false,

    activityID: '', //商家活动
    activityInfo: [], //商家活动信息
    businessInfo: '', //商家基本信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("商家活动ID", e.activityID);
    that.setData({
      activityID: e.activityID
    })
    //获取活动信息
    that.getActivity();
  },

  //获取活动具体信息
  getActivity() {
    let that = this;
    wx.cloud.database().collection('activity')
      .where({
        _id: that.data.activityID
      })
      .get()
      .then(res => {
        console.log("活动信息获取成功", res.data[0]);
        that.setData({
          activityInfo: res.data[0],
          imgUrls: res.data[0].swiperImage
        })
        that.getBusinessInfor();
      })
      .catch(err => {
        console.log("活动信息获取失败", err);
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

  //获取商家基本信息
  getBusinessInfor() {
    let that=this;
    // console.log("商家信息",that.data.activityInfo);
    // console.log("商家用户ID",that.data.activityInfo.userInforID);
    wx.cloud.database().collection('user')
    .where({
      _openid:that.data.activityInfo.userInforID
    })
    .get()
    .then(res=>{
      console.log("商家信息获取成功",res.data[0]);
      that.setData({
        businessInfo:res.data[0]
      })
    })
    .catch(err=>{
      console.log("商家信息获取失败",err);
    })
  },
  //电话预约
  goCall() {
    let that = this;
    // console.log("商家活动信息", that.data.activityInfo);
    wx.makePhoneCall({
      phoneNumber:that.data.businessInfo.CustomerPhone  //仅为示例，并非真实的电话号码
    })
  },

  // 预约
  yuyue() {
    let that = this;
    wx.navigateTo({
      url: '../booking/booking?id=' + that.data.activityID,
    })
  },

})