// pages/setup/setup.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  //跳转 隐私政策
  goPrivacyPolicy(){
      wx.navigateTo({
        url: '../privacyAgreement/privacyAgreement',
      })
  },
  goServer(){
    wx.navigateTo({
      url: '../serviceAgreement/serviceAgreement',
    })
  },
  //跳转 注销账号
  goCancelAcount(){
    wx.showModal({
      title: '提示',
      content: '你确定要注销账号吗?请慎重',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          console.log('用户点击确定')
          wx.showToast({
            icon:'error',
            title: '您有相关联数据',
          })
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },
  //跳转 退出账号
  goSignOut(){
    wx.showModal({
      title: '提示',
      content: '您确定要退出账号吗?',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          console.log('用户点击确定')
          app.globalData={}
          wx.showToast({
            title: '账号退出',
            icon:'success'
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../guide/guide',
            })
          },2000)
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  }
 
})