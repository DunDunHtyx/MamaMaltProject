// pages/OrEatXQ/OrEatXQ.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      _id:'',//能不能吃ID
      orEat:[],//能不能吃具体内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let that=this;
      console.log("传过来的参",options._id);
      that.setData({
        _id:options._id
      })
      that.getSpecificContent();
  },
  //获取能不能吃的具体内容
  getSpecificContent(){
      let that=this;
     wx.cloud.database().collection('notEat').where({
       _id:that.data._id
     })
     .get()
     .then(res=>{
        console.log("具体信息获取成功",res.data[0]);
        that.setData({
          orEat:res.data[0]
        })
     })
     .catch(err=>{
        console.log("具体信息获取失败",err);
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

  }
})