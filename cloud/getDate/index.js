// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.num == "vaccine") {
    return cloud.database().collection('vaccine').get()
  }
  if (event.num == "OrEat") {
    return cloud.database().collection('notEat').get()
  }
  if (event.num == "fineSelectOrEat") {
    if (event.type == 0) { //孕期
      return cloud.database().collection('notEat').where({
          pregnantEatType: event.number
        })
        .get()
    } else if (event.type == 1) { //月子
      return cloud.database().collection('notEat').where({
          confinedEatType: event.number
        })
        .get()
    } else if (event.type == 2) { //哺乳期
      return cloud.database().collection('notEat').where({
          lactationEatType: event.number
        })
        .get()
    } else if (event.type == 3) { //宝宝
      return cloud.database().collection('notEat').where({
          babyEattype: event.number
        })
        .get()
    }
  }
  if (event.num == "Findarticles") {
    return cloud.database().collection('article').where({
        articleTitle: cloud.database().RegExp({
          regexp: event.inputContent,
          options: 'm'
        })
      })
      .get()
  }
  //取消点赞
  if (event.num == "removeDainzan") {
    cloud.database().collection('DianZan')
      .where({
        articleID: event.articleID,
        userID: event.userID,
        type: event.type
      })
      .remove()
  }
  //添加点赞
  if (event.num == "addDianzan") {
    cloud.database().collection("DianZan")
      .add({
        data: {
          articleID: event.articleID,
          userID: event.userID,
          type: event.type
        }
      })
  }
  //取消 收藏
  if (event.num == "removeShoucang") {
    cloud.database().collection("ShouCang")
      .where({
        articleID: event.articleID,
        userID: event.userID,
        type: event.type
      })
      .remove()
  }
  //添加收藏
  if (event.num == "addShoucang") {
    cloud.database().collection("ShouCang")
      .add({
        data: {
          articleID: event.articleID,
          userID: event.userID,
          type: event.type
        }
      })
  }
  //更新文章内容
  if (event.num == "updateArticle") {
    cloud.database().collection("article")
      .where({
        _id: event.articleID
      })
      .update({
        data: {
          collectionNumber: event.shoucangNumber,
          DianZanNumber: event.dianzanNumber
        }
      })
  }

  // 更新精彩瞬间内容
  if (event.num == "updateWonder") {
    cloud.database().collection("WonderfulMoments")
      .where({
        _id: event.articleID
      })
      .update({
        data: {
          shoucang: event.shoucangNumber,
          dianzan: event.dianzanNumber
        }
      })
  }


  //添加评论内容
  if (event.num == "addCommend") {
    cloud.database().collection('comments')
      .add({
        data: {
          articleID: event.articleID,
          content: event.content,
          pubshTime: event.pubshTime,
          userID: event.userID,
          avater: event.avater,
          userName: event.userName,
          type: event.type
        }
      })
  }
  //删除评论内容
  if (event.num == "removeCommend") {
    return cloud.database().collection('comments')
      .where({
        _id: event.id,
        type: event.type
      })
      .remove()
  }
  //获取评论内容
  if (event.num == "getCommend") {
    return cloud.database().collection('comments')
      .where({
        articleID: event.articleID,
        type: event.type
      })
      .get()
  }
  //添加历史记录
  if (event.num == "addHistory") {
    return cloud.database().collection('history')
      .add({
        data: {
          articleID: event.articleID,
          time: event.time,
          userID: event.userID,
          type: event.type
        }
      })
  }
  //获取 用户的搜素记录
  if (event.num == "getSearchHistory") {
    return cloud.database().collection('searchHistory')
      .where({
        userID: event.userID
      })
      .get()
  }
  //根据 用户ID 搜素内容 查看是否有该条 搜素记录
  if (event.num == "findSearchHistory") {
    return cloud.database().collection('searchHistory')
      .where({
        userID: event.userID,
        searchName: event.searchName
      })
      .get()
  }
  //添加搜素历史记录
  if (event.num == "addSearchHistory") {
    return cloud.database().collection('searchHistory')
      .add({
        data: {
          searchName: event.searchName,
          userID: event.userID
        }
      })
  }
  //清空搜素历史记录
  if (event.num == "removeSearchHistory") {
    return cloud.database().collection('searchHistory')
      .where({
        userID: event.userID
      })
      .remove()
  }
  //获取活动信息
  if (event.num == "getActive") {
    return cloud.database().collection('activity')
      .get()
  }

  //筛选活动类型
  if (event.num == "getChooseActive") {
    if (event.Table == "发现") {
      if (event.addres == "全国") { //发现 全国
        if (event.type == "全部类型") { //发现 全国  全部类型
          return cloud.database().collection('activity')
            .get()
        } else if (event.type == "个人活动") { //发现 全国 个人活动
          return cloud.database().collection('activity')
            .where({
              activityType: 0
            })
            .get()
        } else if (event.type == "商家活动") { //发现 全国 商家活动
          return cloud.database().collection('activity')
            .where({
              activityType: 1
            })
            .get()
        }
      } else { //发现 某区
        if (event.type == "全部类型") { //发现 某区 全部类型
          return cloud.database().collection('activity')
            .where({
              activityAddress: event.addres,
            })
            .get()
        } else if (event.type == "个人活动") { //发现 某区 个人活动
          return cloud.database().collection('activity')
            .where({
              activityAddress: event.addres,
              activityType: 0,
            })
            .get()
        } else if (event.type == "商家活动") { //发现 某区 商家活动
          return cloud.database().collection('activity')
            .where({
              activityAddress: event.addres,
              activityType: 1
            })
            .get()
        }
      }
    } else { //某项 
      if (event.addres == "全国") { //某项 全国
        if (event.type == "全部类型") { //某项 全国 全部类型
          return cloud.database().collection('activity')
            .where(cloud.database().command.and([{ //滚动项
              activityTitle: cloud.database().RegExp({
                regexp: event.Table,
                options: 'i'
              })
            }, ]))
            .get()
        } else if (event.type == "个人活动") { //某项 全国 个人活动
          return cloud.database().collection('activity')
            .where(cloud.database().command.and([{ //滚动框
                activityTitle: cloud.database().RegExp({
                  regexp: event.Table,
                  options: 'i'
                })
              },
              { //活动类型
                activityType: cloud.database().RegExp({
                  regexp: 0,
                  options: "i",
                })
              }
            ]))
            .get()
        } else if (event.type == "商家活动") { //某项 全国 商家活动
          return cloud.database().collection('activity')
            .where(cloud.database().command.and([{ //滚动框
                activityTitle: cloud.database().RegExp({
                  regexp: event.Table,
                  options: "i"
                })
              },
              { //活动类型
                activityType: cloud.database().RegExp({
                  regexp: 1,
                  options: "i"
                })
              }
            ]))
            .get();
        }
      } else { //某项 某区
        if (event.type == "全部类型") { //某项 某区 全部类型
          return cloud.database().collection('activity')
            .where(cloud.database().command.and([{ //滚动框
                activityTitle: cloud.database().RegExp({
                  regexp: event.Table,
                  options: 'i'
                })
              },
              { // 活动地址
                activityAddress: cloud.database().RegExp({
                  regexp: event.addres,
                  options: 'i'
                })
              },
            ]))
            .get()
        } else if (event.type == "个人活动") { //某项 某区 个人活动
          return cloud.database().collection('activity')
            .where(cloud.database().command.and([{ //滚动框
                activityTitle: cloud.database().RegExp({
                  regexp: event.Table,
                  options: 'i'
                })
              },
              { //活动地址
                activityAddress: cloud.database().RegExp({
                  regexp: event.addres,
                  options: 'i'
                })
              },
              { //活动类型
                activityType: cloud.database().RegExp({
                  regexp: 0,
                  options: 'i'
                })
              }
            ]))
            .get()
        } else if (event.type == "商家活动") { //某项 某区 商家活动
          return cloud.database().collection('activity')
            .where(cloud.database().command.and([{ //滚动栏
                activityTitle: cloud.database().RegExp({
                  regexp: event.Table,
                  options: 'i'
                })
              },
              { //活动地址
                activityAddress: cloud.database().RegExp({
                  regexp: event.addres,
                  options: 'i'
                })
              },
              { //活动类型
                activityType: cloud.database().RegExp({
                  regexp: 1,
                  options: 'i'
                })
              }
            ]))
            .get()
        }
      }

    }
  }


  //获取 约线下 滚动选择框 选项
  if (event.num == "getGunDonItem") {
    return cloud.database().collection('activeTable')
      .get()
  }

  //获取 约线下 某活动 具体信息
  if (event.num == "getActivityDetail") {
    return cloud.database().collection('activity')
      .where({
        _id: event.id
      })
      .get()
  }

  //获取 约线下 活动所有标签
  if (event.num == "getofflineLabel") {
    return cloud.database().collection('offlineLabel')
      .get()
  }

  //获取 约线下 官方活动的 票种和票价 和 时间
  if (event.num == "getTicketInfor") {
    return cloud.database().collection('ticketInformation')
      .where({
        activityID: event.ID
      })
      .get()
  }



  //点击 核销按钮 核销订单
  if (event.num == "VerificationOrder") {
    return cloud.database().collection("booking")
      .where({
        _id: event._id,
      })
      .update({
        data: {
          VerificationTime: event.VerificationTime, //核销时间
          orVerification: event.orVerification, //已核销
          FinalVerification: event.AccountID, //最终核销人账号
        }
      })
      .then(res => {
        console.log("核销成功", res);
      })
      .catch(err => {
        console.log("核销失败", err);
      })
  }


  //添加个人活动
  if (event.num == "addPersonalActivities") {
    return cloud.database().collection('activity')
      .add({
        data: {
          activityAddress: event.activityAddress, //活动大概地址
          activityDate: event.activityDate, //活动日期
          activityImage: event.activityImage, //活动照片
          activityOverview: event.activityOverview, //活动简要
          activityPublishTime: event.activityPublishTime, //活动发布时间
          activityRequest: event.activityRequest, //活动详细要求
          activityState: event.activityState, //活动状态 正在报名 0
          activityTitle: event.activityTitle, //活动标签
          activityToTalAddress: event.activityTotalAddress, //活动详细地址
          activityType: event.activityType, //活动类型 个人活动 0
          comeNumber: event.comeNumber, //参加人数 无用
          userInfo: event.userInfo, //发布者信息
          userInforID: event.userInforID, //发布者账号ID
          ScanCode: event.ScanCode, //授权核销账号  无用
          activityTheme: event.activityTheme, //活动主图 无用
          swiperImage: event.swiperImage, //宣传照轮播图 无用
          AlreadyRegisteNumred: event.AlreadyRegisteNumred, //已报名人数 无用
          activityEndTime: event.activityEndTime //活动结束时间 无用
        }
      })
  }

  //实名认证 更新用户信息
  if (event.num == "realNameAttestation") {
    return cloud.database().collection('user')
      .where({
        _openid: event.userOpenID
      })
      .update({
        data: {
          trueID: event.trueID, //身份证号
          trueName: event.trueName, //真实姓名
          orAttestation: true, //实名状态
          truePhone: event.truePhone, //手机号
          userAdress: event.userAdress, //用户居住地址
          userDetailAddress: event.userDetailAddress, //用户详细地址
        }
      })
  }

  //更新预约票数
  if (event.num == "UpdateTicketNumber") {
    return cloud.database().collection('ticketInformation')
      .where({
        _id: event._id, //票档信息ID
        activityID: event.activityID, //预约活动ID
        ticketTime: event.ticketTime, //预约票档时间
        'ticketType.ticketName': event.ticketName, //预定票名
      })
      .update({
        data: {
          'ticketType.$.sellingState': event.sellingState,
          'ticketType.$.soldNumber': event.nowTicketNumber + event.buyNumber
        }
      })
  }

  //添加 精彩瞬间
  if (event.num == "addWonderfulMoments") {
    return cloud.database().collection('WonderfulMoments')
      .add({
        data: {
          ActImage: event.ActImage, //活动照片
          ActName: event.ActName, //活动主题
          ActPrtice: event.ActPrtice, //活动价格
          Images: event.Images, //照片
          PubAvater: event.PubAvater, //发布者头像
          PubNickname: event.PubNickname, //发布者昵称 
          PublicerID: event.PublicerID, //发布者openID
          PublishTime: event.PublishTime, //发布时间
          RelationalActivityID: event.RelationalActivityID, //关联活动ID
          dianzan: event.dianzan, //点赞数 
          shoucang: event.shoucang, //收藏数
          wonderContent: event.wonderContent, //富文本内容
        }
      })
  }

  //更新 个人活动发布页 的内容
  if (event.num == "UpdatePersonalAct") {
    return cloud.database().collection('activity')
      .where({
        _id: event.ID, //活动ID
        userInforID: event.userID, //发布活动用户ID
      })
      .update({
        data: {
          activityAddress: event.activityAddress, //活动大概地址 
          activityDate: event.activityDate, //活动日期
          activityImage: event.activityImage, //活动照片
          activityOverview: event.activityOverview, //活动简要
          activityPublishTime: event.activityPublishTime, //活动发布时间
          activityRequest: event.activityRequest, //活动详细要求
          activityState: event.activityState, //活动状态
          activityTitle: event.activityTitle, //活动标签
          activityToTalAddress: event.activityToTalAddress, //活动详细地址
          activityType: 0, //活动类型  个人活动
          comeNumber: null, //活动参加人数 (无用)
          userInfo: event.userInfo, //发布者 基本信息
          userInforID: event.userInforID, //活动发布者 openID
          ScanCode: null, //活动核销码 (无用)
          activityTheme: null, //活动主题(无用)
          swiperImage: null //活动宣传照轮播图 (无用)
        }
      })
  }

  // 删除 个人活动发布页 的内容
  if (event.num == "DeletePersonalAct") {
    return cloud.database().collection('activity')
      .where({
        _id: event.ID, //活动ID
        userInforID: event.userID, //发布活动用户ID
      })
      .remove()
  }

  var $ = cloud.database().command.aggregate
  // 线下活动 查看 全部参加活动信息  三表联查 操作
  if (event.num == "UnderActConnectedTable") {
    return cloud.database().collection('booking').aggregate()
      .match({
        BookUserId: event.BookUserId
      })
      .skip(event.len)
      .sort({
        bookTime: -1
      })
      .lookup({
        from: "activity",
        localField: "activityID",
        foreignField: "_id",
        as: "ABooking"
      })
      .lookup({
        from: "ticketInformation",
        localField: "matchesID",
        foreignField: "_id",
        as: "TBooking"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$ABooking', 0]), $.arrayElemAt(['$TBooking', 0]), '$$ROOT'])
      })
      .project({
        ABooking: 0,
        TBooking: 0
      })
      .end()
  }

  // 线下活动 待付款 可使用 参加活动信息  三表联查 操作
  if (event.num == "UnderActConnectedTableDetail") {
    return cloud.database().collection('booking').aggregate()
      .match({
        BookUserId: event.BookUserId,
        orPayState: event.orPayState
      })
      .skip(event.len)
      .lookup({
        from: "activity",
        localField: "activityID",
        foreignField: "_id",
        as: "ABooking"
      })
      .lookup({
        from: "ticketInformation",
        localField: "matchesID",
        foreignField: "_id",
        as: "TBooking"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$ABooking', 0]), $.arrayElemAt(['$TBooking', 0]), '$$ROOT'])
      })
      .project({
        ABooking: 0,
        TBooking: 0
      })
      .sort({
        bookTime: -1
      })
      .end()
  }

  // 取消订单
  //更新预约票数
  if (event.num == "deletOrderBooking") {
    return cloud.database().collection('booking')
      .where({
        _id: event._id, //订单ID
        BookUserId: event.BookUserId, //订单发起者
      })
      .remove()
  }

  //获取 旧物置换 滚轮栏 滚动项
  if (event.num == "getScrollItem") {
    return cloud.database().collection('OldThingsReplacement')
      .get()
  }


  var $ = cloud.database().command.aggregate
  // 旧物置换商品查询  旧物置换+发布者 链表操作  +排序+成色
  if (event.num == "GetOldCommodities") {
    return cloud.database().collection('OldCommodities').aggregate()
      .match({ //筛选 成色商品
        quality: event.quality, //成色  number
        oldGoodType: event.oldGoodType, //商品类型  number
        goodState: 0 //在售 number
      })
      .skip(event.len)
      .lookup({
        from: "user",
        localField: "businessID",
        foreignField: "_openid",
        as: "busserInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$busserInfo', 0]), '$$ROOT'])
      })
      .project({
        busserInfo: 0
      })
      .sort({
        goodPrtice: event.choiseSort
      })
      .end()
  }


  var $ = cloud.database().command.aggregate
  //旧物置换商品查询  旧物置换+发布者 链表操作 
  if (event.num == "GetAllOldCommodities") {
    return cloud.database().collection('OldCommodities').aggregate()
      .match({ //筛选 成色商品
        oldGoodType: event.oldGoodType, //商品类型  number
        goodState: 0 //在售 number
      })
      .skip(event.len)
      .lookup({
        from: "user",
        localField: "businessID",
        foreignField: "_openid",
        as: "busserInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$busserInfo', 0]), '$$ROOT'])
      })
      .project({
        busserInfo: 0
      })
      .sort({
        goodPrtice: event.choiseSort
      })
      .end()
  }




  var $ = cloud.database().command.aggregate
  //模糊搜索  旧物置换搜索功能  +排序+成色
  if (event.num == "searchOldGoods") {
    return cloud.database().collection('OldCommodities')
      .aggregate()
      .match(cloud.database().command.and([{ //搜索内容
          goodDescribe: cloud.database().RegExp({
            regexp: event.searchContent,
            options: 'i'
          })
        },
        { //成色
          quality: cloud.database().RegExp({
            regexp: event.quality,
            options: 'i'
          })
        }
      ]))
      .skip(event.len)
      .lookup({
        from: "user",
        localField: "businessID",
        foreignField: "_openid",
        as: "busserInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$busserInfo', 0]), '$$ROOT'])
      })
      .project({
        busserInfo: 0
      })
      .sort({
        goodPrtice: event.choiseSort
      })
      .end()
  }




  //模糊搜索  旧物置换搜索功能
  if (event.num == "searchAllOldGoods") {
    return cloud.database().collection('OldCommodities')
      .aggregate()
      .match({
        goodDescribe: cloud.database().RegExp({
          regexp: event.searchContent,
          options: 'i'
        })
      })
      .skip(event.len)
      .lookup({
        from: "user",
        localField: "businessID",
        foreignField: "_openid",
        as: "busserInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$busserInfo', 0]), '$$ROOT'])
      })
      .project({
        busserInfo: 0
      })
      .sort({
        goodPrtice: event.choiseSort
      })
      .end()
  }

  //获取旧物置换商品具体信息
  if (event.num == "getDetailOldGoodInfo") {
    return cloud.database().collection('OldCommodities')
      .aggregate()
      .match({
        _id:event.Id
      })  
      .lookup({
        from: "user",
        localField: "businessID",
        foreignField: "_openid",
        as: "busserInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$busserInfo', 0]), '$$ROOT'])
      })
      .project({
        busserInfo: 0
      })
      .end()
  }


  //更新默认地址
  if (event.num == "updateDefaultAddress") {
    cloud.database().collection("ReceiptDefault")
      .where({
        _id:event._id,
        userID:event.userID
      })
      .update({
        data:{
          ReceiptID:event.ReceiptID
        }
      })
  }

   //更新收货地址
   if (event.num == "updateReceiptAddress") {
    cloud.database().collection("ShippingAddress")
      .where({
        _id:event._id,
        userID:event.userID
      })
      .update({
        data:{
          ReceiptAddress:event.ReceiptAddress,
          ReceiptDetailAddress:event.ReceiptDetailAddress,
          ReceiptName:event.ReceiptName,
          ReceiptPhone:event.ReceiptPhone
        }
      })
  }

  //添加收货地址
  if (event.num == "addReceiptAddress") {
    cloud.database().collection("ShippingAddress")
    .add({
      data:{
        ReceiptAddress:event.ReceiptAddress , //地区
        ReceiptDetailAddress:event.ReceiptDetailAddress, //详细地址
        ReceiptName:event.ReceiptName, //收货人
        ReceiptPhone:event.ReceiptPhone, //电话号
        userID:event.userID //用户ID
      }
    })
  }


   //删除收货地址
   if (event.num == "removeReceiptAddress") {
    cloud.database().collection("ShippingAddress")
    .where({
      _id:event.id,
      userID:event.ID,
    })
    .remove()
  }


  //获取默认地址信息 连表  默认收货+收货地址
  var $ = cloud.database().command.aggregate 
  if (event.num == "GetOneDefaultReceiptAddress") {
    return cloud.database().collection('ReceiptDefault').aggregate()
      .match({ //筛选 成色商品
        userID:event.userID
      })
      .lookup({
        from: "ShippingAddress",
        localField: "ReceiptID",
        foreignField: "_id",
        as: "ReceiptAddress"
      })
      .end()
  }


  //查看待付款商品订单信息  连表  商品购买情况+收货地址+商品信息+商家信息+买家信息
  if (event.num == "getWaitePayOrderInfo") {
    return cloud.database().collection('OldGoodsBuyState').aggregate()
      .match({
        _id:event.orderID
      })
      .lookup({ //商品信息
        from: "OldCommodities",
        localField: "oldGoodsID",
        foreignField: "_id",
        as: "OldGoodInfo"
      })
      .lookup({ //商家信息
        from: "user",
        localField: "SellerID",
        foreignField: "_openid",
        as: "busserInfo"
      })
      .lookup({ //地址信息
        from: "ShippingAddress",
        localField: "receiptAddressID",
        foreignField: "_id",
        as: "addressInfo"
      })
      .lookup({ //买家信息
        from: "user",
        localField: "BuyersID",
        foreignField: "_openid",
        as: "BuyersInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$OldGoodInfo', 0]), $.arrayElemAt(['$addressInfo', 0]), $.arrayElemAt(['$busserInfo', 0]),'$$ROOT'])
      })
      .project({
        OldGoodInfo: 0,
        addressInfo: 0,
        busserInfo:0,
      })
      .end()
  }

  //获取我发布的商品  商品信息  卖家信息 连表
  if (event.num == "getMyPublishOldGoodInfo") {
    if(event.orGetAll==true){  //查看全部
      return cloud.database().collection('OldCommodities').aggregate()
      .match({
        businessID:event.businessID
      })
      .skip(event.len)
      .lookup({ //卖家信息
        from: "user",
        localField: "businessID",
        foreignField: "_openid",
        as: "SellerInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([ $.arrayElemAt(['$SellerInfo', 0]), '$$ROOT'])
      })
      .project({
        SellerInfo: 0
      })
      .sort({
        goodPublishTime: -1
      })
      .end()
    }else{
      return cloud.database().collection('OldCommodities').aggregate()
      .match({
        businessID:event.businessID,
        goodState:event.goodState
      })
      .skip(event.len)
      .lookup({ //卖家信息
        from: "user",
        localField: "businessID",
        foreignField: "_openid",
        as: "SellerInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([ $.arrayElemAt(['$SellerInfo', 0]), '$$ROOT'])
      })
      .project({
        SellerInfo: 0
      })
      .sort({
        goodPublishTime: -1
      })
      .end()
    }
    }


  //获取我卖出的商品  商品信息  收货地址  买家信息  连表
  if (event.num == "getMySellOldGoodInfo") {
    if(event.orGetAll==true){  //查看全部 我卖出的商品信息
      return cloud.database().collection('OldGoodsBuyState').aggregate()
      .match({
        SellerID:event.SellerID
      })
      .skip(event.len)
      .lookup({ //商品信息
        from: "OldCommodities",
        localField: "oldGoodsID",
        foreignField: "_id",
        as: "OldGoodInfo"
      })
      .lookup({ //买家信息
        from: "user",
        localField: "BuyersID",
        foreignField: "_openid",
        as: "BuyerInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$OldGoodInfo', 0]), $.arrayElemAt(['$BuyerInfo', 0]), '$$ROOT'])
      })
      .project({
        OldGoodInfo: 0,
        BuyerInfo: 0
      })
      .sort({
        BuyTime: -1
      })
      .end()
    }else{
      return cloud.database().collection('OldGoodsBuyState').aggregate()
      .match({
        SellerID:event.SellerID,
        GoodsTransportState:event.GoodsTransportState
      })
      .skip(event.len)
      .lookup({ //商品信息
        from: "OldCommodities",
        localField: "oldGoodsID",
        foreignField: "_id",
        as: "OldGoodInfo"
      })
      .lookup({ //卖家信息
        from: "user",
        localField: "BuyersID",
        foreignField: "_openid",
        as: "BuyerInfo"
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$OldGoodInfo', 0]), $.arrayElemAt(['$BuyerInfo', 0]), '$$ROOT'])
      })
      .project({
        OldGoodInfo: 0,
        BuyerInfo: 0
      })
      .sort({
        BuyTime: -1
      })
      .end()
    }
    }


  //获取我买到的商品  商品信息  卖家信息 连表
