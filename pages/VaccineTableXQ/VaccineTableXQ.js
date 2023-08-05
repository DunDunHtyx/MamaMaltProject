// pages/VaccineTableXQ/VaccineTableXQ.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:'',//跳转疫苗ID
    vaccine:[],//存放疫苗具体信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let that=this;
      console.log("要跳转疫苗信息id",options._id);
      that.setData({
        _id:options._id
      })      
      that.getSpecificInformation();
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
  //获取疫苗信息
  getSpecificInformation(){
      let that=this;
      wx.cloud.database().collection('vaccine')
      .where({
        _id:that.data._id
      })
      .get()
      .then(res=>{
        console.log("成功获取到该疫苗具体信息",res.data[0]);
        that.setData({
          vaccine:res.data[0]
        })
      })
      .catch(err=>{
        console.log("该疫苗具体信息获取失败",err);
      })
  }
})