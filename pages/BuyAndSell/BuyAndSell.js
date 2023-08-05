// pages/BuyAndSell/BuyAndSell.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choiceType: '', //跳转页类型
    orGetAll: true, //是否全部
    TabCur: 0,
    scrollLeft: 0,
    showTab: ['全部', '待付款', '待发货', '待收货'],
    showGoodInfo: [], //显示商品信息
    GoodsTransportState: '', //选择商品状态
    time:'',//当前时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("跳转类型", e.type);
    that.setData({
      choiceType: e.type
    })
    console.log("用户openID", app.globalData.user_openid);
    if (e.type == 0) {  //获取我发布的商品
      console.log("获取我发布的商品");
      that.setData({
        showTab: ['全部', '在卖', '已下架']
      })
      //获取 我发布的全部商品
      that.getMyPublishGood();
    } else if (e.type == 1) { //获取我卖出的商品
      console.log("获取我卖出的商品");
      that.setData({
        showTab:['全部', '待付款', '未发货', '未收货'],
      })
      that.getMySellGood();
    } else if (e.type == 2) { //获取我买到的商品
      console.log("获取我买到的商品");
      //获取 我买到的全部商品
      that.getMyBuyGood();
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
  onShow() {

  },

  //获取当前的时间

  times () {
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


  //判断滚动栏 获取商品信息 事件
  getYesGoodinfo(Tabindex) {
    let that = this;
    if (Tabindex == 0) { //获取全部
      that.setData({
        orGetAll: true,
        TabCur: Tabindex,
        scrollLeft: (Tabindex - 1) * 60
      })
    } else { //获取其他选项
      if (Tabindex == 1) { //待付款 & 在卖
        if (that.data.choiceType == 0) { //我发布的 + 在卖
          that.setData({
            orGetAll: false,
            GoodsTransportState: 0, //在卖 0
            TabCur: Tabindex,
            scrollLeft: (Tabindex - 1) * 60
          })
        } else { //我卖出 我买到 +待付款
          that.setData({
            orGetAll: false,
            GoodsTransportState: -1, //待付款
            TabCur: Tabindex,
            scrollLeft: (Tabindex - 1) * 60
          })
        }
      } else if (Tabindex == 2) { //待发货 &  已下架
        if (that.data.choiceType == 0) { //我发布的 + 已下架
          that.setData({
            orGetAll: false,
            GoodsTransportState: 1, //已下架 1
            TabCur: Tabindex,
            scrollLeft: (Tabindex - 1) * 60
          })
        } else { //我卖出的 我买到 +待发货
          that.setData({
            orGetAll: false,
            GoodsTransportState: 0, //待发货 0
            TabCur: Tabindex,
            scrollLeft: (Tabindex - 1) * 60
          })
        }
      } else if (Tabindex == 3) { //待收货  &------
        that.setData({
          orGetAll: false,
          GoodsTransportState: 1,
          TabCur: Tabindex,
          scrollLeft: (Tabindex - 1) * 60
        })
      }
    }
    return -999
  },

  //滚动栏事件
  tabSelect(e) {
    let that = this;
    that.setData({
      showGoodInfo: []
    })
    if (that.data.choiceType == 0) { //我发布的
      let success = that.getYesGoodinfo(e.currentTarget.dataset.id);
      if (success == -999) {
        //调用 获取 我发布的商品
        that.getMyPublishGood();
      }
    } else if (that.data.choiceType == 1) { //我卖出的
      let success = that.getYesGoodinfo(e.currentTarget.dataset.id);
      if (success == -999) {
        //调用 获取我卖出的商品
        that.getMySellGood();
      }
    } else if (that.data.choiceType == 2) { //我买到的
      let success = that.getYesGoodinfo(e.currentTarget.dataset.id);
      if (success == -999) {
        //调用 获取我买到的商品
        that.getMyBuyGood();
      }
    }
  },


  //获取我发布的商品
  getMyPublishGood() {
    let that = this;
    console.log("当前showGoodInfo数组长度", that.data.showGoodInfo.length);
    let len = that.data.showGoodInfo.length;
    wx.cloud.callFunction({
        name: "getDate",
        data: {
          num: "getMyPublishOldGoodInfo",
          orGetAll: that.data.orGetAll,
          businessID: app.globalData.user_openid,
          len: len,
          goodState: that.data.GoodsTransportState
        }
      })
      .then(res => {
        console.log("我发布的商品信息获取成功", res.result.list);
        that.setData({
          showGoodInfo: that.data.showGoodInfo.concat(res.result.list)
        })
      })
      .catch(err => {
        console.log("我发布的商品信息获取失败", err);
      })

  },


  //获取我卖出的商品
  getMySellGood() {
    let that = this;
    console.log("当前showGoodInfo数组长度", that.data.showGoodInfo.length);
    let len = that.data.showGoodInfo.length;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'getMySellOldGoodInfo',
          orGetAll: that.data.orGetAll,
          SellerID: app.globalData.user_openid,
          len: len,
          GoodsTransportState: that.data.GoodsTransportState
        }
      })
      .then(res => {
        console.log("我卖出的商品信息获取成功", res.result.list);
        that.setData({
          showGoodInfo: that.data.showGoodInfo.concat(res.result.list)
        })
      })
      .catch(err => {
        console.log("我卖出的商品信息获取失败", err);
      })
  },


  //获取我买到的商品
  getMyBuyGood() {
    let that = this;
    console.log("当前showGoodInfo数组长度", that.data.showGoodInfo.length);
    let len = that.data.showGoodInfo.length;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'getMyBuyOldGoodInfo',
          orGetAll: that.data.orGetAll,
          BuyersID: app.globalData.user_openid,
          len: len,
          GoodsTransportState: that.data.GoodsTransportState
        }
      })
      .then(res => {
        console.log("我买到的商品信息获取成功", res.result.list);
        that.setData({
          showGoodInfo: that.data.showGoodInfo.concat(res.result.list)
        })

      })
      .catch(err => {
        console.log("我买到的商品信息获取失败", err);
      })
  },


  // 计算时间差
  shijiancha: function (faultDate, completeTime) {
    var stime = Date.parse(new Date(faultDate));
    var etime = Date.parse(new Date(completeTime));
    var usedTime = etime - stime; //两个时间戳相差的毫秒数
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    var dayStr = days == 0 ? "" : days + "-";
    var hoursStr = hours == 0 ? "" : hours + "-";
    var time = dayStr + hoursStr + minutes;
    return time;
  },


  //去付款
  GoPay(e) {
    let that = this;
    //当前时间
    that.times();
    console.log("当前时间",that.data.time);
    console.log("跳转订单ID为", e.currentTarget.dataset.orderid);
    //获取跳转去付款页 的订单信息
    wx.cloud.database().collection('OldGoodsBuyState')
    .where({
      _id:e.currentTarget.dataset.orderid
    })
    .get()
    .then(res=>{
      console.log("跳转待付款页订单信息获取成功拍下时间",res.data[0].auctionTime);
      console.log("当前时间",that.data.time);
      let ShowTime = that.shijiancha(res.data[0].auctionTime, that.data.time);
      console.log("时间差", ShowTime);
      let arrs = ShowTime.split("-");
      console.log("切割字符串", arrs);
      console.log("长度", arrs.length);

      if (arrs.length == 3 && arrs[0] <= 0 && arrs[1] <= 0 && arrs[2] < 15) {
        console.log("进入支付页面");
        wx.redirectTo({
          url: '../oldGoodsWaitePay/oldGoodsWaitePay?OrderID='+e.currentTarget.dataset.orderid+'&LagTime='+arrs[2],
        })
      } else if (arrs.length == 2 && arrs[0] <= 0 && arrs[1] <= 15) {
        console.log("进入支付页面");
        wx.redirectTo({
          url: '../oldGoodsWaitePay/oldGoodsWaitePay?OrderID='+e.currentTarget.dataset.orderid+'&LagTime='+arrs[1],
        })
      } else if (arrs.length == 1 && arrs[0] <= 15) {
        console.log("进入支付页面");
        wx.redirectTo({
          url: '../oldGoodsWaitePay/oldGoodsWaitePay?OrderID='+e.currentTarget.dataset.orderid+'&LagTime='+arrs[0],
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: '订单已超时',
        })
        // 订单超时  删除订单
        that.cancelTimeOurOrder(e.currentTarget.dataset.orderid)
      }
    })
    .catch(err=>{
      console.log("跳转待付款页订单信息获取失败",err);
    })
  },



  //联系卖家
  contentBusser(e) {
    let that = this;
    console.log("卖家电话", e.currentTarget.dataset.busserphone);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.busserphone //仅为示例，并非真实的电话号
    })
  },


  //查看详细
  DetailOrder(e) {
    let that = this;
    console.log("跳转订单详细ID", e.currentTarget.dataset.orderid);
    wx.redirectTo({
      url: '../oldGoodSuccess/oldGoodSuccess?OrderID=' + e.currentTarget.dataset.orderid+'&goType='+that.data.choiceType
    })
  },

   

  //取消订单
  cancelTimeOurOrder(e){
      let that=this;
      console.log("e",e);
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          num:'deletTimeOutOldGoodOrderBooking',
          _id:e
        }
      })
      .then(res=>{
        console.log("超时订单取消成功",res);
        that.setData({
          showGoodInfo:[]
        })
        that.onReachBottom();
      })
      .catch(err=>{
        console.log("超时订单取消失败",err);
      })
  },

    //取消我买到的旧物置换订单
    cancelOldGoodOrder(e){
      let that=this;
      // console.log("e",e.currentTarget.dataset.orderid);
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          num:'deletOldGoodOrderBooking',
          _id:e.currentTarget.dataset.orderid,
          BuyersID:app.globalData.user_openid
        }
      })
      .then(res=>{
        console.log("订单取消成功",res);
        wx.showToast({
          icon:"success",
          title: '订单取消成功',
        })
        that.setData({
          showGoodInfo:[]
        })
        that.onReachBottom();
      })
      .catch(err=>{
        console.log("订单取消失败",err);
      })
    },

    //填写单号
    writeTrackingNumber(e){
      let that=this;
      console.log("填写快递单号",e.currentTarget.dataset.orderid);
      wx.redirectTo({
        url: '../AddTrackingNumber/AddTrackingNumber?orderID='+e.currentTarget.dataset.orderid,
      })
    },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    let that=this;
    console.log("下拉刷新");
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that=this;
    console.log("上拉触底");
    if(that.data.choiceType==0){ //我发布的
      that.getMyPublishGood();
    }else if(that.data.choiceType==1){ //我卖出的
      that.getMySellGood();
    }else if(that.data.choiceType==2){ //我买到的
      that.getMyBuyGood();
    }
  },
  
  //确认收货
  ConfirmReceipt(e){
      let that=this;
      console.log("确认收货",e.currentTarget.dataset.orderid);
      wx.cloud.database().collection('OldGoodsBuyState')
      .where({
          _id:e.currentTarget.dataset.orderid,//订单ID
          BuyersID:app.globalData.user_openid,//买家ID
      })
      .update({
        data:{
          GoodsTransportState:3,//确认收货状态 3
        }
      })
      .then(res=>{
        console.log("确认收货成功",res);
        wx.showToast({
          icon:'success',
          title: '确认收货成功',
        })
        setTimeout(function(){
          wx.switchTab({
            url: '../Mine/Mine',
          })
        },3000)

      })
      .catch(err=>{
        console.log("确认收货失败",err);
      })
  },

  //退款
  BackPrtice(e){
    let that=this;
    console.log("退款",e.currentTarget.dataset.orderid);
    wx.showModal({
      title: '提示',
      content: '您是否要将款项退回买家',
      complete: (res) => {
        if (res.cancel) {
            console.log("取消");
        }
        if (res.confirm) {
            console.log("确定");
            wx.cloud.database().collection('OldGoodsBuyState')
            .where({
              _id:e.currentTarget.dataset.orderid,
              SellerID:app.globalData.user_openid
            })
            .update({
              data:{
                BuyGoodsState:3,//已退款状态
                GoodsTransportState:4,//已退款
              }
            })
            .then(res=>{
              console.log("退款成功",res);
              wx.showToast({
                icon:"success",
                title: '退款成功',
              })
              setTimeout(function(){
                wx.switchTab({
                  url: '../Mine/Mine',
                })
              },3000)
            })
            .catch(err=>{
              console.log("退款失败",err);
            })

        }
      }
    })
  },

  //商品详情
  goGoodDetail(e){
    let that=this;
    console.log("商品详情",e.currentTarget.dataset.goodid);
    wx.redirectTo({
      url: '../OldObjectDetail/OldObjectDetail?oldgoodid='+e.currentTarget.dataset.goodid+'&Type='+2,
    })
  },

  //重新上架
  RrturnListing(e){
    let that=this;
    console.log("重新上架",e.currentTarget.dataset.goodid);
    wx.cloud.callFunction({
      name:'getDate',
      data:{
        num:"TakedownMyGoodInfo",
        _id:e.currentTarget.dataset.goodid,
        businessID:app.globalData.user_openid,
        goodState:0
      }
    })
    .then(res=>{
      console.log("重新上架成功",res);
      wx.showToast({
        icon:'success',
        title: '上架成功',
      })
      setTimeout(function(){
          wx.switchTab({
            url: '../Mine/Mine',
          })
      },2000)
    })
    .catch(err=>{
      console.log("重新上架失败",err);
    })
    
  }


})