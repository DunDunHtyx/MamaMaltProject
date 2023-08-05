// pages/SearchXQ/SearchXQ.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      inputContent:'',//输入的内容
      article:[],//搜索到的文章内容
      placeHoder:'',//输入框内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
      console.log("获取到的输入值",options.input);
      that.setData({
        inputContent:options.input,
        placeHoder:options.input
      })
      that.getRightAticle();
  },

  //根据输入内容 获取 对应的文章
  getRightAticle(){
    let that=this;
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          num:"Findarticles",
          inputContent:this.data.inputContent
        }
      })
      .then(res=>{
        console.log("匹配成功",res.result.data);
        that.setData({
          article:res.result.data
        })
      })
      .catch(err=>{
        console.log("匹配失败",err);
      })

  },
  //跳转 文章详情页
  goArticleXQ(e){
    console.log("跳转文章id",e.currentTarget.dataset._id);
    wx.navigateTo({
      url: '../ArticleXQ/ArticleXQ?_id='+e.currentTarget.dataset._id,
    })
  },
 
  //获取输入的内容
  getinput(e){
    let that=this;  
    console.log("输入内容为",e.detail.value);
      that.setData({
        inputContent:e.detail.value,
      })
      console.log("data中输入的内容",that.data.inputContent);
      
  },
  //搜素
  goSearchXQ(){
    let that=this;
    that.setData({
      placeHoder:that.data.inputContent
    })
    that.getRightAticle();
  },

})