if (event.num == "getMyBuyOldGoodInfo") {
  if(event.orGetAll==true){  //查看全部我买到的商品  
    return cloud.database().collection('OldGoodsBuyState').aggregate()
    .match({
      BuyersID:event.BuyersID
    })
    .skip(event.len)
    .lookup({ //商品信息
      from: "OldCommodities",
      localField: "oldGoodsID",
      foreignField: "_id",
      as: "OldGoodInfo"
    })
    .lookup({ //卖家信息
      from: "user",
      localField: "SellerID",
      foreignField: "_openid",
      as: "SellerInfo"
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$OldGoodInfo', 0]), $.arrayElemAt(['$SellerInfo', 0]), '$$ROOT'])
    })
    .project({
      OldGoodInfo: 0,
      SellerInfo: 0
    })
    .sort({
      BuyTime: -1
    })
    .end()
  }else{
    return cloud.database().collection('OldGoodsBuyState').aggregate()
    .match({
      BuyersID:event.BuyersID,
      GoodsTransportState:event.GoodsTransportState
    })
    .skip(event.len)
    .lookup({ //商品信息
      from: "OldCommodities",
      localField: "oldGoodsID",
      foreignField: "_id",
      as: "OldGoodInfo"
    })
    .lookup({ //卖家信息
      from: "user",
      localField: "SellerID",
      foreignField: "_openid",
      as: "SellerInfo"
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$OldGoodInfo', 0]), $.arrayElemAt(['$SellerInfo', 0]), '$$ROOT'])
    })
    .project({
      OldGoodInfo: 0,
      SellerInfo: 0
    })
    .sort({
      BuyTime: -1
    })
    .end()
  }
  }

  //取消 旧物置换订单
  if (event.num == "deletOldGoodOrderBooking") {
    return cloud.database().collection('OldGoodsBuyState')
      .where({
        _id: event._id, //订单ID
        BuyersID: event.BuyersID, //订单发起者  买家
      })
      .remove()
  }

  
  //取消 超时旧物置换订单
  if (event.num == "deletTimeOutOldGoodOrderBooking") {
    return cloud.database().collection('OldGoodsBuyState')
      .where({
        _id: event._id, //订单ID
      })
      .remove()
  }

  //待付款页  付款旧物置换订单
  if (event.num == "PayWaiteOldGoodOrderBooking") {
    return cloud.database().collection('OldGoodsBuyState')
      .where({
        _id: event._id, //订单ID
        BuyersID: event.BuyersID, //订单发起者  买家
      })
      .update({
        data:{
          finallPrtice:event.finallPrtice,//最终付款
          BuyTime:event.BuyTime,//付款时间
          BuyGoodsState:1,//商品付款状态 1付款成功
          GoodsTransportState:0//商品运输状态 0 待发货
        }
      })
      
  }

  //下架商品&上架商品
  if (event.num == "TakedownMyGoodInfo") {
    return cloud.database().collection('OldCommodities')
      .where({
        _id:event._id, //商品ID
        businessID: event.businessID, //订单发起者  买家
      })
      .update({
        data:{
          goodState:event.goodState
        }
      })
      
  }

  //将发布的闲置品存放到数据库中
  if (event.num == "AddNewPublishOldGoodInfo") {
    return cloud.database().collection('OldCommodities')
      .add({
        data:{
          businessID:event.businessID,//商家ID
          oldGoodType:event.oldGoodType,//闲置品类型
          brand:event.brand,//品牌
          quality:event.quality,//成色
          goodDescribe:event.goodDescribe,//商品描述信息
          goodTitle:event.goodTitle,//商品题目
          goodImage:event.goodImage,//商品照片
          goodPrtice:event.goodPrtice,//商品价格
          showImage:event.showImage,//商品详细照片
          IsTransport:event.IsTransport,//是否包邮
          freight:event.freight,//运费
          orAttestation:event.orAttestation,//是否实名认证
          goodPublishTime:event.goodPublishTime,//商品发布时间
          goodState:event.goodState,//商品状态
        }
      })
      
  }


  //更新 修改 闲置品信息
  if (event.num == "updateReviseOldGoodInfo") {
    return cloud.database().collection('OldCommodities')
      .where({
          _id:event.oldGoodID,//闲置品ID
          businessID:event.businessID,//卖家
      })
      .update({
        data:{
          oldGoodType:event.oldGoodType,//闲置品类型 
          brand:event.brand,//品牌 
          quality:event.quality,//成色
          goodDescribe:event.goodDescribe,//商品描述信息 
          goodTitle:event.goodTitle,//商品题目  
          goodImage:event.goodImage,//商品照片 
          goodPrtice:event.goodPrtice,//商品价格 
          showImage:event.showImage,//商品详细照片 
          IsTransport:event.IsTransport,//是否包邮 
          freight:event.freight,//运费 
          goodPublishTime:event.goodPublishTime,//商品发布时间 
        }
      })      
  }

  //删除帖子
  if (event.num == "deletMYPost") {
    return cloud.database().collection('WonderfulMoments')
      .where({
        _id: event._id, //帖子ID
        PublicerID:event.PublicerID,//发布者
      })
      .remove()
  }


  // 更新个人信息
  if (event.num == "updateUserDatebaseInfo") {
    return cloud.database().collection('user')
      .where({
        _openid: event.userOpenID
      })
      .update({
        data: {
          userImage:event.userImage,//用户头像
          userName:event.userName,//昵称
          truePhone:event.truePhone,//真实手机号
          userSex:event.userSex,//用户性别
          userAdress:event.userAdress,//地区
          userText:event.userText,//个性签名

        }
      })
  }

}