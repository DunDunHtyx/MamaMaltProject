// pages/PersonInforPage/PersonInforPage.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showImage:'',//照片
    sex:['男','女'],
    sexIndex:'',//性别下标
    showSex:'',//性别
    showAddress:'北京市-北京市-东城区',//地址
    showNickName:'墩墩',//昵称
    showPhone:'13082126628',//手机号
    showGxqm:'这个人很懒',//个性签名
    oldImage:'',//原来照片
    orDeleateImage:false,//是否删除照片
    images_success:'',//上传到云存储中的照片路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
    //获取用户个人信息
    that.getPeopleUserInfo();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  //图片上传
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log("res",res.tempFilePaths[0]);
            this.setData({
              showImage: res.tempFilePaths[0],
              orDeleateImage:true
            })
      }
    });
  },
  
  //从云存储中删除原来的照片
  DeleteCloudPhone(index) {
    let that = this;
    console.log("原有照片", that.data.oldImage);
    wx.cloud.deleteFile({
      fileList: [that.data.oldImage],
      success: res => {
        console.log(res)
        console.log("照片删除成功");
        //添加新的头像照片
        that.uploadImage();
      },
      fail: err => {
        console.log("删除失败");
      }
    })
  },

  //向云存储上传更换的新照片
  uploadImage(){
    let that=this
    console.log("更新的头像",that.data.showImage);
      wx.cloud.uploadFile({//上传至微信云存储
        cloudPath:'userAvater/' + new Date().getTime() + "_" +  Math.floor(Math.random()*1000) + ".jpg",//使用时间戳加随机数给图片命名
        filePath:that.data.showImage,// 本地文件路径
        success: res => {
          that.data.images_success= res.fileID;
          //更新个人信息
          that.updateImagePeopleInfo();
        },
        fail: err =>{
          wx.showToast({
            icon:'none',
            title: '上传失败，请重新上传',
          })
        }
      })
  },

  //获取用户个人信息
  getPeopleUserInfo(){
    let that=this;
    wx.cloud.database().collection('user')
    .where({
      _openid:app.globalData.user_openid
    })
    .get()
    .then(res=>{
      console.log("用户个人信息获取成功",res.data[0]);
      that.setData({
        showImage:res.data[0].userImage,//用户头像
        oldImage:res.data[0].userImage,//原来照片
        showPhone:res.data[0].truePhone,//用户手机号
        sexIndex:res.data[0].userSex,//性别下标
        showAddress:res.data[0].userAdress,//用户地区
        showGxqm:res.data[0].userText,//个性签名
      })
      if(that.data.sexIndex==0){ //男
          that.setData({
            showSex:'男'
          })
      }else if(that.data.sexIndex==1){ //女
          that.setData({
            showSex:'女'
          })
      }
    })
    .catch(err=>{
      console.log("用户个人信息获取失败",err);
    })
  },
  //获取昵称
  getNickName(e){ 
    let that=this;
    // console.log("获取昵称",e.detail.value);
    that.setData({
      showNickName:e.detail.value
    })
  },
  //获取手机号
  getPhone(e){
    let that=this;
    // console.log("手机号",e.detail.value);
    that.setData({
      showPhone:e.detail.value
    })
  },
  //性别
  getSex(e){
    let that=this;
    // console.log("性别",e.detail.value);
    that.setData({
      showSex:that.data.sex[e.detail.value],
      sexIndex:parseInt(e.detail.value)  
    })
  },
  //获取地区
  getAddress(e){  
    let that=this;
    // console.log("获取地区",e.detail.value);
    that.setData({
      showAddress:e.detail.value[0]+'-'+e.detail.value[1]+'-'+e.detail.value[2]
    })
  },
  //获取个性签名
  getPersonalized(e){
    let that=this;
    // console.log("个性签名",e.detail.value);
    that.setData({
      showGxqm:e.detail.value
    })
  },
  //修改
  update(){
    let that=this;
    wx.showLoading({
      title: '修改中',
    })
    let ceshiPhone=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if(that.data.showNickName.length<=0||that.data.showPhone.length<11||that.data.showGxqm.length<=0){
      wx.showToast({
        icon:'error',
        title: '信息残缺',
      })
    }else if(ceshiPhone.test(that.data.showPhone)==false){
        wx.showToast({
          icon:'error',
          title: '手机号码不合法',
        })
    }else if(that.data.showGxqm.length>8){
        wx.showToast({
          icon:'none',
          title: '签名长度小于8',
        })
    }else{
      console.log('更新');
      console.log("是否更改了头像照片",that.data.orDeleateImage);
      if(that.data.orDeleateImage==true){ //更改了头像照片
          //删除用户原来头像照片
          that.DeleteCloudPhone();
      }else{ //没有更改头像照片
        console.log("照片",that.data.showImage);
        console.log("昵称",that.data.showNickName);
        console.log("手机号",that.data.showPhone);
        console.log("性别",that.data.sexIndex);
        console.log("地区",that.data.showAddress);
        console.log("个性签名",that.data.showGxqm);
        wx.cloud.callFunction({
          name:'getDate',
          data:{
            num:'updateUserDatebaseInfo',
            userOpenID:app.globalData.user_openid,
            userImage:that.data.showImage,//用户头像
            userName:that.data.showNickName,//用户昵称 
            truePhone:that.data.showPhone,//用户手机号
            userSex:parseInt(that.data.sexIndex),//用户性别
            userAdress:that.data.showAddress,//地区
            userText:that.data.showGxqm,//个性签名
          }
        })
        .then(res=>{
          console.log("个人信息修改成功",res);
          wx.hideLoading();
          wx.showToast({
            icon:'success',
            title: '修改成功',
          })
          setTimeout(function(){
            wx.switchTab({
              url: '../Mine/Mine',
            })
          },1000)
        })
        .catch(err=>{
          console.log("个人信息修改失败",err);
        })
      }
    }
  },
  
  //照片更改的个人信息更新
  updateImagePeopleInfo(){
    let that=this;
    console.log("照片",that.data.images_success);
    console.log("昵称",that.data.showNickName);
    console.log("手机号",that.data.showPhone);
    console.log("性别",that.data.sexIndex);
    console.log("地区",that.data.showAddress);
    console.log("个性签名",that.data.showGxqm);
    wx.cloud.callFunction({
      name:'getDate',
      data:{
        num:'updateUserDatebaseInfo',
        userOpenID:app.globalData.user_openid,
        userImage:that.data.images_success,//用户头像
        userName:that.data.showNickName,//用户昵称 
        truePhone:that.data.showPhone,//用户手机号
        userSex:parseInt(that.data.sexIndex),//用户性别
        userAdress:that.data.showAddress,//地区
        userText:that.data.showGxqm,//个性签名
      }
    })
    .then(res=>{
      console.log("个人信息修改成功",res);
      wx.hideLoading();
      wx.showToast({
        icon:'success',
        title: '修改成功',
      })
      setTimeout(function(){
        wx.switchTab({
          url: '../Mine/Mine',
        })
      },1000)
    })
    .catch(err=>{
      console.log("个人信息修改失败",err);
    })
  }
})