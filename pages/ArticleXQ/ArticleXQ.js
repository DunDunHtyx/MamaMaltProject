var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_id: '', //文章id
    article: [], //文章内容
    articleDetails: " ",
    orDianzan: false, //是否点赞
    orShoucang: false, //是否收藏
    dianzanNumber: 0, //点赞数
    shoucangNumber: 0, //收藏数
    dianzanID: '', //点赞id
    shoucang: '', //收藏id
    OrHidden: false, //是否打开遮罩层
    inputContent: '', //输入的内容
    time: '', //当前时间
    comments: '', //文章评论内容
    userID: '', //用户ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      article_id: options._id,
      userID: app.globalData.user_openid
    })
    //获取文章内容
    that.getArticle();
    //获取该篇文章 该 用户 是否点赞
    that.findOrDianzan();
    //获取 该篇文章 该 用户 是否收藏
    that.findOrShoucang();
    //获取当前时间
    that.time();
    //获取评论内容
    that.getCommends();
  },

  //获取文章内容
  getArticle() {
    let that = this;
    wx.cloud.database().collection('article')
      .where({
        _id: that.data.article_id
      })
      .get()
      .then(res => {
        console.log("获取文章具体信息成功", res.data[0]);
        that.setData({
          article: res.data[0],
          dianzanNumber: res.data[0].DianZanNumber,
          shoucangNumber: res.data[0].collectionNumber,
        })
      })
      .catch(err => {
        console.log("获取文章具体信息失败", err);
      })
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
  //点赞 事件
  goDianzan() {
    let that = this;
    if (that.data.orDianzan == true) { //已点赞 -->不点赞  取消点赞
      let num = that.data.articleDetails.DianZanNumber
      console.log("文章当前点赞数", that.data.article.DianZanNumber);
      that.setData({
        orDianzan: false,
        dianzanNumber: that.data.dianzanNumber - 1,
      })
      that.removeDianzan(); //取消点赞
    } else if (that.data.orDianzan == false) { //为点赞 -->点赞 添加点赞
      let num = that.data.articleDetails.DianZanNumber
      console.log("文章当前点赞数", that.data.article.DianZanNumber);
      that.setData({
        orDianzan: true,
        dianzanNumber: that.data.dianzanNumber + 1,
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
          articleID: that.data.article_id,
          userID: app.globalData.user_openid,
          type:0
        }
      })
      .then(res => {
        console.log("添加点赞成功", res);
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
          articleID: that.data.article_id,
          userID: app.globalData.user_openid,
          type:0
        }
      })
      .then(res => {
        console.log("取消点赞成功", res);
        that.updateArticle();
      })
      .catch(err => {
        console.log("取消点赞失败", err);
      })
  },

  //收藏 事件
  goShoucang() {
    let that = this;
    if (that.data.orShoucang == true) { //以收藏-->未收藏
      console.log("文章当前收藏量", that.data.shoucangNumber);
      that.setData({
        orShoucang: false,
        shoucangNumber: that.data.shoucangNumber - 1,
      })
      //取消收藏
      that.removeShouCang();
    } else if (that.data.orShoucang == false) { //未收藏-->已收藏
      console.log("文章当前收藏量", that.data.shoucangNumber);
      that.setData({
        orShoucang: true,
        shoucangNumber: that.data.shoucangNumber + 1,
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
          articleID: that.data.article_id,
          userID: app.globalData.user_openid,
          type:0
        }
      })
      .then(res => {
        console.log("添加收藏成功", res);
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
          articleID: that.data.article_id,
          userID: app.globalData.user_openid,
          type:0
        }
      })
      .then(res => {
        console.log("取消收藏成功", res);
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
        articleID: that.data.article_id, //文章id
        userID: app.globalData.user_openid, //用户id
        type:0
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

  //更新文章内容
  updateArticle() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "updateArticle",
          articleID: that.data.article_id,
          dianzanNumber: that.data.dianzanNumber,
          shoucangNumber: that.data.shoucangNumber
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
        articleID: that.data.article_id, //文章id
        userID: app.globalData.user_openid, //用户id
        type:0
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
  //获取输入的评论
  getInput(e) {
    let that = this;
    console.log("输入的评论内容", e.detail.value);
    that.setData({
      inputContent: e.detail.value
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
    that.getHistory();
  },

  //添加评论
  addComments() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "addCommend",
          articleID: that.data.article_id,
          content: that.data.inputContent,
          pubshTime: that.data.time,
          userID: app.globalData.user_openid,
          avater: app.globalData.userInfo.userImage,
          userName: app.globalData.userInfo.userName,
          type:0
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
          articleID: that.data.article_id,
          type:0
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
                type:0
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

  //添加历史记录
  getHistory() {
    let that = this;
    wx.cloud.database().collection('history')
      .where({
          articleID: that.data.article_id,
          time: that.data.time,
          userID: that.data.userID,
          type:0
      })
      .get()
      .then(res => {
        console.log("查找到相同历史记录", res.data);
        let s=res.data
        console.log("s",s);
        if (s.length==0) { //空 证明无相同条历史记录
          console.log("!");
          console.log("566");
          wx.cloud.callFunction({
            name: 'getDate',
            data: {
              num: "addHistory",
              articleID: that.data.article_id,
              time: that.data.time,
              userID: that.data.userID,
              type:0
            }
          })
          .then(res => {
            console.log("历史记录添加成功", res);
          })
          .catch(err => {
            console.log("历史记录添加失败", err);
          })
        } else { //不空 证明 有相同条历史记录
          console.log("111");
        }
      })
      .catch(err => {
        console.log("查找失败", err);
      })
  }

})