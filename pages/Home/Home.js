// pages/Home/Home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendArticle:[],//推荐文章内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let that=this;
      that.getRecommendArticle();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },



  //获取输入的内容
  getSearch(){
    wx.navigateTo({
      url: '../Search/Search',
    })
  },

  //跳转 奶粉溯源
  goMilk(){
    wx.navigateToMiniProgram({
      appId: 'wxbcef86ac3af4693f',
      success(res) {
        console.log("奶粉溯源小程序打开成功",res);
      },
      fail(err){
        console.log("奶粉溯源小程序打开失败",err);
      }
    })
  },
  //跳转 疫苗表
  goVaccine(){
      wx.navigateTo({
        url: '../VaccineTable/VaccineTable',
      })
  },
  //跳转 能不能吃
  goEate(){
    wx.navigateTo({
      url: '../OrEat/OrEat',
    })
  },
//获取 推荐文章
  getRecommendArticle(){
    let that=this;
    wx.cloud.database().collection('article')
    .where({
      articleType:0
    })
    .get()
    .then(res=>{
      console.log("推荐视频内容获取成功",res.data);
      that.setData({
        recommendArticle:res.data[0]
      })
      console.log("data中推荐内容",that.data.recommendArticle);
    })
    .catch(err=>{
      console.log("推荐视频获取失败",err);
    })
  },
  //跳转 推荐文章
  ArticleXQ(e){
    console.log("文章",e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../ArticleXQ/ArticleXQ?_id='+e.currentTarget.dataset.id,
    })
  }
})