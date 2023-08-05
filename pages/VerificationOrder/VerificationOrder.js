import QR from '../../utils/qrcode.js' // es6的方式引入qrcode.js工具类
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID:'',//订单ID
    orderInformation:'',//订单信息
    orderMatches:'',//预定场次信息
    orderTickets:'',//预定票种信息
    activityInformation:'',//活动信息
    activityPublicInfor:'',//发布活动信息
    showCanvas:true,//是否显示画板
    qrCodeUrl:'',//二维码路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that=this;
      console.log("订单ID",options.orderId);
      that.setData({
        orderID:options.orderId
      })
      //获取订单信息
      that.getOrderInformation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      let that=this;
      that.getOrderInformation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    that.getOrderInformation();
  },

  //获取订单信息
  getOrderInformation(){
    let that=this;
    wx.cloud.database().collection('booking')
    .where({
      _id:that.data.orderID
    })
    .get()
    .then(res=>{
      console.log("订单信息获取成功",res.data[0]);
      that.setData({
        orderInformation:res.data[0]
      })
      //动态生成二维码
      that.createQrCode(res.data[0]._id, 250, 250)   
      //获取预定 场次 和 票档信息
      that.getMatches();
      //获取 预定 活动信息
      that.getActivity();
    })
    .catch(err=>{
      console.log("订单信息获取失败",err);
    })
  },


  //获取 该活动信息
  getActivity(){
    let that=this;
    wx.cloud.database().collection('activity')
    .where({
      _id:that.data.orderInformation.activityID
    })
    .get()
    .then(res=>{
      console.log("活动信息获取成功",res.data[0]);
      that.setData({
        activityInformation:res.data[0]
      })
      that.getActivityPublicInfor();
    })
    .catch(err=>{
      console.log("活动信息获取失败",err);
    })
  },
  //获取预定场次信息
  getMatches(){
    let that=this;
    wx.cloud.database().collection('ticketInformation')
    .where({
      _id:that.data.orderInformation.matchesID
    })
    .get()
    .then(res=>{
      console.log("预定场次信息获取成功",res.data[0]);
      //获取 预定的票档
      console.log("预定的票档信息",res.data[0].ticketType[that.data.orderInformation.pickTicketUnder]);
      that.setData({
        orderMatches:res.data[0],//预定场次信息
        orderTickets:res.data[0].ticketType[that.data.orderInformation.pickTicketUnder],//预定票种信息
      })
    
    })
    .catch(err=>{ 
      console.log("预定场次信息获取失败",err);
    })
  },

  //获取活动发布者信息
  getActivityPublicInfor(){
    let that=this;
    console.log("活动信息",that.data.activityInformation);
    return 
    wx.cloud.database().collection('user')
    .where({
 
    })
    .get()
    .then(res=>{
      console.log("活动发布者信息获取成功",res);
    })
    .catch(err=>{
      console.log("活动发布者信息获取失败",err);
    })
  },  
  //生成二维码
  createQrCode: function (content, cavW, cavH) {
    let that = this;
    let canvasId = 'verificationCode'
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(content, canvasId, cavW, cavH);
    //获取二维码路径
    that.canvasToTempImage(canvasId);
  },

  //获取临时缓存图片路径，存入data中
  canvasToTempImage: function (canvasId) {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId, // 这里canvasId即之前创建的canvas-id
      success: function (res) {
        console.log("二维码路径", res.tempFilePath);
        let tempFilePath = res.tempFilePath;
        that.setData({
          qrCodeUrl: tempFilePath,
        });
      },
      fail: function (res) {
        console.log("二维码生成失败", res);
      }
    });
  },

})