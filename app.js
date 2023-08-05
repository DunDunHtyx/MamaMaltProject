// app.js
App({
  //云开发环境配置
  onLaunch() {
    //配置云开发环境
    console.log("小程序开始启动");
    wx.cloud.init({
        env: 'cloudeone-8g7tsimf3400c427'
      }) 

      //调用云函数 获取用户唯一的openID
      // wx.cloud.callFunction({
      //   name: 'userInfor',
      //   data: {
      //     num: 'getUserOpenid'
      //   },
      //   success: res => {
          //获取用户openid
          // this.globalData.user_openid = res.result.OPENID
          //判断是否已经注册登陆过
      //     wx.cloud.database().collection('user').where({
      //         _openid: res.result.OPENID
      //       })
      //       .get()
      //       .then(res => {
      //         console.log("判断是否已经注册登陆", res.data[0]);
      //         this.globalData.userInfo = res.data[0]
      //       })
      //       .catch(err => {
      //         console.log("判断失败", err);
      //       })
      //   },
      //   fail: err => {
      //     console.log("用户openid失败", err);
      //   }
      // }),

      //获取设备信息
      // wx.getSystemInfo({
      //   success:(res=>{
      //     this.globalData.deviceInfo=res;
      //   })
      // })

  
  },


  globalData: {
    //用户openid
    user_openid: '',
    //用户信息
    userInfo: null,
    //设备信息
    deviceInfo:[],
  }

})
