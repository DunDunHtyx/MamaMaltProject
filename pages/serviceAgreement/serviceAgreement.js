// pages/serviceAgreement/serviceAgreement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverContet:'',//服务协议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
    that.getServerContent()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  //获取麦芽妈妈服务协议
  getServerContent(){
    let that=this;
    wx.cloud.database().collection('RiskNotice')
    .where({
        type:2
    })
    .get()
    .then(res=>{
      console.log("麦芽妈妈服务协议获取成功",res.data[0]);
      that.setData({
        serverContet:res.data[0].content
      })
    })
    .catch(err=>{
      console.log("麦芽妈妈服务协议获取失败",err);
    })
  },
})