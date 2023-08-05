// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, //用户信息
    checked: false, //复选框选中状态 false未选中 true选中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    //初始化用户信息
    that.initializationUser();
    //获取用户openID
    that.getUserOpenID();
    //获取设备信息
    that.getEquipmentInformation();
  },

  //初始化用户账号信息
  initializationUser() {
    let that = this;
    app.globalData.user_openid = ''; //用户openid
    app.globalData.userInfo = null; //用户信息
    app.globalData.deviceInfo = []; //设备信息
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let that = this;
    //初始化用户信息
    that.initializationUser();
    //获取用户openID
    that.getUserOpenID();
    //获取设备信息
    that.getEquipmentInformation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;
    //初始化用户信息
    that.initializationUser();
    //获取用户openID
    that.getUserOpenID();
    //获取设备信息
    that.getEquipmentInformation();
  },

  //切换复选框选中状态
  onChange(e) {
    let that = this;
    console.log("选中状态", e.detail);
    that.setData({
      checked: e.detail,
    });
  },


  //跳转到 服务协议页面
  goServerAgreement() {
    wx.navigateTo({
      url: '../serviceAgreement/serviceAgreement',
    })
  },
  //跳转到 隐私协议 页面
  goPrivacyAgreement() {
    wx.navigateTo({
      url: '../privacyAgreement/privacyAgreement',
    })
  },

  //获取用户账号唯一标识openID
  getUserOpenID(){
    wx.cloud.callFunction({
      name: 'userInfor',
      data: {
        num: 'getUserOpenid'
      },
      success: res => {
        app.globalData.user_openid=res.result.OPENID;
      },
      fail: err => {
        console.log("用户openid失败", err);
      }
    })

  },
  //获取用户设备信息
  getEquipmentInformation(){
    wx.getSystemInfo({
      success:(res=>{
        app.globalData.deviceInfo=res;
      })
    })
  },

  //微信一键登录事件
  Login() {
    let that = this;
    if (that.data.checked == false) { //如果未选中
      wx.showToast({
        icon: 'error',
        title: '请先勾选同意',
      })
    } else {
      //调函数 获取用户信息
      wx.getUserProfile({
        desc: '展示用户信息',
        success: (res) => {
          console.log("成功获取", res.userInfo);
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo
          })
          //判断 是否有该用户 信息
          console.log("用户openid", app.globalData.user_openid);
          wx.cloud.database().collection("user")
            .where({
              _openid: app.globalData.user_openid
            })
            .get()
            .then(res => {
              console.log("查询成功", res);
              //如果不存在
              if (!res.data[0]) {
                wx.cloud.callFunction({
                    name: 'userInfor',
                    data: {
                      num: "addUser",
                      userInfo: that.data.userInfo,
                      _openid: app.globalData.user_openid
                    }
                  })
                  .then(res => {
                    console.log("用户信息添加成功", res);
                    wx.cloud.database().collection('user').where({
                        _id: res.result._id
                      })
                      .get()
                      .then(res => {
                        console.log("获取用户信息", res.data[0]);
                        that.setData({
                          userInfo: res.data[0]
                        })
                        app.globalData.userInfo = res.data[0];
                      })
                      .catch(err => {
                        console.log("获取用户信息失败", err);
                      })
                  })
                  .catch(err => {
                    console.log("用户信息添加失败", err);
                  })
              } else { //存在该用户信息
                app.globalData.userInfo = res.data[0]
                wx.showToast({
                  title: '登录成功',
                  icon: 'none'
                })
                wx.switchTab({
                  url: '../Home/Home',
                })
              }
            })
            .catch(err => {
              console.log("查询失败", err);
            })

        },
      })
    }
  },
})