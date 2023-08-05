var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [], //照片
    Label: [], //后台活动标签 
    peopelNumber: 0, //参加人数
    ActivityTime: '请输入活动时间', //参加时间
    Address: '请输入活动地址', //活动地址
    DeatailAddress: '', //活动详细地址
    ActivtiyLable: '请选择标签', //活动标签
    ActivityNotice: '活动详细', //活动要求
    BrieflyText: '', //活动简述
    nowTime: '', //发布时间
    userInfo: '', //发布者信息
    currentUserID: '', //当前登录账号ID
    actState: ['正在报名', '活动结束'], //活动状态
    showActState: '活动状态', //显示活动状态
    // ------------------------
    updateActID: '', //要修改活动ID
    orShowState: false, //是否显示活动状态
    editable: true, //富文本组件可以进行二次编辑
    OldActivityNotice: '', //原来的活动详细内容
    AgainActStateIndex: '', //修改后的活动状态
    userBasicInfo: '', //修改活动的用户基本信息

    //---------------------------
    type: '', //页面操作类型  1发布活动信息  2修改活动信息
    images_success: [], //上传云存储后的云存储地址数组
    images_success_size: 0, //图片成功上传到云存储的数量

    //-----------------
    deleateImage: [], //删除的照片
    orFirstDeleateImage: false, //是否第一次删除照片

    //------------------
    DeleateImage_success_size: 0, //图片成功从云存储删除数量

    //---------------------
    orAllDeleatImage: false, //是否删除个人线下活动全部信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    console.log("修改活动ID", e.ActID);
    console.log("当前登录账号ID", app.globalData.user_openid);
    if (e.ActID == -999) { //发布活动信息
      //获取当前活动标签
      console.log('发布活动信息');
      that.getOfflineLabel();
      that.setData({
        currentUserID: app.globalData.user_openid,
        type: 1, //发布活动信息
      })
      // 获取当前登录用户信息
      that.getUserInfo();
    } else { //修改活动信息
      console.log("修改活动信息");
      console.log(e.ActID);
      that.setData({
        updateActID: e.ActID,
        currentUserID: app.globalData.user_openid,
        orShowState: true,
        type: 2, //修改活动信息
        orFirstDeleateImage: false //是否第一次删除照片
      })
      //获取当前活动标签
      that.getOfflineLabel();
      // 获取要修改活动信息 内容
      that.getNeedUpdateAct();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //富文本实例化
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
    console.log("实例化成功");
  },

  // //获取输入的内容
  getContent(e) {
    let that = this;
    // console.log("res",e.detail.value);
    that.setData({
      BrieflyText: e.detail.value
    })
  },

  //图片上传
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  //放大照片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  //删除照片
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '再想想',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if (this.data.type == 1) { //发布
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList
            })
          } else if (this.data.type == 2) { //修改活动信息
            if (this.data.orFirstDeleateImage == false) { //未第一次修改照片
              this.data.imgList.splice(e.currentTarget.dataset.index, 1);
              this.setData({
                imgList: this.data.imgList,
                deleateImage: this.data.deleateImage.concat(e.currentTarget.dataset.imageurl),
                orFirstDeleateImage: true
              })
            } else if (this.data.orFirstDeleateImage == true) {
              this.data.imgList.splice(e.currentTarget.dataset.index, 1);
              this.setData({
                imgList: this.data.imgList
              })
            }

          }
        }
      }
    })
  },

  //将图片上传的云存储中
  uploadImage(index) {
    let that = this
    if (that.data.type == 1) { //发布活动信息
      wx.cloud.uploadFile({ //上传至微信云存储
        cloudPath: 'PersonActivityImage/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数给图片命名
        filePath: that.data.imgList[index], // 本地文件路径
        success: res => {
          // // 返回文件 ID
          // console.log("上传成功",res.fileID)
          that.data.images_success[index] = res.fileID;
          that.data.images_success_size = that.data.images_success_size + 1;

          if (that.data.images_success_size == that.data.imgList.length) {
            if (that.data.type == 1) { //添加个人活动
              //将个人活动数据上传到数据库中
              that.publishPersonalActicityInfo();
            } else if (that.data.type == 2) { //修改个人活动
              //修改个人活动信息
              that.updateAct();
            }
          } else {
            that.uploadImage(index + 1)
          }
        },
        fail: err => {
          that.setData({
            images_success: [],
            images_success_size: 0
          })
          wx.showToast({
            icon: 'none',
            title: '上传失败，请重新上传',
          })
        }
      })
    } else if (that.data.type == 2) { //编辑页面 添加新的照片
      console.log("第二部上传");
      wx.cloud.uploadFile({ //上传至微信云存储
        cloudPath: 'PersonActivityImage/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数给图片命名
        filePath: that.data.imgList[index], // 本地文件路径
        success: res => {
          // // 返回文件 ID
          // console.log("上传成功",res.fileID)
          that.data.images_success[index] = res.fileID;
          that.data.images_success_size = that.data.images_success_size + 1;

          if (that.data.images_success_size == that.data.imgList.length) {
            //将个人活动数据更新数据库
            that.updateAct();
          } else {
            that.uploadImage(index + 1)
          }
        },
        fail: err => {
          that.setData({
            images_success: [],
            images_success_size: 0
          })
          wx.showToast({
            icon: 'none',
            title: '上传失败，请重新上传',
          })
        }
      })
    }

  },

  //删除云存储中的照片
  DeleteCloudPhone(index) {
    let that = this;
    console.log("删除长度", that.data.deleateImage.length);
    wx.cloud.deleteFile({
      fileList: [that.data.deleateImage[index]],
      success: res => {
        console.log(res)
        console.log("照片删除成功");
        that.setData({
          DeleateImage_success_size: that.data.DeleateImage_success_size + 1
        })
        if (that.data.DeleateImage_success_size == that.data.deleateImage.length) {
          if (that.data.type == 2 &&that.data.orAllDeleatImage==false) {
            console.log("开始照片上传云存储");
            console.log("照片", that.data.imgList);
            //新照片 添加到云存储中  编辑状态
            that.setData({
              images_success: that.data.imgList
            })
            //将新照片上传到云存储中
            that.uploadImage(0);
          }else if(that.data.type==2&&that.data.orAllDeleatImage==true){
            //删除其他个人活动信息内容
            that.deleteAct();
          }
        } else {
          that.DeleteCloudPhone(index + 1)
        }
      },
      fail: err => {
        console.log("删除失败");
      }
    })
  },


  //获取参加人数
  getPeople(e) {
    let that = this;
    // console.log("获取参加人数", e.detail.value);
    that.setData({
      peopelNumber: e.detail.value
    })
  },
  //获取参加时间
  getActivityTime(e) {
    let that = this;
    // console.log("获取参加时间", e.detail.value);
    that.setData({
      ActivityTime: e.detail.value
    })
  },
  //获取活动地址
  getAddress(e) {
    let that = this;
    // console.log("获取活动地址", e.detail.value[0] + "-" + e.detail.value[1] + "-" + e.detail.value[2]);
    that.setData({
      Address: e.detail.value[0] + "-" + e.detail.value[1] + "-" + e.detail.value[2]
    })
  },
  //获取详细地址
  getDetailAddress(e) {
    let that = this;
    // console.log("获取详细地址信息", e.detail.value);
    that.setData({
      DeatailAddress: e.detail.value
    })
  },
  //获取活动标签
  getLabel(e) {
    let that = this;
    // console.log("获取活动标签", e.detail.value);
    // console.log("获取活动标签姓名",that.data.Label[e.detail.value]);
    that.setData({
      ActivtiyLable: that.data.Label[e.detail.value]
    })
  },
  // 获取活动状态
  getActState(e) {
    let that = this;
    console.log("选取的活动状态", e);
    that.setData({
      showActState: that.data.actState[e.detail.value],
      AgainActStateIndex: e.detail.value
    })
  },
  //获取活动要求
  getDetailActivity(e) {
    let that = this;
    // console.log("获取活动要求", e.detail.html);
    that.setData({
      ActivityNotice: e.detail.html
    })
  },
  //获取 后台活动标签
  getOfflineLabel() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'getofflineLabel'
        }
      })
      .then(res => {
        console.log("后台所有活动标签信息获取成功", res.result.data);
        let arr = [];
        res.result.data.forEach(e => {
          arr.push(e.offlineLabelName)
        })
        // console.log(arr);
        that.setData({
          Label: arr
        })
      })
      .catch(err => {
        console.log("后台所有活动标签信息获取失败", err);
      })
  },

  //获取当前的时间

  getNowTime: function (e) {
    let that = this;
    //获取时间：年月日
    let dataTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    // let hour = new Date().getHours()
    // let minute = new Date().getMinutes()
    dataTime = `${yy}.${mm}.${dd} `;
    that.setData({
      nowTime: dataTime
    })
  },

  //获取用户信息
  getUserInfo() {
    let that = this;
    wx.cloud.database().collection('user')
      .where({
        _openid: app.globalData.user_openid
      })
      .get()
      .then(res => {
        // console.log("用户信息获取成功",res.data[0]);
        that.setData({
          userInfo: res.data[0]
        })
        // console.log("data中userInfo",that.data.userInfo);
      })
      .catch(err => {
        console.log("用户信息获取失败", err);
      })
  },

  //发布
  publish() {
    let that = this;
    //将发布的活动照片上传云存储中
    if (that.data.imgList.length < 0) {
      wx.showToast({
        icon: 'none',
        title: '请填加照片',
      })
    } else {
      that.setData({
        images_success: that.data.imgList
      })
      that.uploadImage(0)
    }
  },

  //将 新增的个人活动信息  添加到数据库中
  publishPersonalActicityInfo() {
    let that = this;
    that.getNowTime();
    console.log("活动简述", that.data.BrieflyText);
    console.log("活动图片", that.data.imgList[0]);
    console.log("上传云存储中照片", that.data.images_success[0]);
    console.log("活动时间", that.data.ActivityTime);
    console.log("活动大概地址", that.data.Address);
    console.log("活动详细地址", that.data.DeatailAddress);
    console.log("活动标签", that.data.ActivtiyLable);
    console.log("活动要求", that.data.ActivityNotice);
    console.log("发布时间", that.data.nowTime);
    console.log("用户账号openID", app.globalData.user_openid);
    console.log("用户信息", app.globalData.userInfo);
    if (that.data.BrieflyText == "" || that.data.imgList.length == 0 || that.data.ActivityTime == "" || that.data.Address == "" || that.data.DeatailAddress == "" || that.data.ActivtiyLable == "" || that.data.ActivityNotice == "") {
      wx.showToast({
        icon: 'error',
        title: '信息未填完',
      })
    } else {
      wx.showToast({
        title: '信息填完',
      })
      wx.cloud.callFunction({
          name: 'getDate',
          data: {
            num: 'addPersonalActivities',
            activityAddress: that.data.Address, //活动大概地址
            activityDate: that.data.ActivityTime, //活动日期
            activityImage: that.data.images_success[0], //活动照片
            activityOverview: that.data.BrieflyText, //活动简要
            activityPublishTime: that.data.nowTime, //活动发布时间
            activityRequest: that.data.ActivityNotice, //活动详细要求
            activityState: 0, //活动状态 正在报名 0
            activityTitle: [that.data.ActivtiyLable], //活动标签
            activityTotalAddress: that.data.DeatailAddress, //活动详细地址
            activityType: 0, //活动类型 个人活动 0
            comeNumber: null, //参加人数 无用
            userInfo: [that.data.userInfo.userImage, that.data.userInfo.userName, that.data.userInfo.userSex], //发布者信息
            userInforID: app.globalData.user_openid, //发布者账号ID
            ScanCode: null, //授权核销账号  无用
            activityTheme: null, //活动主图 无用
            swiperImage: null, //宣传照轮播图 无用
            AlreadyRegisteNumred: null, //已报名人数 无用
            activityEndTime: null //活动结束时间 无用
          }
        })
        .then(res => {
          console.log("个人活动添加成功", res);
          wx.switchTab({
            url: '../DatingOffline/DatingOffline',
          })
        })
        .catch(err => {
          console.log("个人活动添加失败", err);
        })
    }
  },

  //获取修改活动信息
  getNeedUpdateAct() {
    let that = this;
    wx.cloud.database().collection('activity')
      .where({
        _id: that.data.updateActID,
        userInforID: that.data.currentUserID,
      })
      .get()
      .then(res => {
        console.log("要修改的活动信息获取成功", res.data[0]);
        let contentList = res.data[0];
        that.setData({
          BrieflyText: contentList.activityOverview, //活动简述
          imgList: [contentList.activityImage], //活动照片
          ActivityTime: contentList.activityDate, //活动时间
          Address: contentList.activityAddress, //活动地址
          DeatailAddress: contentList.activityToTalAddress, //活动详细地址
          ActivtiyLable: contentList.activityTitle, //活动标签
          showActState: that.data.actState[contentList.activityState], //活动状态
          AgainActStateIndex: contentList.activityState, //活动状态index
          ActivityNotice: contentList.activityRequest, //活动详细
          OldActivityNotice: contentList.activityRequest, //原来的活动详细内容
          userBasicInfo: contentList.userInfo, //用户基本信息
        })
      })
      .catch(err => {
        console.log("要修改的活动信息获取失败", err);
      })
  },

  //点击删除个人活动按钮
  bindtapDeleateActa() {
    let that = this;
    console.log("删除个人活动");
    wx.showModal({
      title: '提示',
      content: '您真的要删除活动吗?',
      complete: (res) => {
        if (res.cancel) {
          console.log("用户点击取消");
        }

        if (res.confirm) {
          console.log("用户点击确定");
          wx.showLoading();
          that.setData({
            orAllDeleatImage: true ,//确定要删除全部活动信息
            deleateImage:that.data.imgList,//要删除的照片信息
          })
          console.log("照片imageList",that.data.imgList);
          //删除云存储中的照片
          that.DeleteCloudPhone(0);
        }
      }
    })
  },

  // 删除个人活动
  deleteAct(e) {
    let that = this;
    console.log("删除活动");
    console.log('用户点击确定');
    console.log("用户要删除的活动ID", that.data.updateActID);
    console.log("登录账号用户openID", app.globalData.user_openid);
    that.setData({
      orAllDeleatImage: true
    })
    // 调用 云函数 删除该个人活动
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: "DeletePersonalAct",
          ID: that.data.updateActID, //活动ID
          userID: app.globalData.user_openid, //发布活动用户ID
        }
      })
      .then(res => {
        console.log("该个人活动信息删除成功", res);
        wx.hideLoading();
        wx.showToast({
          icon:'success',
          title: '删除成功',
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../underActive/underActive'
          })
        },2000)
      })
      .catch(err => {
        console.log("该个人活动信息删除失败", err);
      })
  },
  //最终修改个人活动
  finallUpdateAct(e) {
    let that = this;
    console.log("修改活动");
    wx.showModal({
      title: '提示',
      content: '您确定要修改吗?',
      complete: (res) => {
        if (res.cancel) {
          console.log("取消");
        }
        if (res.confirm) {
          console.log("确定");
          if (that.data.BrieflyText.length <= 0 || that.data.imgList.length <= 0 || that.data.DeatailAddress.length <= 0 || that.data.ActivityNotice.length <= 0 || that.data.ActivityNotice === "<p><br></p>" || that.data.ActivityNotice == "<p>活动详细</p>") {
            wx.showToast({
              icon: 'error',
              title: '信息填全',
            })
          } else {
            console.log("删除的照片", that.data.deleateImage);
            if (that.data.deleateImage.length < 0) { //没有更改活动照片
              //修改个人信息
              that.updateAct();
            } else if (that.data.deleateImage.length > 0) {
              //删除云存储中的照片
              that.DeleteCloudPhone(0);
            }
          }
        }
      }
    })
  },
  // 修改个人活动
  updateAct(e) {
    let that = this;
    console.log("修改活动");
    that.getNowTime();
    console.log('用户点击确定');
    console.log("活动大概地址", that.data.Address);
    console.log("活动日期", that.data.ActivityTime);
    console.log("活动照片", that.data.imgList[0]); //字符串
    console.log("云存储照片", that.data.images_success[0]); //云存储中照片
    console.log("活动简要", that.data.BrieflyText);
    console.log("活动发布时间", that.data.nowTime);
    console.log("活动详细要求", that.data.ActivityNotice);
    console.log("活动状态", that.data.AgainActStateIndex); //数字
    console.log("活动标签", that.data.ActivtiyLable); //数组
    console.log("活动详细地址", that.data.DeatailAddress);
    console.log("活动发布者基本信息", that.data.userBasicInfo);
    console.log("活动发布者OpenID", app.globalData.user_openid);
    // 调用 更新个人信息 云函数
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'UpdatePersonalAct',
          ID: that.data.updateActID, //活动ID
          userID: app.globalData.user_openid, //活动发布者openID
          activityAddress: that.data.Address, //活动大概地址 
          activityDate: that.data.ActivityTime, //活动日期
          activityImage: that.data.images_success[0], //活动照片
          activityOverview: that.data.BrieflyText, //活动简要
          activityPublishTime: that.data.nowTime, //活动发布时间
          activityRequest: that.data.ActivityNotice, //活动详细要求
          activityState: that.data.AgainActStateIndex, //活动状态
          activityTitle: that.data.ActivtiyLable, //活动标签
          activityToTalAddress: that.data.DeatailAddress, //活动详细地址
          userInfo: that.data.userBasicInfo, //发布者 基本信息
          userInforID: app.globalData.user_openid, //活动发布者 openID
        }
      })
      .then(res => {
        console.log("个人活动信息更新成功", res);
        wx.showToast({
          icon: "success",
          title: '更新成功',
        })

        setTimeout(function () {
          wx.redirectTo({
            url: '../underActive/underActive'
          })
        }, 2000)
      })
      .catch(err => {
        console.log("个人活动信息更新失败", err);
      })
  },

})