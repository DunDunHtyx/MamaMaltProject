// pages/VaccineTable/VaccineTable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vaccinationTime:["出生当天","一月龄","1.5月龄","二月龄","三月龄","四月龄","五月龄","六月龄","七月龄","八月龄","九月龄","十二月龄","十八月龄","2周岁","3周岁","4周岁","6周岁"],
    Vaccine:[],//从后台获取到的疫苗信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     this.getVaccine();
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
  //获取疫苗表信息
  getVaccine(){
    let that=this;
    wx.cloud.callFunction({
      //云函数名称
      name:'getDate',
      data:{
        num:"vaccine"
      }
    })
    .then(res=>{
      console.log("调用云函数成功",res);
      that.setData({
        Vaccine:res.result.data
      })
      
    })
    .catch(err=>{
      console.log("调用云函数失败",err);
    })
  },
  goVaccineXQ(e){
      console.log("跳转疫苗ID",e.currentTarget.dataset.id);
      wx.navigateTo({
        url: '../VaccineTableXQ/VaccineTableXQ?_id='+e.currentTarget.dataset.id,
      })
  }
})