// pages/WonderXQ/WonderXQ.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    WonderID: '', //精彩瞬间ID
    showWonderXQ: '', //精彩瞬间内容
    activityDetail: '', //活动详细内容
    OrHidden: false, //是否打开遮罩层
    dianzan: 0, //点赞数
    shouchang: 0, //收藏数
    orDianzan: false, //是否点赞
    orShoucang: false, //是否收藏
    inputComment: '', //输入的评论内容
    time: '', //当前时间
    comments: '', //文章的评论内容
    userID: '', //用户ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("跳转的参数", e.wonderID);
    that.setData({
      WonderID: e.wonderID,
      userID: app.globalData.user_openid
    })
    // 获取精彩瞬间内容
    that.getWonderXQ();
    //获取本精彩瞬间评论内容
    that.getCommends();
    // 获取 该篇精彩瞬间 该用户 是否点赞
    that.findOrDianzan();
    // 获取 该篇精彩瞬间 该用户 是否收藏
    that.findOrShoucang();   
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  // 获取某精彩瞬间详细内容
  getWonderXQ() {
    let that = this;
    wx.cloud.database().collection('WonderfulMoments')
      .where({
        _id: that.data.WonderID
      })
      .get()
      .then(res => {
        console.log("精彩瞬间内容获取成功", res.data[0]);
        that.setData({
          showWonderXQ: res.data[0],
          dianzan: res.data[0].dianzan, //点赞数
          shouchang: res.data[0].shoucang, //收藏数
        })
        //获取活动具体信息
        that.getActivityDetail()
      })
      .catch(err => {
        console.log("精彩瞬间内容获取失败", err);
      })
  },
  // 获取宣传活动的详细信息
  getActivityDetail() {
    let that = this;
    console.log("活动ID", that.data.showWonderXQ.RelationalActivityID);
    wx.cloud.database().collection('activity')
      .where({
        _id: that.data.showWonderXQ.RelationalActivityID
      })
      .get()
      .then(res => {
        console.log("活动具体信息获取成功", res.data[0]);
        that.setData({
          activityDetail: res.data[0]
        })
      })
      .catch(err => {
        console.log("活动具体信息获取失败", err);
      })
  },
  //进空间
  goRoom(e) {
    console.log("跳转发布者空间", e.currentTarget.dataset.publicer);
    wx.navigateTo({
      url: "../userRoom/userRoom?userID=" + e.currentTarget.dataset.publicer,
    })
  },
  //瞅瞅
  goActivity() {
    let that = this;
    console.log("跳转活动ID", that.data.showWonderXQ.RelationalActivityID);
    wx.navigateTo({
      url: '../OfficialActivityXQ/OfficialActivityXQ?activityID=' + that.data.showWonderXQ.RelationalActivityID,
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
    dataTime = `${yy}-${mm}-${dd}`;
    that.setData({
      time: dataTime
    })
    // that.getHistory();
  },

  //滚动到评论位置
  toViewBottomFun: function () {
    // 设置屏幕自动滚动到最后一条消息处
    let that = this;
    wx.createSelectorQuery().select('#commendTitles').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.top,
        duration: 0 // 滑动速度
      })
      that.setData({
        scrollTop: rect.height - that.data.scrollTop
      });
    }).exec();
  },

  //获取输入评论内容
  getInput(e) {
    let that = this;
    console.log("输入的内容", e.detail.value);
    that.setData({
      inputComment: e.detail.value
    })
  },

  //添加评论
  addComments() {
    let that = this;
    //获取当前时间
    that.time();
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "addCommend",
          articleID: that.data.WonderID,
          content: that.data.inputComment,
          pubshTime: that.data.time,
          userID: app.globalData.user_openid,
          avater: app.globalData.userInfo.userImage,
          userName: app.globalData.userInfo.userName,
          type: 1
        }
      })
      .then(res => {
        console.log("添加评论成功", res);
        that.setData({
          OrHidden: false
        })
        that.getCommends();
      })
      .catch(err => {
        console.log("添加评论失败", err);
      })

  },

  //获取该篇文章 评论内容
  getCommends() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "getCommend",
          articleID: that.data.WonderID,
          type: 1
        }
      })
      .then(res => {
        console.log("获取评论内容成功", res.result.data);
        that.setData({
          comments: res.result.data
        })
      })
      .catch(err => {
        console.log("获取评论内容失败", err);
      })

  },
  //删除评论
  remove(e) {
    let that = this;
    console.log("待删除评论id", e.currentTarget.dataset.id);
    wx.showModal({
      title: '提示',
      content: '真的要删除评论吗？',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          wx.cloud.callFunction({
              name: 'getDate',
              data: {
                num: "removeCommend",
                id: e.currentTarget.dataset.id,
                type: 1
              }
            })
            .then(res => {
              console.log("评论删除成功", res);
              that.getCommends();
            })
            .catch(err => {
              console.log("评论删除失败", err);
            })
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },



  //关闭遮罩层
  conceal() {
    let that = this;
    that.setData({
      OrHidden: false
    })
  },
  //打开遮罩层
  show() {
    let that = this;
    that.setData({
      OrHidden: true
    })
  },

  //点赞
  goDianzan() {
    let that = this;
    if (that.data.orDianzan == true) { //已点赞 -->不点赞  取消点赞
      let num = that.data.showWonderXQ.dianzan
      console.log("文章当前点赞数", that.data.showWonderXQ.dianzan);
      that.setData({
        orDianzan: false,
        dianzan: that.data.dianzan - 1,
      })
      that.removeDianzan(); //取消点赞
    } else if (that.data.orDianzan == false) { //为点赞 -->点赞 添加点赞
      let num = that.data.showWonderXQ.dianzan
      console.log("文章当前点赞数", that.data.showWonderXQ.dianzan);
      that.setData({
        orDianzan: true,
        dianzan: that.data.dianzan + 1,
      })
      that.addDianzan(); //添加 点赞
    }
  },

  //添加点赞事件
  addDianzan() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "addDianzan",
          articleID: that.data.WonderID,
          userID: app.globalData.user_openid,
          type: 1
        }
      })
      .then(res => {
        console.log("添加点赞成功", res);
        // 更新精彩瞬间点赞数
        that.updateArticle();
      })
      .catch(err => {
        console.log("添加点赞失败", err);
      })
  },
  //取消点赞事件
  removeDianzan() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "removeDainzan",
          articleID: that.data.WonderID,
          userID: app.globalData.user_openid,
          type: 1
        }
      })
      .then(res => {
        console.log("取消点赞成功", res);
        // 更新 精彩瞬间 点赞数量
        that.updateArticle();
      })
      .catch(err => {
        console.log("取消点赞失败", err);
      })
  },




  //收藏
  goShoucang() {
    let that = this;
    if (that.data.orShoucang == true) { //以收藏-->未收藏
      console.log("文章当前收藏量", that.data.shouchang);
      that.setData({
        orShoucang: false,
        shouchang: that.data.shouchang - 1,
      })
      //取消收藏
      that.removeShouCang();
    } else if (that.data.orShoucang == false) { //未收藏-->已收藏
      console.log("文章当前收藏量", that.data.shouchang);
      that.setData({
        orShoucang: true,
        shouchang: that.data.shouchang + 1,
      })
      //添加收藏
      that.addShouCang();
    }
  },

  //添加 收藏
  addShouCang() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "addShoucang",
          articleID: that.data.WonderID,
          userID: app.globalData.user_openid,
          type: 1
        }
      })
      .then(res => {
        console.log("添加收藏成功", res);
        // 更新 精彩瞬间 收藏数量
        that.updateArticle();
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
          articleID: that.data.WonderID,
          userID: app.globalData.user_openid,
          type: 1
        }
      })
      .then(res => {
        console.log("取消收藏成功", res);
        // 更新 精彩瞬间 收藏数量
        that.updateArticle();
      })
      .catch(err => {
        console.log("取消收藏失败", err);
      })
  },


  //查询 本篇文章是否点赞
  findOrDianzan() {
    let that = this;
    let db = wx.cloud.database()
    db.collection('DianZan')
      .where({
        articleID: that.data.WonderID, //文章id
        userID: app.globalData.user_openid, //用户id
        type:1
      })
      .get()
      .then(res => {
        console.log("是否点赞查询成功", res);
        if (!res.data[0]) { // 未点赞
          that.setData({
            orDianzan: false,
          })
        } else { //查询到
          that.setData({ // 已点赞
            orDianzan: true
          })
        }
      })
      .catch(err => {
        console.log("是否点赞查询失败", err);
      })
  },

  //更新精彩瞬间内容
  updateArticle() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "updateWonder",
          articleID: that.data.WonderID,
          dianzanNumber: that.data.dianzan,
          shoucangNumber: that.data.shouchang
        }
      })
      .then(res => {
        console.log("文章更新成功");
      })
      .catch(err => {
        console.log("文章更新失败");
      })
  },
  //查询 本篇文章 是否收藏
  findOrShoucang() {
    let that = this;
    let db = wx.cloud.database();
    db.collection('ShouCang').where({
        articleID: that.data.WonderID, //精彩瞬间id
        userID: app.globalData.user_openid, //用户id
        type:1
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


})