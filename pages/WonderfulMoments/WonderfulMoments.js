var pages=0 //判断是第几页
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents:'<div>Hello World!</div>',
    showWonder:[],//前端展示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
      console.log("onload进入精彩瞬间");
      // wx.startPullDownRefresh();
      pages=0;
      that.getWonderContent();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      console.log("初次页面渲染");
  },  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      console.log("监听页面显示");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      console.log("下拉刷新");
      let that=this;
      that.getWonderContent();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this;
    console.log("上拉触底了");
    Page++;
    that.getWonderContent();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  // 获取精彩瞬间
  getWonderContent(){
    let that=this;
    wx.showLoading({
      title: '加载中',
    })
    console.log("当前showWonder的数组长度",that.data.showWonder.length);
    let len=that.data.showWonder.length;
      wx.cloud.database().collection('WonderfulMoments')
      .skip(len) //从第几条开始读
      .get()
      .then(res=>{
        console.log("精彩瞬间请求成功",res.data);
        wx.stopPullDownRefresh();
        wx.hideLoading()
        let dataList=res.data
        if(dataList.length<=0){
          wx.showToast({
            icon:'error',
            title: '没有更多数据',
          })
        }else{
          that.setData({
            showWonder:that.data.showWonder.concat(res.data)
          })
        }
      })
      .catch(err=>{
        console.log("精彩瞬间请求失败",err);
      })

  },
  // 跳转某活动详情页
  getActID(e){
    console.log("获取点击的活动ID",e.currentTarget.dataset.actid);
    wx.navigateTo({
      url: '../OfficialActivityXQ/OfficialActivityXQ?activityID='+e.currentTarget.dataset.actid,
    })
  } ,
  // 跳转某美好瞬间详情页
  getWonderXQ(e){
    console.log("获取点击精彩瞬间ID",e.currentTarget.dataset.wonderid);
    wx.navigateTo({
      url: '../WonderXQ/WonderXQ?wonderID='+e.currentTarget.dataset.wonderid,
    })
  },
  // 跳转 发布精彩瞬间页
  GoPublishWonder(){
    wx.redirectTo({
      url: '../PublishWonder/PublishWonder?realationID=-999'+'&type='+1,
    })
  }

})