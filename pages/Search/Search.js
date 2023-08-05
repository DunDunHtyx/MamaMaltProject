// pages/Search/Search.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      hotSearch:[],//热门搜素
      inputContent:'',//输入内容
      searchHistory:[],//搜素的历史记录
      placeHoder:'',//默认选项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let that=this;
      //获取热门搜索项
      that.getHotSearch();
      //获取用户搜素记录
      that.getSearchHistory();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
      this.onLoad();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.onLoad();
  },
  
  //获取输入内容
  getinput(e){
    let that=this;  
    console.log("输入内容为",e.detail.value);
      that.setData({
        inputContent:e.detail.value
      })
      console.log("data中输入的内容",that.data.inputContent);
      
  },
  //搜素
  goSearchXQ(){
    let that=this;
    console.log("data中input内容",that.data.inputContent);
    if(that.data.inputContent==''){
      wx.navigateTo({
        url: '../SearchXQ/SearchXQ?input='+that.data.placeHoder,
      })
      that.addSearchHistory(that.data.placeHoder);
    }else{
      wx.navigateTo({
        url: '../SearchXQ/SearchXQ?input='+that.data.inputContent,
      })
      that.addSearchHistory(that.data.inputContent);
    }
  },

  //获取热门搜索项
  getHotSearch(){
    let that=this;
    wx.cloud.database().collection('HotSearch').get()
    .then(res=>{
        console.log("获取热门搜索项成功",res.data);
        that.setData({
          hotSearch:res.data,
          placeHoder:res.data[0].name
        })
    })
    .catch(err=>{
      console.log("获取热门搜索项失败",err);
    })
  },

  //点击 搜索项 事件
  pointHotItem(e){
    let that=this;
      console.log("点击搜索项名字",e.target.dataset.name);
      that.setData({
        inputContent:e.target.dataset.name
      })
      //搜素跳转
      that.goSearchXQ();
  },

  //获取本用户的搜素记录
  getSearchHistory(){
    let that=this;
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          num:"getSearchHistory",
          userID:app.globalData.user_openid
        }
      })
      .then(res=>{
        console.log("获取用户搜素记录成功",res.result.data);
        that.setData({
          searchHistory:res.result.data
        })
      })
      .catch(err=>{
        console.log("获取用户搜素记录失败",err);
      })
  },

  //添加搜素历史记录
  addSearchHistory(e){
    let that=this;
    console.log("e中值",e);
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          num:"findSearchHistory",
          userID:app.globalData.user_openid,
          searchName:e
        }
      })
      .then(res=>{
          console.log("匹配查询历史记录成功",res.result.data);
          let findDate=res.result.data
          if(findDate.length==0){//不存在该条记录 添加该条 搜素历史记录
              wx.cloud.callFunction({
                name:'getDate',
                data:{
                  num:"addSearchHistory",
                  searchName:e,
                  userID:app.globalData.user_openid
                }
              })
              .then(res=>{
                console.log("历史记录添加成功",res);
              })
              .catch(err=>{
                console.log("历史记录添加失败",err);
              })
          }else{  //存在该条记录 不用添加
              console.log("存在该条搜素历史记录不用添加");
          }
      })
      .catch(err=>{
          console.log("匹配查询历史记录失败",err);
      })
  },
  //删除搜素历史记录
  removeHistory(){
    console.log("删除搜素历史记录");
    let that=this;
     wx.showModal({
         title: '提示',
         content: '确定要删除记录吗？',
         success: function (res) {
           if (res.confirm) {//这里是点击了确定以后
             wx.cloud.callFunction({
              name:'getDate',
              data:{
                num:"removeSearchHistory",
                userID:app.globalData.user_openid
              }
            })
            .then(res=>{
              console.log("搜素历史记录删除成功",res);
              that.onLoad();
            })
            .catch(err=>{
              console.log("搜素历史记录删除失败",res);
            })
           } else {//这里是点击了取消以后
             console.log('用户点击取消')
           }
         }
       })
  },
})