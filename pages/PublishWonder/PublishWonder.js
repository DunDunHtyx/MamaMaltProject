 // pages/PublishWonder/PublishWonder.js
 var app = getApp();
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     imgList: [], //照片
     BrieflyText: '', //输入的内容
     realationActID: '', //关联活动
     realationActInfo: [], //关联活动活动信息
     orSelected: false,
     actPrice: '', //活动大致票价
     publisherID: '', //发布者用户openID
     publisherAvater: '', //发布者头像
     publisherNickName: '', //发布者昵称
     time: '', //发布时间
     editWonderID: '', //待编辑ID
     images_success: [], //上传云存储后的云存储的地址数组
     images_success_size: 0, //图片上传成功的数量


     //-----------------
     type: '', //跳转类型  1:发布精彩瞬间 2:选择关联活动跳转 3:更新

     //----------------------
     images_success: [],//上传云存储后的云存储地址数组
     images_success_size:0,//图片上传成功的数量
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad(e) {
     let that = this;
     // console.log("传参数",e.realationID);
     console.log("e", e);
     console.log("e", e.type);
     // console.log("发布者用户openID",app.globalData.user_openid);
     if (e.realationID == -999 && e.type == 1) {
       console.log("空");
       that.setData({
         type: e.type
       })
     } else if (e.type == 2) {
       console.log("选择关联活动");
       that.setData({
         realationActID: e.realationID,
         publisherID: app.globalData.user_openid,
         type: e.type
       })
       // 获取关联活动活动内容
       that.getRealationAct();
       // 获取关联活动票价信息
       that.getActTicket();
       // 获取发布者用户信息
       that.getUserinfo();
     } else if (e.type == 3) {
       console.log("编辑");
       that.setData({
         editWonderID: e.wonderID
       })
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
   //富文本实例化
   onEditorReady() {
     const that = this
     wx.createSelectorQuery().select('#editor').context(function (res) {
       that.editorCtx = res.context
     }).exec()
     console.log("实例化成功");
   },

   //获取输入的内容
   getContent(e) {
     let that = this;
     console.log("res", e.detail.html);
     that.setData({
       BrieflyText: e.detail.html
     })
   },

   //图片上传
   ChooseImage() {
     wx.chooseImage({
       count: 9, //默认9
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

   //图片放大
   ViewImage(e) {
     wx.previewImage({
       urls: this.data.imgList,
       current: e.currentTarget.dataset.url
     });
   },

   //删除图片
   DelImg(e) {
     wx.showModal({
       title: '提示',
       content: '确定要删除吗？',
       cancelText: '再想想',
       confirmText: '确定',
       success: res => {
         if (res.confirm) {
           this.data.imgList.splice(e.currentTarget.dataset.index, 1);
           this.setData({
             imgList: this.data.imgList
           })
         }
       }
     })
   },

   // 选择关联活动
   choiceActivity() {
     wx.redirectTo({
       url: '../choiceActivity/choiceActivity',
     })
   },


   //获取关联活动活动信息
   getRealationAct() {
     let that = this;
     // console.log("关联活动ID",that.data.realationActID);
     wx.cloud.database().collection('activity')
       .where({
         _id: that.data.realationActID
       })
       .get()
       .then(res => {
         console.log("关联活动活动信息获取成功", res.data[0]);
         that.setData({
           realationActInfo: res.data[0],
           orSelected: true
         })
       })
       .catch(err => {
         console.log("关联活动活动信息获取失败", err);
       })
   },


   // 获取活动票价信息
   getActTicket() {
     let that = this;
     wx.cloud.database().collection('ticketInformation')
       .where({
         activityID: that.data.realationActID
       })
       .get()
       .then(res => {
         console.log("活动票价信息获取成功", res.data[0].ticketType[0].ticketPrice);
         that.setData({
           actPrice: res.data[0].ticketType[0].ticketPrice
         })
       })
       .catch(err => {
         console.log("活动票价信息获取失败", err);
       })
   },


   // 获取用户信息
   getUserinfo() {
     let that = this;
     wx.cloud.database().collection('user')
       .where({
         _openid: that.data.publisherID
       })
       .get()
       .then(res => {
         console.log("发布者信息获取成功", res.data[0]);
         that.setData({
           publisherAvater: res.data[0].userImage, //发布者头像
           publisherNickName: res.data[0].userName, //发布者昵称
         })

       })
       .catch(err => {
         console.log("发布者信息获取失败", err);
       })
   },


   // 获取发布时间
   GetTime() {
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


   //将图片上传的云存储中
   uploadImage(index) {
     let that = this
       wx.cloud.uploadFile({ //上传至微信云存储
         cloudPath: 'wonderfulImage/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数给图片命名
         filePath: that.data.imgList[index], // 本地文件路径
         success: res => {
           // // 返回文件 ID
           // console.log("上传成功",res.fileID)
           that.data.images_success[index] = res.fileID;
           that.data.images_success_size = that.data.images_success_size + 1;

           if (that.data.images_success_size == that.data.imgList.length) {
             //将精彩瞬间数据上传到数据库中
             that.finallyPublish();
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

   },


   // 发布
   publish() {
      let that=this;
      //获取当前时间
      that.GetTime();
      wx.showLoading({
        title: '上传中',
      })
      console.log("活动照片",that.data.imgList);
      if (that.data.realationActInfo.length < 0 || that.data.imgList.length <= 0 || that.data.BrieflyText.length <= 0 || that.data.time <= 0) {
        wx.showToast({
          icon: 'error',
          title: '信息残缺',
        })
      }else{
        that.setData({
          images_success:that.data.imgList
        })
        //将图片上传到云存储中
        that.uploadImage(0);
      }
   },

   //最终发布
   finallyPublish(){
    let that = this;
     //获取当前时间
     that.GetTime();
     console.log("发布");
     console.log("活动照片", that.data.realationActInfo.activityImage);
     console.log("活动信息", that.data.realationActInfo.activityTheme);
     console.log("活动价格", that.data.actPrice);
     console.log("上传到云存储中的图片",that.data.images_success);
     console.log("发布者头像", that.data.publisherAvater);
     console.log("发布者昵称", that.data.publisherNickName);
     console.log("发布者openID", that.data.publisherID);
     console.log("发布时间", that.data.time);
     console.log("关联项目ID", that.data.realationActID);
     console.log("点赞数"); //0
     console.log("收藏数"); //0
     console.log("输入的内容", that.data.BrieflyText);
     if (that.data.realationActInfo.length < 0 || that.data.imgList.length <= 0 || that.data.BrieflyText.length <= 0 || that.data.time <= 0) {
       wx.showToast({
         icon: 'error',
         title: '发布失败,重试',
       })
     } else {
       wx.cloud.callFunction({
           name: 'getDate',
           data: {
             num: "addWonderfulMoments",
             ActImage: that.data.realationActInfo.activityImage, //活动照片
             ActName: that.data.realationActInfo.activityTheme, //活动主题
             ActPrtice: that.data.actPrice, //活动价格
             Images: that.data.imgList, //照片
             PubAvater: that.data.publisherAvater, //发布者头像
             PubNickname: that.data.publisherNickName, //发布者昵称 
             PublicerID: that.data.publisherID, //发布者openID
             PublishTime: that.data.time, //发布时间
             RelationalActivityID: that.data.realationActID, //关联活动ID
             dianzan: 0, //点赞数 
             shoucang: 0, //收藏数
             wonderContent: that.data.BrieflyText, //富文本内容
           },
         })
         .then(res => {
           console.log("发布成功", res);
           wx.hideLoading();
           wx.showToast({
             icon: 'success',
             title: '发布成功',
           })
           setTimeout(function(){
            wx.redirectTo({
              url: '../WonderfulMoments/WonderfulMoments'
            })
           },2000)
         })
         .catch(err => {
           console.log("发布失败", err);
         })
     }
   }
 })