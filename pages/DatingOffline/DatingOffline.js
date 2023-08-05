var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navScrollLeft: 0, //设置横向滚动条位置
    currentNav: 0, //选项下标
    navData: [],
    scrollViewHeight:'',//计算后的可用高度
    showAdress:"活动地址",//显示的选择地址
    PassAdress:'全国',
    showType:"活动类型",//显示活动类型
    PassType:'全部类型',
    activeArray:["全部类型","个人活动","商家活动"],//活动类型
    PublicActiveType:0,//发布的活动类型 0个人组织 1商家活动
    activityInfor:[],//存放后台活动信息
    showActitityInfo:[],//展示活动信息
    PassTable:"发现",
    goActivityId:'',//跳转活动详情页id
    swiperImage:'',//轮播图
    userInfor:'',//用户基本信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("用户账号openID",app.globalData.user_openid);
    this.getRightHeight();
    //获取活动信息
    this.getActivity();
    //获取滚动条项
    this.getTable();
    //获取轮播图
    this.getSwiper();
    //获取用户基本信息
    this.getUserInfor();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //获取用户信息
  getUserInfor(){
    let that=this;
    console.log("用户openID",app.globalData.user_openid);
    wx.cloud.database().collection('user')
    .where({
      _openid:app.globalData.user_openid
    })  
    .get()
    .then(res=>{
      console.log("用户信息获取成功",res.data[0]);
      that.setData({
        userInfor:res.data[0]
      })
      console.log("data的userInfor",that.data.userInfor.orAttestation);
    })
    .catch(err=>{
      console.log("用户信息获取失败",err);
    })
  },
  //获取可使用的高度
  getRightHeight() {
    let that=this;
    let query = wx.createSelectorQuery().in(this);
    query.select('#lunBox').boundingClientRect();
    query.select('#jingcaiBox').boundingClientRect();
    query.exec((res) => {
      let navbarHeight = res[0].height;
      let headerHeight = res[1].height;
      let scrollViewHeight = app.globalData.deviceInfo.windowHeight - navbarHeight - headerHeight;
      console.log("计算后可用长度",scrollViewHeight);
      that.setData({
        scrollViewHeight:scrollViewHeight
      })
    })
  },

  //获取广告轮播图信息
  getSwiper(){
    let that=this;
    wx.cloud.database().collection('carousel')
    .get()
    .then(res=>{
      // console.log("轮播图获取成功",res.data);
      that.setData({
        swiperImage:res.data
      })
      // console.log("data中轮播图",that.data.swiperImage);
    })  
    .catch(err=>{
      console.log("轮播图获取失败",err);
    })
  },
  //去指定活动
  goDesignateActivity(e){
    console.log("推荐活动ID",e.currentTarget.dataset.activityid);
    wx.navigateTo({
      url: '../OfficialActivityXQ/OfficialActivityXQ?activityID='+e.currentTarget.dataset.activityid,
    })
  },
  //获取 选择的地点 
  getAddress(e){
    let that=this;
    console.log("获取的地点",e.detail.value);
    console.log("显示地点",e.detail.value[2]);
    that.setData({
      showAdress:e.detail.value[2],
      PassAdress:e.detail.value[0]+"-"+e.detail.value[1]+"-"+e.detail.value[2],
    })
    //筛选活动内容
    that.getChooseActive();
  },


//获取 选择的 活动类型
getActiveType(e){
  let that=this;
  console.log("活动类型",e.detail.value);
  if(e.detail.value==0){
    that.setData({
      showType:"全部类型",
      PassType:'全部类型',
    })
    //搜素 筛选 活动信息
    that.getChooseActive();
  }else if(e.detail.value==1){
    that.setData({
      showType:"个人活动",
      PassType:'个人活动',
    })
    //筛选 活动信息
    that.getChooseActive();
  }else if(e.detail.value==2){
    that.setData({
      showType:"商家活动",
      PassType:'商家活动',
    })
    //筛选 活动信息
    that.getChooseActive();
  }
},


//获取 筛选后的活动内容
getChooseActive(){
  let that=this;
  console.log("活动地址选择",that.data.PassAdress);
  console.log("活动类型选择",that.data.PassType);
  console.log("滑动栏选择",that.data.PassTable);
  wx.cloud.callFunction({
    name:'getDate',
    data:{
      num:"getChooseActive",
      type:that.data.PassType,
      addres:that.data.PassAdress,
      Table:that.data.PassTable
    }
  })
  .then(res=>{
    console.log("showActitityInfo活动信息筛选成功",res.result.data);
    that.setData({
      showActitityInfo:res.result.data
    })
  })
  .catch(err=>{
    console.log("活动信息筛选失败",err);
  })
},


//从后台获取活动信息
getActivity(){
  let that=this;
    wx.cloud.callFunction({
      name:'getDate',
      data:{
        num:'getActive'
      }
    })
    .then(res=>{
      console.log("showActitityInfo活动信息获取成功",res.result.data);
      that.setData({
        activityInfor:res.result.data,
        showActitityInfo:res.result.data
      })
    })
    .catch(err=>{
      console.log("活动信息获取失败",err);
    })
},


//获取 滚动条 选项内容
getTable(){
  let that=this;
    wx.cloud.callFunction({
      name:'getDate',
      data:{
        num:"getGunDonItem"
      }
    })
    .then(res=>{
      console.log("滚动条项获取成功",res.result.data);
      that.setData({
        navData:res.result.data
      })
    })
    .catch(err=>{
      console.log("滚动条项获取失败",err);
    })
},


 //滚动选择框 点击事件 
 switchNav(e) {
   let that=this;
  console.log("滚动",e.currentTarget.dataset.current);
  let cur=e.currentTarget.dataset.current;
  console.log("滚动姓名",that.data.navData[cur].name);
  if(this.data.currentNav == cur){
    return false;
  }else{
    this.setData({
      currentNav: cur,
      PassTable:that.data.navData[cur].name
    })
    that.getChooseActive();
  }
},

//跳转到精彩瞬间
goJingCai(){
  wx.navigateTo({
    url:"../WonderfulMoments/WonderfulMoments"
  })
},

//获取 某活动具体信息
getActiveDetail(){
  let that=this;
    wx.cloud.callFunction({
      name:'getDate',
      data:{
        num:'getActivityDetail',
        id:that.data.goActivityId
      }
    })
    .then(res=>{
      console.log("活动详细内容获取成功",res.result.data[0]);
      console.log("需跳转活动类型",res.result.data[0].activityType);
      if(res.result.data[0].activityType==0){ //个人组织
        wx.navigateTo({
          url: '../PersonalActivityXQ/PersonalActivityXQ?activityID='+that.data.goActivityId,
        })
      }else if(res.result.data[0].activityType==1){ //商家活动
        wx.navigateTo({
          url: '../OfficialActivityXQ/OfficialActivityXQ?activityID='+that.data.goActivityId,
        })
      }
    })
    .catch(err=>{
      console.log("活动详细内容获取失败",err);
    })
},

//跳转 活动详情页
goAticleXQ(e){
  let that=this;
  console.log("活动ID",e.currentTarget.dataset.id);
  that.setData({
    goActivityId:e.currentTarget.dataset.id
  })
  that.getActiveDetail();
},

//添加个人活动
addActives(){
  let that=this;
  console.log("查看用户是否实名认证过",that.data.userInfor.orAttestation);
  if(that.data.userInfor.orAttestation==false){
    wx.showToast({
      icon:'none',
      title: '您未实名认证，无法发布活动',
    })
  }else{
 wx.navigateTo({
    url: '../PublishActivity/PublishActivity?ActID=-999',
  })
  }
}
})