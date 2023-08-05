// pages/RealNameAccredited/RealNameAccredited.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    name: '', //姓名
    ID: '', //身份证号
    phone: '', //手机号
    Address: '请输入活动地址', //活动地址
    DeatailAddress: '', //活动详细地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("用户openid", app.globalData.user_openid);
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
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  //获取输入的姓名
  getName(e) {
    let that = this;
    // console.log("姓名:",e.detail.value);
    that.setData({
      name: e.detail.value
    })
  },
  //获取输入的身份证号
  getID(e) {
    let that = this;
    that.setData({
      ID: e.detail.value
    })
    // console.log("身份证号",e.detail.value);
  },
  // 获取输入的手机号
  getNumber(e) {
    let that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  //获取居住地
  getAddress(e) {
    let that = this;
    // console.log("获取活动地址", e.detail.value[0] + "-" + e.detail.value[1] + "-" + e.detail.value[2]);
    that.setData({
      Address: e.detail.value[0] + "-" + e.detail.value[1] + "-" + e.detail.value[2]
    })
  },
  //获取详细地址
  getDetailAddress(e) {
    let that = this;
    // console.log("获取详细地址信息", e.detail.value);
    that.setData({
      DeatailAddress: e.detail.value
    })
  },
  // 获取是否同意 
  onChange(e) {
    console.log("勾选状态", e.detail);
    this.setData({
      checked: e.detail,
    });
  },
  //同意
  Yes() {
    let that = this;
    // 18位身份证校验
    let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    //15位身份证校验
    let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
    // 手机号正则表达式
    let _phone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    console.log("姓名", that.data.name);
    console.log("身份证号", that.data.ID);
    console.log("手机号", that.data.phone);
    console.log("居住地",that.data.Address);
    console.log("详细地址",that.data.DeatailAddress);
    console.log("勾选状态", that.data.checked);
    if (that.data.name.length <= 0 || that.data.ID.length <= 0 || that.data.phone.length <= 0) {
      wx.showToast({
        icon: 'error',
        title: '信息未填全',
      })
    } else if (that.data.name.length > 0 && that.data.ID.length > 0 && that.data.phone.length > 0 && that.data.checked == false) {
      wx.showToast({
        icon: 'error',
        title: '您未同意',
      })
    } else {
      // 校验身份证：
      if (_IDRe18.test(that.data.ID) || _IDre15.test(that.data.ID)) {
        if (_phone.test(that.data.phone)) {
          wx.cloud.callFunction({
            name: 'getDate',
            data: {
              num: "realNameAttestation",
              trueID: that.data.ID, //身份证号
              trueName: that.data.name, //真实姓名
              userOpenID: app.globalData.user_openid, //用户openID
              truePhone:that.data.phone,//用户电话
              userAdress:that.data.Address,//用户居住地址
              userDetailAddress:that.data.DeatailAddress,//用户详细地址
            }
          })
          .then(res=>{
            console.log("更新成功",res);
            wx.switchTab({
              url: '../Mine/Mine',
            })
            wx.showToast({
              icon:'success',
              title: '实名认证成功',
            })
          })
          .catch(err=>{
            console.log("更新失败",err);
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '手机号错误',
          })
        }
      } else {
        wx.showToast({
          icon: 'error',
          title: '身份证号错误',
        })
      }
    }
  }
})