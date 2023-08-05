// pages/NoticePage/NoticePage.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNoticeList:[],//信息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
    //获取官方信息
    that.getOfficalNotice();
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that=this;
      console.log("上拉触底");
      that.getOfficalNotice();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  //获取官方通知信息
  getOfficalNotice(){
    let that=this;
    console.log("当前showNoticeList长度",that.data.showNoticeList.length);
    let len=that.data.showNoticeList.length;
    
    wx.cloud.database().collection('Notice')
    .skip(len)
    .get()
    .then(res=>{
      console.log("官方通知信息获取成功",res.data);
      if(res.data.length<=0){
        wx.showToast({
          icon:'none',
          title: '没有更多数据',
        })
      }else{
        that.setData({
          showNoticeList:that.data.showNoticeList.concat(res.data)
        })
      }
    })
    .catch(err=>{
      console.log("官方通知信息获取失败",err);
    })

  }
})