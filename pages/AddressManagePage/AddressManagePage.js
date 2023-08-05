// pages/AddressManagePage/AddressManagePage.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '', //用户openID
    receiptAddress: [], //已添加的地址管理信息        
    defaultAddressID: '', //默认地址ID             
    showDefaultAddressID: '', //显示默认地址ID   
    defaultAddressInfo:[],//默认地址信息    
    goGoodID:'',//要选择地址的商品ID    
    
    //-----------
    type:'',// type==2  商品修改地址   type ==1  我的页面跳转
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that = this;
    console.log("页面跳转类型",e.type);
    console.log("跳转的商品ID",e.GoodID);
    if(e.type==1){  //我的页面跳转
      that.setData({
        type:e.type,
        userID: app.globalData.user_openid,
      })
      //获取当前用户的已经添加的地址信息
      that.getReceiptAddressInfo();
    }else if(e.type==2){ //商品修改地址
      // console.log("当前用户ID",app.globalData.user_openid);
      that.setData({
        userID: app.globalData.user_openid,
        goGoodID:e.GoodID,
        type:e.type
      })
      //获取当前用户的已经添加的地址信息
      that.getReceiptAddressInfo();
    }
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
      let that=this;
      that.getReceiptAddressInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
      let that=this;
      console.log("上拉触底了");
      //获取已存在的地址信息
      that.getReceiptAddressInfo();
  },

  //勾选默认地址选项
  onChange(e) {
    let that=this;
    console.log("勾选了", e.currentTarget.dataset.id);
    that.setData({
      showDefaultAddressID:e.currentTarget.dataset.id
    })
    //更新默认地址选项
    that.UpdataDefaultAddress();
  },

  //更新默认地址选项
  UpdataDefaultAddress() {
    let that = this;
    console.log("默认显示",that.data.defaultAddressInfo);
    console.log("默认显示userID",that.data.defaultAddressInfo.userID);
    console.log("userID",app.globalData.user_openid);
    if (that.data.defaultAddressInfo.userID == app.globalData.user_openid) {
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          num:'updateDefaultAddress',
          _id:that.data.defaultAddressInfo._id,
          userID:app.globalData.user_openid,
          ReceiptID:that.data.showDefaultAddressID,
        }
      })
      .then(res=>{
        console.log("默认地址修改成功",res);
      })
      .catch(err=>{
        console.log("默认地址修改失败",err);
      })
    } else if (that.data.defaultAddressInfo.userID != app.globalData.user_openid) {
        wx.cloud.database().collection('ReceiptDefault')
        .add({
          data:{
            ReceiptID:that.data.showDefaultAddressID,
            userID:app.globalData.user_openid
          }
        })
        .then(res=>{
          console.log("添加默认地址成功",res);
        })
        .catch(err=>{
          console.log("添加默认地址失败",err);
        })
    }
  },

  //获取已添加的收货地址信息
  getReceiptAddressInfo() {
    let that = this;
    // console.log("用户ID", that.data.userID);
    console.log("当前receiptAddress长度",that.data.receiptAddress.length);
    let len=that.data.receiptAddress.length;
    wx.cloud.database().collection('ShippingAddress')
      .where({
        userID: that.data.userID
      })
      .skip(len)
      .orderBy('_id','desc')
      .get()
      .then(res => {
        console.log("已经添加的收货信息获取成功", res.data);
        that.setData({
          receiptAddress:that.data.receiptAddress.concat(res.data)
        })
        that.getDefaultAddress();
      })
      .catch(err => {
        console.log("已经添加的收货信息获取失败", err);
      })
  },
  //获取默认的地址
  getDefaultAddress() {
    let that = this;
    wx.cloud.database().collection('ReceiptDefault')
      .where({
        userID: that.data.userID
      })
      .get()
      .then(res => {
        console.log("默认地址管理信息获取成功", res.data[0]);
        that.setData({
          defaultAddressInfo:res.data[0],
          defaultAddressID: res.data[0].ReceiptID,
          showDefaultAddressID: res.data[0].ReceiptID
        })
      })
      .catch(err => {
        console.log("默认地址管理信息获取失败", err);
      })
  },

  //跳转新增地址页
  goNewAddressPage() {
    wx.navigateTo({
      url: '../newAddressPage/newAddressPage?ID=-999',
    })
  },

  //跳转修改地址页
  GoUpdateReceipt(e){
    console.log("要修改的地址ID",e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../newAddressPage/newAddressPage?ID='+e.currentTarget.dataset.id,
    })
  },
  //删除地址页
  DeleateReceipt(e){
    let that=this;
    console.log("要删除的地址ID",e.currentTarget.dataset.id);
      wx.showModal({
        title: '提示',
        content: '您真的要删除该地址信息吗',
        complete: (res) => {
          if (res.cancel) {
            console.log("点击了取消");
          }
          if (res.confirm) {
              console.log("点击了确认");
              wx.showLoading({
                title: '删除中',
              })
              if(that.data.showDefaultAddressID==e.currentTarget.dataset.id){
                  wx.showToast({
                    icon:'error',
                    title: '取消默认再删除',
                  })
              }else{
                wx.cloud.callFunction({
                  name:'getDate',
                  data:{
                    num:'removeReceiptAddress',
                    id:e.currentTarget.dataset.id,
                    userID:app.globalData.user_openid,
                  }
                })
                .then(res=>{
                  console.log("删除成功",res);
                  wx.hideLoading();
                  that.setData({
                    receiptAddress:[]
                  })
                  that.onPullDownRefresh();
                })
                .catch(err=>{
                  console.log("删除失败",err);
                })
              }
          }
        }
      })
  },

  //选择收货地址
  choiceReceiptAddress(e){
    let that=this;
    if(that.data.type==2){
      console.log("收货地址ID",e.currentTarget.dataset.id);
      wx.redirectTo({
        url:'../OldGoodsPay/OldGoodsPay?AddressID='+e.currentTarget.dataset.id+'&oldGoodsID='+that.data.goGoodID,
      })
    }
  }



})