// pages/OldGoodsPay/OldGoodsPay.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldGoodsID: '', //商品ID
    oldGoodSInfo: '', //商品信息
    showQuality: ['未知', '全新', '九成新', '七成新', '六成新', '五成新'],
    totalPrtice: '', //总计
    defaultReceipt: '', //收货地址信息
    AddressID: '', //选择收货地址ID
    orChoice: false, //是否跳转选择了收货地址
    time:'',//当前时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("页面跳转后e", e);
    console.log("商品ID", e.oldGoodsID);
    console.log("收货地址ID", e.AddressID);
    if (e.AddressID == -999) {
      that.setData({
        oldGoodsID: e.oldGoodsID,
      })
      //获取商品信息
      that.getGoodInfo();
      //获取用户默认地址
      that.getDefaultAddressInfo();
    } else if (e.AddressID != -999) {
      that.setData({
        orChoice: true,
        oldGoodsID: e.oldGoodsID,
        AddressID: e.AddressID
      })
      //获取商品信息
      that.getGoodInfo();
      //获取确认的收货地址
      that.getYesReceiptAddress();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(e) {

  },

  //获取商品信息
  getGoodInfo() {
    let that = this;
    console.log("商品ID", that.data.oldGoodsID);
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'getDetailOldGoodInfo',
          Id: that.data.oldGoodsID
        }
      })
      .then(res => {
        console.log("商品具体信息获取成功", res.result.list[0]);
        that.setData({
          oldGoodSInfo: res.result.list[0],
          totalPrtice: res.result.list[0].goodPrtice + res.result.list[0].freight
        })
      })
      .catch(err => {
        console.log("商品具体信息获取失败", err);
      })
  },

  //获取默认收货地址信息
  getDefaultAddressInfo() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'GetOneDefaultReceiptAddress',
          userID: app.globalData.user_openid
        }
      })
      .then(res => {
        console.log("默认收货地址获取成功", res.result.list[0]);
        that.setData({
          defaultReceipt: res.result.list[0],
          AddressID:res.result.list[0].ReceiptID
        })
      })
      .catch(err => {
        console.log("默认收货地址获取失败", err);
      })
  },

  //获取确认的收货地址
  getYesReceiptAddress() {
    let that = this;
    wx.cloud.database().collection('ShippingAddress')
      .where({
        _id: that.data.AddressID,
        userID: app.globalData.user_openid
      })
      .get()
      .then(res => {
        console.log("获取确认的收货地址成功", res.data[0]);
        that.setData({
          defaultReceipt: res.data[0]
        })
      })
      .catch(err => {
        console.log("获取确认的收货地址失败", err);
      })
  },
  //跳转地址管理
  goAddressManagePage() {
    let that = this;
    wx.redirectTo({
      url: '../AddressManagePage/AddressManagePage?GoodID=' + that.data.oldGoodsID+'&type='+2,
    })
  },

  //获取当前的时间

  time: function (e) {
    let that = this;
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

  //确认购买
  yesPay() {
    let that = this;
    console.log("卖家ID",that.data.oldGoodSInfo.businessID);
    wx.showModal({
      title: '提示',
      content: '您是否要支付',
      complete: (res) => {
        if (res.cancel) {
          console.log("用户未支付成功");
          that.time();
          //生成 未支付成功订单 并跳转 未支付页
          wx.cloud.database().collection('OldGoodsBuyState')
          .add({
            data:{
              BuyGoodsState:0,  //未付款
              BuyersID:app.globalData.user_openid, //买家ID
              SellerID:that.data.oldGoodSInfo.businessID,//卖家ID
              oldGoodsID:that.data.oldGoodsID, //购买商品ID
              receiptAddressID:that.data.AddressID, //收货地址ID
              totalPrtice:that.data.totalPrtice, //总价
              GoodsTransportState:-1,//获取运输状态
              BuyTime:'',//付款事件
              shipmentsTime:'',//发货时间
              auctionTime:that.data.time, //订单拍下时间
              finallPrtice:0,//最终付款
              TrackingNumber:'暂无快递单号',//快递单号
              CourierCompanies:'暂无查询到快递公司',//快递公司
            }
          })
          .then(res=>{
            console.log("未支付订单生成成功",res._id); 
            wx.redirectTo({
              url:'../oldGoodsWaitePay/oldGoodsWaitePay?OrderID='+res._id+'&LagTime='+0,  
            })
          })
          .catch(err=>{
            console.log("未支付订单生成失败",err);
          })
        }
        if (res.confirm) {
          console.log("用户支付成功");
          //生成 支付成功订单 并跳转 订单详情页
          that.time();
          wx.cloud.database().collection('OldGoodsBuyState')
          .add({
            data:{
              BuyGoodsState:1, //付款成功 1 
              BuyersID:app.globalData.user_openid,  //买家ID
              SellerID: that.data.oldGoodSInfo.businessID, //卖家ID
              oldGoodsID:that.data.oldGoodsID, //购买商品ID
              receiptAddressID:that.data.AddressID, //收货地址ID
              totalPrtice:that.data.totalPrtice, //总价
              GoodsTransportState:0, //获取运输状态
              BuyTime:that.data.time,//付款事件
              shipmentsTime:'',//发货时间
              auctionTime:that.data.time, //订单拍下时间
              finallPrtice:that.data.totalPrtice,//最终付款
              TrackingNumber:'暂无快递单号',//快递单号
              CourierCompanies:'暂无查询到快递公司',//快递公司
            }
          })
          .then(res=>{
            console.log("支付成功订单生成成功",res._id);
            wx.showToast({
              icon:'success',
              title: '付款成功',
            })
          setTimeout(function(){
            wx.redirectTo({
              url: '../oldGoodSuccess/oldGoodSuccess?OrderID='+res._id,
            })
          },2000)
          })
          .catch(err=>{
            console.log("支付成功订单生成失败",err);
          })
        }
      }
    })
  }
})