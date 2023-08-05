var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      activityID:'',//活动ID
      activityInfor:[],//活动信息
      TicketInfor:[],//票价信息
      i:'',//展示 某场次的所有专属票档
      PassId:'',//通过 传值来 点击样式
      pickTicketInfor:[],//选中 场次 票档信息
      pickTickUnder:0,//选中票档的数组下标
      ticketNumber:1,//购买票数
      pickTotlaContent:[],//选中 场次的所有内容
      ticketTotalPrtice:0,//总票价
      showTicket:false,//是否显示票档信息
      showStepper:false,//是否显示步进器
      time:'',//购票时间
      userId:'',//用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    // console.log("用户id",app.globalData.user_openid);
    // console.log("官方活动ID",options.id);
    that.setData({
      activityID:options.id,
      userId:app.globalData.user_openid,
    })
    //获取活动信息
    that.getActivityInfor();
    //获取活动票价信息
    that.getTicketInfor();
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

  //根据 活动ID获取活动信息
  getActivityInfor(){
    let that=this;
    wx.cloud.database().collection('activity')
    .where({
      _id:that.data.activityID
    })
    .get()
    .then(res=>{
      // console.log("活动信息获取成功",res.data[0]);
      that.setData({
        activityInfor:res.data[0]
      })
    })
    .catch(err=>{
      console.log("活动信息获取失败",err);
    })
  },  
  //获取 该活动 票价信息
  getTicketInfor(){
    let that=this;
    wx.cloud.callFunction({
      name:'getDate',
      data:{
        num:"getTicketInfor",
        ID:that.data.activityID
      }
    })
    .then(res=>{
      // console.log("活动票价信息获取成功",res.result.data);
      that.setData({
        TicketInfor:res.result.data
      })
    })
    .catch(err=>{
      console.log("活动票价信息获取失败",err);
    })
  },
  //某场次 某票档售空 即不显示
  hideTicket(){

  },
  //获取点击 场次 id
  getTicketTime(e){
    let that=this;
    that.setData({
      PassId:e.currentTarget.dataset.id
    })
    that.getPickMatchTicket();
  },
  //获取选中 场次 的票档信息
  getPickMatchTicket(){
    let that=this;
    that.setData({
      ticketTotalPrtice:0,
      pickTickUnder:0,
      showTicket:true,
      showStepper:true
    })
    wx.cloud.database().collection('ticketInformation')
    .where({
      _id:that.data.PassId
    })
    .get()
    .then(res=>{
        // console.log("点中场次票信息",res.data[0]);
        that.setData({
          pickTicketInfor:res.data[0].ticketType,
          pickTotlaContent:res.data[0],
          ticketTotalPrtice:res.data[0].ticketType[0].ticketPrice
        })
        console.log("票档信息为",that.data.pickTicketInfor);
    })
    .catch(err=>{
        console.log("获取选中场次的票档信息失败",err);
    })
  },
  //获取 选中 票档的数组下标
  getTicketItem(e){
    let that=this;
    console.log("选中票档的数组下标",e.currentTarget.dataset.i);
    that.setData({
      pickTickUnder:e.currentTarget.dataset.i,
      ticketTotalPrtice:that.data.pickTicketInfor[e.currentTarget.dataset.i].ticketPrice
    })
  },
   //步进器 时间
   onChange(event) {
     let that=this;
    console.log("预定张数",event.detail);
    that.setData({
      ticketNumber:event.detail
    })
    console.log("选中场次信息",that.data.pickTotlaContent.ticketTime);
    console.log("选中票档数组下标",that.data.pickTickUnder);
    console.log("选中票档的信息",that.data.pickTotlaContent.ticketType[that.data.pickTickUnder]);
    console.log("选中票档的价格",that.data.pickTotlaContent.ticketType[that.data.pickTickUnder].ticketPrice);
    console.log("购买票数",that.data.ticketNumber);
    let totalPritice;
    totalPritice=that.data.pickTotlaContent.ticketType[that.data.pickTickUnder].ticketPrice*that.data.ticketNumber;
    console.log("票价为",totalPritice);
    that.setData({
      ticketTotalPrtice:totalPritice
    })
  },

  // 点击确定
  yes(){
    let that=this;
    if(that.data.showTicket==false&&that.data.showStepper==false){
        wx.showToast({
          icon:'error',
          title: '无法确定购票'
        })
    }else if(that.data.showTicket==true&&that.data.showStepper==true){
      that.time()
      console.log("选择的活动",that.data.activityID);
      console.log("选择的场次",that.data.PassId);
      console.log("选择的票档",that.data.pickTickUnder);
      console.log("购买票数",that.data.ticketNumber);
      console.log("价格",that.data.ticketTotalPrtice);
      console.log("购票时间",that.data.time);

      wx.cloud.database().collection('booking')
      .add({
        data:{
          BookUserId:that.data.userId,//预定账号 id
          realAttendID:'',//实名参加人信息 ID
          ContactName:'',//联系人姓名
          ContactPhone:'',//联系电话
          activityID:that.data.activityID,//预定活动id
          bookTime:that.data.time,//预定时间
          finallPay:'',//最终付款金额
          matchesID:that.data.PassId,//场次id
          orPayState:0,//订单状态
          orVerification:false,//是否核销
          pickTicketUnder:that.data.pickTickUnder,//票档的数组下标
          ticketNumber:that.data.ticketNumber,//预约票数
          ticketTotalPrtice:that.data.ticketTotalPrtice,//总价格
          varificationCode:'',//核销码
        }
      })
      .then(res=>{
          console.log("订单预约信息添加成功",res._id);
          wx.redirectTo({
            url: '../PaySucceed/PaySucceed?bookId='+res._id,
          })
      })
      .catch(err=>{
          console.log("订单预约信息添加失败",err);
      })
    }  
  },
  //获取当前的时间
  time: function (e) {
    let that=this;
    //获取时间：年月日
    let dataTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    let hour = new Date().getHours()
    let minute = new Date().getMinutes()
    dataTime = `${yy}.${mm}.${dd} ${hour}:${minute}`;
    that.setData({
      time: dataTime
    })
  },
})