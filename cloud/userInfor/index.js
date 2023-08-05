// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境


// 云函数入口函数
exports.main = async (event, context) => {
  //获取用户唯一的_openid
  if(event.num=="getUserOpenid"){
    const {OPENID,APPID,UNIONID,ENV,} = cloud.getWXContext()
    return {OPENID,APPID,UNIONID,ENV,}
  }
  //添加新用户
  if(event.num=="addUser"){ 
    return cloud.database().collection('user')
    .add({
      data:{
        _openid:event._openid,//用户唯一标识
        userType:0,//用户类型
        userImage:event.userInfo.avatarUrl,//头像
        userName:event.userInfo.nickName,//用户名
        userSex:0,//性别
        userAdress:'',//地址
        userText:'这个人什么都没写',//人生格言
        trueName:'',//真实姓名
        trueID:'',//身份证号
        truePhone:'',//手机号
        orAttestation:false,//是否实名认证
        CustomerPhone:null,//客服电话 商家用户
      }
    })
  }
  //删除用户信息
  if(event.num=="deleatUser"){

  }
  //更新用户信息
  if(event.num=="updataUser"){

  }
  //查询用户信息
  if(event.num=="findUser"){
    
  }
}