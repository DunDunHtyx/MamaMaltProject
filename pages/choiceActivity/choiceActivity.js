// pages/choiceActivity/choiceActivity.js
var app=getApp()
var inputContents=''//记录输入的内容
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent:'',//输入的内容
    findContent:[],//查询到的内容
    orSearch:false,//是否使用搜索功能
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
    // 获取所有商家活动
    that.getAllAct();
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

  //获得所有商家活动
  getAllAct(){
      let that=this;
      console.log("当前findContent的数组长度",that.data.findContent.length);
      let len=this.data.findContent.length;
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.database().collection('activity')
      .where({
        activityType:1,//商家活动类型1
        activityState:0,//活动状态 正在报名0
      })
      .skip(len)
      .get()
      .then(res=>{
        console.log("获得所有商家活动信息成功",res.data);
        wx.hideLoading();
        let dataList=res.data;
        if(dataList.length<=0){
          wx.showToast({
            icon:'none',
            title: '没有更多数据',
          })
        }else{
          console.log("123");
          console.log("之前content",that.data.findContent.length);
          if(that.data.findContent.length<=0){
            that.setData({
              findContent:res.data,
              orSearch:false
            })
          }else{
            that.setData({
              findContent:that.data.findContent.concat(res.data),
              orSearch:false
            })
          }
          console.log("content",that.data.findContent);
        }
      })
      .catch(err=>{
        console.log("活动所有商家信息失败",err);
      })
  },


  // 获得输入的内容
  getInput(e){
    let that=this;
    console.log("输入的内容",e.detail.value);
    that.setData({
      inputContent:e.detail.value
    })
  },
  // 搜索符合的活动
  findAct(){
    let that=this;
    wx.showLoading({
      title: '加载中',
    })
    console.log("全局变量inputContents的值",inputContents);
    console.log("inputContent长度",that.data.inputContent.length);
      if(that.data.orSearch==false||inputContents!=that.data.inputContent){  
        that.setData({
          findContent:[]
        })
      }
      if(that.data.inputContent.length<=0){
        that.setData({
          findContent:''
        })
        // 调用查询全部
        that.getAllAct()
      }else{
        console.log("当前findContent的数组长度",that.data.findContent.length);
        let len=that.data.findContent.length;
        wx.cloud.database().collection('activity')
        .where(wx.cloud.database().command.and([
          {  //输入的内容
              activityTheme:wx.cloud.database().RegExp({
              regexp:that.data.inputContent,
              options:'i'
            })
          },{
            activityState:0,
            activityType:1,//商家活动类型1
          }
        ])
        )
        .skip(len)
        .get()
        .then(res=>{
          console.log("请求数据成功",res.data);
          wx.hideLoading();
          let dataList=res.data
          if(dataList.length<=0){
            wx.showToast({
              icon:'error',
              title: '没有更多数据',
            })
          }else{
            that.setData({
              findContent:that.data.findContent.concat(res.data),
              orSearch:true,
              inputContent:that.data.inputContent
            })
          }
        })
        .catch(err=>{
          console.log("请求数据失败",err);
        })
      }
  },
  onReachBottom(){
    console.log("上拉触底了");
    let that=this;
    console.log("当前orSearch状态",that.data.orSearch);
    if(that.data.orSearch==false){ //没有使用搜索功能，呈现全部商家活动
      that.getAllAct()
    }else { //已经使用搜索功能，呈现全部搜索匹配到的商家活动
      that.findAct() 
    }
  },
  goPublishWonder(e){
    console.log("跳转",e.currentTarget.dataset.actid);
    wx.redirectTo({
      url:'../PublishWonder/PublishWonder?realationID='+e.currentTarget.dataset.actid+"&type="+2
    })
  }
})

