var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldGoodsID: '', //商品ID
    oldGoodSInfo: '', //商品信息
    showQuality: ['未知', '全新', '九成新', '七成新', '六成新', '五成新'],
    showType: ['婴儿玩具', '儿童玩具', '童装童鞋', '图书', '孕妇用品', '家居百货'],
    userWidth: '', //可用用宽度
    orShoucang: false, //是否收藏
    GoPageType:0,//跳转页面类型  0:买家界面 1:卖家页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    // console.log("e",e.oldgoodid);
    console.log("e",e.Type);
    that.setData({
      oldGoodsID: e.oldgoodid,
      GoPageType:e.Type,
      userWidth: app.globalData.deviceInfo.windowWidth
    })
    //获取商品信息
    that.getOldGoodsInfo();
    //获取 是否用户收藏了该商品
    that.findOrShoucang();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取商品信息
  getOldGoodsInfo() {
    let that = this;
    console.log("ID", that.data.oldGoodsID);
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
          oldGoodSInfo: res.result.list[0]
        })
      })
      .catch(err => {
        console.log("商品具体信息获取失败", err);
      })
  },

  // 联系商家
  CallBusiness() {
    let that = this;
    console.log("商家电话", that.data.oldGoodSInfo.truePhone);
    wx.makePhoneCall({
      phoneNumber: that.data.oldGoodSInfo.truePhone //仅为示例，并非真实的电话号码
    })
  },

  //查询 该用户 是否收藏了 该商品
  findOrShoucang() {
    let that = this;
    let db = wx.cloud.database();
    db.collection('ShouCang').where({
        articleID: that.data.oldGoodsID, //商品id
        userID: app.globalData.user_openid, //用户id
        type: 2
      })
      .get()
      .then(res => {
        console.log("获取文章是否收藏成功", res);
        if (!res.data[0]) { //未收藏
          that.setData({
            orShoucang: false
          })
        } else { // 已收藏
          that.setData({
            orShoucang: true
          })
        }
      })
      .catch(err => {
        console.log("获取文章是否收藏失败", err);
      })
  },
  //收藏 事件
  goShoucang() {
    let that = this;
    if (that.data.orShoucang == true) { //以收藏-->未收藏
      that.setData({
        orShoucang: false,
      })
      //取消收藏
      that.removeShouCang();
    } else if (that.data.orShoucang == false) { //未收藏-->已收藏
      that.setData({
        orShoucang: true,
      })
      //添加收藏
      that.addShouCang();
    }
  },

  //添加 收藏
  addShouCang() {
    let that = this;
    console.log("添加收藏");
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "addShoucang",
          articleID: that.data.oldGoodsID,
          userID: app.globalData.user_openid,
          type: 2
        }
      })
      .then(res => {
        console.log("添加收藏成功", res);
      })
      .catch(err => {
        console.log("添加收藏失败", err);
      })

  },
  //取消 收藏
  removeShouCang() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "removeShoucang",
          articleID: that.data.oldGoodsID,
          userID: app.globalData.user_openid,
          type: 2
        }
      })
      .then(res => {
        console.log("取消收藏成功", res);
      })
      .catch(err => {
        console.log("取消收藏失败", err);
      })
  },

  //购买
  WantBuy(){
    let that=this;
    wx.showModal({
      title: '提示',
      content: '您提前跟商家沟通了吗?',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../OldGoodsPay/OldGoodsPay?oldGoodsID='+that.data.oldGoodsID+'&AddressID=-999',
          })
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },


  // 编辑
  editGoodInfo(e){
    let that=this;
    // console.log("编辑商品内容",e);
    console.log("需编辑的商品信息",that.data.oldGoodsID);
    wx.redirectTo({
      url: '../addOldGood/addOldGood?oldGoodsID='+that.data.oldGoodsID+"&PageType="+2,
    })
  },
  // 下架 
  TakedownGood(e){
    let that=this;
    // console.log("下架商品内容",e);
    wx.showModal({
      title: '提示',
      content: '您确定要下架该商品吗?',
      complete: (res) => {
        if (res.cancel) {
            console.log("取消");
        }
    
        if (res.confirm) {
            console.log("确定");
            if(app.globalData.user_openid==that.data.oldGoodSInfo.businessID){
              console.log("需下架商品信息",that.data.oldGoodsID);
              console.log("当前用户ID",app.globalData.user_openid);    
              wx.cloud.callFunction({
                name:"getDate",
                data:{
                  num:"TakedownMyGoodInfo",
                  _id:that.data.oldGoodsID,
                  businessID:app.globalData.user_openid,
                  goodState:1
                }
              })
              .then(res=>{
                console.log("商品下架信息更新成功",res);
                wx.showToast({
                  icon:'success',
                  title: '下架成功',
                })
  
                setTimeout(function(){
                  wx.switchTab({
                    url: '../Mine/Mine',
                  })
                },2000)
              })
              .catch(err=>{
                console.log("商品下架信息更细失败",err);
              })



            }else{
                wx.showToast({
                  icon:'error',
                  title: '您无权下架',
                })
            }
        }
      }
    })
  }


})