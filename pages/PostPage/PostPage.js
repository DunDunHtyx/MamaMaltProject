var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showWonder: [], //显示精彩瞬间信息
    userID: '', //用户ID

    //-------------
    DeleateImage_success_size:0,
    imageList:[],//获取待删除帖子照片
    deleateID:'',//待删除帖子ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userID: app.globalData.user_openid
    })
    //获取精彩瞬间内容
    that.getWonderfulMomentsInfo();
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    console.log("上拉触底");
    that.getWonderfulMomentsInfo();
  },


  //获取精彩瞬间内容
  getWonderfulMomentsInfo() {
    let that = this;
    console.log("showWonder长度", that.data.showWonder.length);
    let len = that.data.showWonder.length;
    wx.cloud.database().collection('WonderfulMoments')
      .where({
        PublicerID: app.globalData.user_openid
      })
      .skip(len)
      .get()
      .then(res => {
        console.log("精彩瞬间内容获取成功", res.data);
        if (res.data.length <= 0) {
          wx.showToast({
            icon: 'none',
            title: '没有更多数据',
          })
        } else {
          that.setData({
            showWonder: that.data.showWonder.concat(res.data)
          })
          console.log("showWonder", that.data.showWonder);
        }
      })
      .catch(err => {
        console.log("精彩瞬间内容获取失败", err);
      })
  },


 //删除云存储中的照片
 DeleteCloudPhone(index) {
  let that = this;
  console.log("删除长度", that.data.imageList.length);
  wx.cloud.deleteFile({
    fileList: [that.data.imageList[index]],
    success: res => {
      console.log(res)
      console.log("照片删除成功");
      that.setData({
        DeleateImage_success_size: that.data.DeleateImage_success_size + 1
      })
      if (that.data.DeleateImage_success_size == that.data.imageList.length) {
        //删除帖子的其他信息 
        that.deleatePostOnrInfo();
      } else {
        that.DeleteCloudPhone(index + 1)
      }
    },
    fail: err => {
      console.log("删除失败");
    }
  })
},

  //删除某篇帖子
  DeletePost(e) {
    let that = this;
    console.log("删除帖子ID", e.currentTarget.dataset.postid);
    wx.showModal({
      title: '提示',
      content: '您真的要删除吗?',
      complete: (res) => {
        if (res.cancel) {
          console.log("取消");
        }

        if (res.confirm) {
          console.log("确定");
          wx.showLoading({
            title: '删除中',
          })
          //获取删除帖子信息
          wx.cloud.database().collection('WonderfulMoments')
            .where({
              _id: e.currentTarget.dataset.postid,
              PublicerID: app.globalData.user_openid
            })
            .get()
            .then(res => {
              console.log("帖子信息获取成功", res.data[0].Images);
              that.setData({
                deleateID:e.currentTarget.dataset.postid, //要删除帖子ID
                imageList:res.data[0].Images ,//要删除帖子照片
              })
              //删除云存储中的照片
              that.DeleteCloudPhone(0);
            })
            .catch(err => {
              console.log("帖子信息获取失败", err);
            })
        }
      }
    })
  },

  //删除帖子信息
  deleatePostOnrInfo() {
    let that = this;
    wx.cloud.callFunction({
        name: "getDate",
        data: {
          num: "deletMYPost",
          _id: that.data.deleateID,
          PublicerID: app.globalData.user_openid
        }
      })
      .then(res => {
        console.log("删除成功", res);
        wx.hideLoading();
        wx.showToast({
          icon: "success",
          title: '删除成功',
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../Mine/Mine',
          })
        }, 2000)
      })
      .catch(err => {
        console.log("删除失败", err);
      })
  },

  //跳转帖子详情页
  goDetailPost(e) {
    let that = this;
    console.log("跳转帖子ID", e.currentTarget.dataset.postid);
    wx.navigateTo({
      url: '../WonderXQ/WonderXQ?wonderID=' + e.currentTarget.dataset.postid,
    })
  },

  //跳转活动详情页
  goDetailActivity(e) {
    let that = this;
    console.log("跳转活动详情ID", e.currentTarget.dataset.activityid);
    wx.navigateTo({
      url: '../OfficialActivityXQ/OfficialActivityXQ?activityID=' + e.currentTarget.dataset.activityid,
    })
  },

  //编辑精彩瞬间
  editWonderFunlAggreement(e) {
    let that = this;
    console.log("跳转编辑", e.currentTarget.dataset.postid);
    console.log("跳转精彩瞬间");
    wx.redirectTo({
      url: '../PublishWonder/PublishWonder?wonderID=' + e.currentTarget.dataset.postid + "&type=" + 3,
    })
  },
})