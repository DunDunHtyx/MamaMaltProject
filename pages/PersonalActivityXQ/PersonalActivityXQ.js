Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityID: '', //个人活动ID
    DetailActivity: [], //个人活动详细信息
    publisher:'',//发布者用户信息
    RiskNotice:'',//
    OrHidden:false,//遮罩层状态
    OrCancleRiskNotice:false,//风险告知书 状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    console.log("跳转详情页活动ID", e.activityID);
    that.setData({
      activityID: e.activityID
    })
    that.getDetailActivity();
    that.getPublishPeople();
    //获取风险告知书内容
    that.getRiskNotice();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取活动风险告知书 内容
  getRiskNotice(){
    let that=this;
    wx.cloud.database().collection('RiskNotice')
    .where({
      name:"个人活动提示语"
    })
    .get()
    .then(res=>{
      // console.log("风险告知书内容获取成功",res.data[0]);
      that.setData({
        RiskNotice:res.data[0]
      })
    })
    .catch(err=>{
      console.log("风险告知书内容获取失败",err);
    })
  },
  //获取活动发布者信息
  getPublishPeople(){
    let that=this;
    wx.cloud.database().collection('user')
    .where({
      _openid:that.data.DetailActivity.userInforID
    })
    .get()
    .then(res=>{
      console.log("发布者信息获取成功",res.data[0]);
      that.setData({
        publisher:res.data[0]
      })
      // console.log("data中发布者信息",that.data.publisher);
    })
    .catch(err=>{ 
      console.log("发布者信息获取失败",err);
    })
  },
  //活动详细内容
  getDetailActivity() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "getActivityDetail",
          id: that.data.activityID
        }
      })
      .then(res => {
        console.log("活动详细内容获取成功", res.result.data[0]);
        that.setData({
          DetailActivity: res.result.data[0]
        })
      })
      .catch(err => {
        console.log("活动详细内容获取失败", err);
      })
  },
  //关闭遮罩层
  conceal() {
    let that = this;
    that.setData({
      OrHidden: false
    })
  }, 
  //打开风险告知书
  openRiskNotice(){
    let that=this;
    that.setData({
      OrCancleRiskNotice:true,
      OrHidden:true,//遮罩层状态
    })
  },
  //关闭风险告知书
  cancle(){
    let that=this;
    that.setData({
      OrHidden:false,//关闭 遮罩层
      OrCancleRiskNotice:false,//关闭 风险告知书 
    })
  }, 
   //跳转拨号
  goCall() {
    let that=this;
    that.cancle();
    console.log("发布者信息",that.data.publisher);
    wx.makePhoneCall({
      phoneNumber:that.data.publisher.truePhone //仅为示例，并非真实的电话号码
    })
  },
  
})