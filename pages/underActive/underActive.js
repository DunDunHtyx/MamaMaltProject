// pages/underActive/underActive.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MyOrganiz: true, //我组织的
    MyTakepart: false, //参加的活动
    TabCur: 0, //第一个Tab选中项
    scrollLeft: 0,
    TabCurTwo: 0, //第二个Tab选中项
    scrollLeftTwo: 0,
    tabText: ['我组织的', '参加的活动'], //头部Tab栏
    attendTab: ['全部', '待付款', '可使用'],
    userOpenID: '', //当前登录账号ID
    showOrganList: [], //显示我组织的活动内容信息
    showTakPartList: [], // 显示参加的活动 信息
    time: '', //当前服务器时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    that.setData({
      userOpenID: app.globalData.user_openid
    })
    // 活动 我组织的活动 内容信息
    that.showMyOrganAct();
  },
  // 进页面 显示 我组织的页
  showMyOrganAct() {
    let that = this;
    that.setData({
      MyOrganiz: true, //我组织的
      MyTakepart: false, //参加的活动
      TabCur: 0, //第一个Tab选中项
      scrollLeft: 0,
    })
    // 默认 显示 该用户 组织的内容页
    that.getUserOrganActInfo();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  // 第一个Tab栏点击事件
  tabSelect(e) {
    let that = this;
    console.log("点击了第一个Tab", e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.id == 0) { //点击 我组织的 项
      that.setData({
        MyOrganiz: true, //我组织控制 开启
        MyTakepart: false, //参加的活动 关闭
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
      // 获取 我组织的内容
      that.getUserOrganActInfo();
    } else if (e.currentTarget.dataset.id == 1) { //点击 参加的活动 项
      that.setData({
        MyOrganiz: false, //  我组织 控制关闭
        MyTakepart: true, // 参加的活动  开启
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
      // 获取 参见的活动信息  默认显示全部内容
      that.getUserTakpartActInfos();
    }
  },

  // 第二个Tab栏点击事件
  twotabSelect(e) {
    let that = this;
    console.log("第二个Tab点击内容", e.currentTarget.dataset.id);
    that.setData({
      TabCurTwo: e.currentTarget.dataset.id,
      scrollLeftTwo: (e.currentTarget.dataset.id - 1) * 60
    })
    // 获取某一类型的参加活动信息
    if (e.currentTarget.dataset.id == 0) {
      console.log("获取全部的参加活动信息");
      that.setData({
        showTakPartList: [],
      })
      // 获取全部的参加活动信息
      that.getUserTakpartActInfos()
    } else if (e.currentTarget.dataset.id == 1) {
      console.log("获取待付款的参加活动信息");
      that.setData({
        showTakPartList: [],
      })
      //获取 待付款 的参加活动信息 未付款的 0
      that.getDetatilTypeUserTakpartActInfos(0);
    } else if (e.currentTarget.dataset.id == 2) {
      console.log("获取可使用的参加活动细腻些");
      that.setData({
        showTakPartList: [],
      })
      // 获取 可使用 的参加活动信息  付款成功的 1
      that.getDetatilTypeUserTakpartActInfos(1);
    }
  },


  // 获取该用户组织的活动信息 
  getUserOrganActInfo() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    console.log("当前showOrganList的数组长度", that.data.showOrganList.length);
    let len = that.data.showOrganList.length;
    wx.cloud.database().collection('activity')
      .where({
        userInforID: that.data.userOpenID
      })
      .skip(len)
      .orderBy("activityPublishTime", 'desc')
      .get()
      .then(res => {
        wx.hideLoading();
        console.log("用户组织的活动信息获取成功", res.data);
        let dataList = res.data;
        if (dataList.length <= 0) {
          wx.showToast({
            icon: 'error',
            title: '没有更多数据了',
          })
        } else {
          that.setData({
            showOrganList: that.data.showOrganList.concat(res.data)
          })
        }
      })
      .catch(err => {
        console.log("用户组织的信息获取失败", err);
      })

  },
  // 获取当前本地服务器时间
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


  // 跳转 我组织的活动具体详情页
  goDetailMyOrgan(e) {
    console.log("跳转活动具体详情页ID", e.currentTarget.dataset._id);
    console.log("跳转活动具体详情页Type", e.currentTarget.dataset.type);
    if (e.currentTarget.dataset.type == 0) { //个人活动 跳转
      console.log("跳转个人活动");
      wx.redirectTo({
        url: '../PersonalActivityXQ/PersonalActivityXQ?activityID=' + e.currentTarget.dataset._id,
      })
    } else if (e.currentTarget.dataset.type == 1) { //商家活动 跳转
      console.log("跳转商家活动");
      wx.redirectTo({
        url: '../OfficialActivityXQ/OfficialActivityXQ?activityID=' + e.currentTarget.dataset._id
      })
    }
  },
  //更新&删除 该用户组织的活动
  updateActInfo(e) {
    let that = this;
    console.log("修改活动ID", e.currentTarget.dataset._id);
    console.log("修改活动类型", e.currentTarget.dataset.type);
    console.log("该修改活动发布之ID", e.currentTarget.dataset.userid);
    console.log("openid", app.globalData.user_openid);
    console.log("data中userID", that.data.userOpenID);
    if (e.currentTarget.dataset.type == 0 && app.globalData.user_openid === e.currentTarget.dataset.userid) { //个人活动 跳转
      wx.redirectTo({
        url: '../PublishActivity/PublishActivity?ActID=' + e.currentTarget.dataset._id,
      })
    } else if (e.currentTarget.dataset.type == 1) { //商家活动 跳转
      wx.showModal({
        title: '提示',
        content: '本活动为商家活动,请联系平台管理员帮您修改 13082126628',
        success: function (res) {}
      })
    }
  },
  // 获取 全部 该用户参加的活动信息
  getUserTakpartActInfos() {
    let that = this;
    console.log("第二个Tab显示的内容", that.data.TabCurTwo);
    wx.showLoading({
      title: '加载中',
    })
    console.log("1当前showTakPartList的数组长度", that.data.showTakPartList.concat.length);
    let len = that.data.showTakPartList.length;
    // console.log("当前账号openID", app.globalData.user_openid);
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "UnderActConnectedTable",
          len: len, //当前 显示数组长度
          BookUserId: app.globalData.user_openid, //预定账号OpenID
        }
      })
      .then(res => {
        console.log("1参加的活动信息获取成功", res.result.list);
        wx.hideLoading();
        if (res.result.list.length <= 0) {
          wx.showToast({
            icon: 'error',
            title: '没有更多数据了',
          })
        } else {
          that.setData({
            showTakPartList: that.data.showTakPartList.concat(res.result.list)
          })
        }
      })
      .catch(err => {
        console.log("获取失败", err);
      })
  },

  // 获取 该用户参加的活动 (待付款/可使用) 
  getDetatilTypeUserTakpartActInfos(e) {
    let that = this;
    console.log("第二个Tab显示的内容", that.data.TabCurTwo);
    wx.showLoading({
      title: '加载中',
    })
    console.log("当前showTakPartList的数组长度", that.data.showTakPartList.concat.length);
    let len = that.data.showTakPartList.length;
    console.log("当前账号openID", app.globalData.user_openid);
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "UnderActConnectedTableDetail",
          len: len, //当前 显示数组长度
          BookUserId: app.globalData.user_openid, //预定账号OpenID
          orPayState: e, //待付款 0  可使用 1
        }
      })
      .then(res => {
        console.log("参加的活动信息获取成功", res.result.list);
        wx.hideLoading();
        if (res.result.list.length <= 0) {
          wx.showToast({
            icon: 'error',
            title: '没有更多数据了',
          })
        } else {
          that.setData({
            showTakPartList: that.data.showTakPartList.concat(res.result.list)
          })
        }
      })
      .catch(err => {
        console.log("获取失败", err);
      })
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that = this;
    console.log("上拉触底了");
    if (that.data.MyOrganiz == true && that.data.MyTakepart == false && that.data.TabCur == 0) { //当前在 我组织的页面
      // 继续调用 获取我组织的活动信息 
      that.getUserOrganActInfo();
    } else if (that.data.MyOrganiz == false && that.data.MyTakepart == true && that.data.TabCur == 1) { //当前在 参加的活动页面
      console.log("第二个Tab栏下标", that.data.TabCurTwo);
      if (that.data.TabCurTwo == 0) { //依旧 显示全部类型参加的活动
        that.getUserTakpartActInfos();
      } else if (that.data.TabCurTwo == 1) { //依旧 显示待付款类型参加的活动
        that.getDetatilTypeUserTakpartActInfos(0);
      } else if (that.data.TabCurTwo == 2) { //依旧显示 可使用类型参加的活动
        that.getDetatilTypeUserTakpartActInfos(1);
      }
    }
  },

  // 查看订单详细内容
  goOrderDetailInfo(e) {
    let that = this;
    // console.log(e.currentTarget.dataset.orderid);
    wx.redirectTo({
      url: '../VerificationOrder/VerificationOrder?orderId=' + e.currentTarget.dataset.orderid
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


  // 跳转 待付款页
  goWaitPay(e) {
    let that = this;
    console.log(e);
    console.log("待付款ID", e.currentTarget.dataset.orderid);
    that.time();
    // 获取跳转订单的时间信息
    wx.cloud.database().collection('booking')
      .where({
        _id: e.currentTarget.dataset.orderid
      })
      .get()
      .then(res => {
        console.log("订单信息获取成功", res.data[0].bookTime);
        console.log("目前服务器时间", that.data.time);
        let ShowTime = that.shijiancha(res.data[0].bookTime, that.data.time);
        console.log("时间差", ShowTime);
        let arrs = ShowTime.split("-");
        console.log("切割字符串", arrs);
        console.log("长度", arrs.length);
        if (arrs.length == 3 && arrs[0] <= 0 && arrs[1] <= 0 && arrs[2] < 15) {
          console.log("进入支付页面");
          wx.redirectTo({
            url: '../WaitPay/WaitPay?Arrorder=' + arrs[2] + "---" + e.currentTarget.dataset.orderid,
          })
        } else if (arrs.length == 2 && arrs[0] <= 0 && arrs[1] <= 15) {
          console.log("进入支付页面");
          wx.redirectTo({
            url: '../WaitPay/WaitPay?Arrorder=' + arrs[1] + "---" + e.currentTarget.dataset.orderid,
          })
        } else if (arrs.length == 1 && arrs[0] <= 15) {
          console.log("进入支付页面");
          wx.redirectTo({
            url: '../WaitPay/WaitPay?Arrorder=' + arrs[0] + "---" + e.currentTarget.dataset.orderid,
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '订单已超时',
          })
          // 订单超时  删除订单
          that.cancleOrders(e.currentTarget.dataset.orderid);
        }
      })
      .catch(err => {
        console.log("订单信息获取失败", err);
      })
  },

  //取消订单
  cancleOrder(e) {
    console.log("取消订单ID", e.currentTarget.dataset.orderid);
    let orderID = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '提示',
      content: '您确定要删除该订单吗',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          console.log("当前账号openID", app.globalData.user_openid);
          console.log("当前取消订单号", orderID);
          wx.cloud.callFunction({
              name: 'getDate',
              data: {
                num: 'deletOrderBooking',
                _id: orderID, //订单号
                BookUserId: app.globalData.user_openid //订单发起者
              }
            })
            .then(res => {
              console.log("订单删除成功", res);
              wx.switchTab({
                url: '../Mine/Mine',
              })
              wx.showToast({
                icon: 'success',
                title: '删除成功',
              })
            })
            .catch(err => {
              console.log("订单删除失败", err);
            })

        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },

  //内部取消订单
  cancleOrders(e) {
    console.log("取消订单ID", e);
    let orderID = e;
    console.log("当前账号openID", app.globalData.user_openid);
    console.log("当前取消订单号", orderID);
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'deletOrderBooking',
          _id: orderID, //订单号
          BookUserId: app.globalData.user_openid //订单发起者
        }
      })
      .then(res => {
        console.log("订单删除成功", res);
        wx.switchTab({
          url: '../Mine/Mine',
        })
        wx.showToast({
          icon: 'success',
          title: '超时订单删除',
        })
      })
      .catch(err => {
        console.log("订单删除失败", err);
      })
  }

})