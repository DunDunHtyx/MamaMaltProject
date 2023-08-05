// pages/newAddressPage/newAddressPage.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateID: '', //要更新的地址ID
    updateReceiptInfo: [], //要更新的地址信息
    showChoiceAddress: '点击选择', //选择的城市
    receiptPeople: '', //收货人
    receiptPhone: '', //手机号码
    receiptDetailAddress: '', //详细地址
    orUpdate: false, //是否更新地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("e", e.ID);
    if (e.ID == -999) {
      console.log("添加地址");
    } else if (e.ID != -999) {
      console.log("修改地址");
      that.setData({
        updateID: e.ID,
        orUpdate: true
      })
      that.getOrganReceiptInfo()
    }
  },


  //获取输入的收货人
  getReceiptPeople(e) {
    let that = this;
    // console.log("输入的收货人",e.detail.value);
    that.setData({
      receiptPeople: e.detail.value
    })

  },
  //获取输入的手机号码
  getReceiptPhone(e) {
    let that = this;
    // console.log("输入的手机号码",e.detail.value);
    that.setData({
      receiptPhone: e.detail.value
    })
  },
  //获取输入的详细地址
  getReceiptAddress(e) {
    let that = this;
    // console.log("输入的详细地址",e.detail.value);
    that.setData({
      receiptDetailAddress: e.detail.value
    })
  },
  //获取城市选择
  getPicker(e) {
    let that = this;
    // console.log("选择的城市为",e.detail.value);
    let address = e.detail.value[0] + '-' + e.detail.value[1] + "-" + e.detail.value[2];
    console.log("选择的城市整理为", address);
    that.setData({
      showChoiceAddress: address
    })
  },
  //添加地址
  addAddress() {
    let that = this;
    console.log("收货人", that.data.receiptPeople);
    console.log("手机号", that.data.receiptPhone);
    console.log("地区", that.data.showChoiceAddress);
    console.log("详细地址", that.data.receiptDetailAddress);
    let phone = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    if (that.data.receiptPeople.length <= 0 || that.data.receiptPhone.length <= 0 || that.data.receiptDetailAddress.length <= 0 || that.data.showChoiceAddress === "点击选择") {
      wx.showToast({
        icon: "error",
        title: '请信息填全',
      })
    } else if (phone.test(that.data.receiptPhone) == false) {
      wx.showToast({
        icon: 'error',
        title: '手机号不合法',
        // && that.data.ReceiptPhone === that.data.updateReceiptInfo.ReceiptPhone  
      })
    } else {
      if (that.data.orUpdate == true) {
        console.log("更新收货地址");
        // console.log("updateReceiptInfo", that.data.updateReceiptInfo);
        if ((that.data.receiptPeople === that.data.updateReceiptInfo.ReceiptName) && (that.data.showChoiceAddress === that.data.updateReceiptInfo.ReceiptAddress) &&(that.data.receiptDetailAddress=== that.data.updateReceiptInfo.ReceiptDetailAddress)&&(that.data.receiptPhone==that.data.updateReceiptInfo.ReceiptPhone)  ) {
          wx.showToast({
            icon: 'error',
            title: '先修改再更新',
          })
        } else {
          console.log("可以更新");
          wx.showLoading({
            title: '更新中',
          })
          wx.cloud.callFunction({
              name: 'getDate',
              data: {
                num: 'updateReceiptAddress',
                _id: that.data.updateID, //更新地址ID
                userID: app.globalData.user_openid, //用户ID
                ReceiptAddress: that.data.showChoiceAddress, //地区
                ReceiptDetailAddress: that.data.receiptDetailAddress, //详细地址
                ReceiptName: that.data.receiptPeople, //收货人
                ReceiptPhone: that.data.receiptPhone //手机号
              }
            })
            .then(res => {
              console.log("收货地址更新成功", res);
              wx.hideLoading();
              wx.switchTab({
                url: '../Mine/Mine',
              })
            })
            .catch(err => {
              console.log("收货地址更新失败", err);
            })
        }
      } else {
        console.log("添加收货地址");
        wx.showLoading({
          title: '添加中',
        })
        wx.cloud.callFunction({
            name: 'getDate',
            data: {
              num: 'addReceiptAddress',
              ReceiptAddress: that.data.showChoiceAddress, //地区
              ReceiptDetailAddress: that.data.receiptDetailAddress, //详细地址
              ReceiptName: that.data.receiptPeople, //收货人
              ReceiptPhone: that.data.receiptPhone, //手机号
              userID: app.globalData.user_openid //用户ID
            }
          })
          .then(res => {
            console.log("添加收货地址成功", res);
            wx.hideLoading();
            wx.switchTab({
              url: '../Mine/Mine',
            })
          })
          .catch(err => {
            console.log("添加收货地址失败", err);
          })
      }
    }
  },


  //获取要修改地址的原信息
  getOrganReceiptInfo() {
    let that = this;
    console.log("修改地址ID", that.data.updateID);
    wx.cloud.database().collection('ShippingAddress')
      .where({
        _id: that.data.updateID,
        userID: app.globalData.user_openid
      })
      .get()
      .then(res => {
        console.log("要修改地址原信息获取成功", res.data[0]);
        that.setData({
          updateReceiptInfo: res.data[0],
          showChoiceAddress: res.data[0].ReceiptAddress, //地区
          receiptPeople: res.data[0].ReceiptName, //收货人
          receiptPhone: res.data[0].ReceiptPhone, //手机号
          receiptDetailAddress: res.data[0].ReceiptDetailAddress, //详细地址
        })
      })
      .catch(err => {
        console.log("要修改地址原信息获取失败", err);
      })
  }

})