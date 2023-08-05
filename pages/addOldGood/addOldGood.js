// pages/addOldGood/addOldGood.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GoodType: ['婴儿用品', '儿童玩具', '童装童鞋', '图书', '孕妇用品', '家居百货'], //闲置品类型
    ShowGoogType: '选择闲置品类型', //显示商品类型
    GoodTypeIndex: '', //闲置品类型下标
    InputBrand: '', //输入的品牌信息
    quality: ['请选择闲置品成色', '全新', '九成新', '七成新', '六成新', '五成新'], //成色
    qualityIndex: '', //成色下标
    showQuality: "请选择闲置品成色", //显示成色
    OrFreeShipping: ['是', '否'], //是否包邮
    showOrFreeShipping: '是否包邮', //显示是否包邮
    OrFreeShippingIndex: '', //是否包邮下标
    inputFreight: '', //运费
    inputTitleText: '', //商品标题
    getInputContent: '', //商品简述
    getInputGoodPrtice: '', //商品价格
    showOldGoodIntro:"写一些关于商品的品牌型号，入手渠道，转手原因吧。。。",

    imgList: [], //照片
    nowTime: '', //发布时间

    images_success: [],//上传云存储后的云存储地址数组
    images_success_size:0,//图片上传成功的数量


    DeleateImage_success:[],//删除云存储
    DeleateImage_success_size:0,//成功删除数量

    oldGoodID:'',//闲置品ID
    goPageType:'',//跳转页面类型 1:添加闲置品 2:编辑闲置品
    editOldGoodInfo:'',//需要编辑的闲置品信息

    oldImage:[],//删除后的照片集信息
    DeletedPhotos:[],//被删除的照片信息
    
    againImageSize:'',//最初照片数量

    needNewImage:[],//要更新的照片集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let that=this;
    console.log("传参值",e);
    console.log("商品ID",e.oldGoodsID);
    console.log("页面跳转参数",e.PageType);
    if(e.oldGoodsID==-999&&e.PageType==1){
      console.log("添加");
      that.setData({
        goPageType:e.PageType
      })
    }else if(e.PageType==2){
      console.log("编辑");
      that.setData({
        oldGoodID:e.oldGoodsID,
        goPageType:e.PageType
      })
      that.getEditOldGoodInfo();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  //富文本实例化
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
    console.log("实例化成功");
  },

  //图片上传
  ChooseImage() {
    wx.chooseImage({
      count: 5, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths)
            })
          
        } else {
            this.setData({
              imgList: res.tempFilePaths
            })

        }
      }
    });
  },
  //查看 放大照片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  //删除 照片
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '再想想',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          // console.log("删除照片信息",e);
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.oldImage.splice(e.currentTarget.dataset.index, 1);
          if(this.data.againImageSize>=0){
            this.setData({
              oldImage:this.data.oldImage,
              imgList: this.data.imgList,
              DeletedPhotos:this.data.DeletedPhotos.concat(e.currentTarget.dataset.imageurl)
            })
          }else if(this.data.againImageSize<0){
            this.setData({
              oldImage:this.data.oldImage,
              imgList: this.data.imgList,
            })
          }
        }
      }
    })
  },

  //获取当前的时间
  getNowTime: function (e) {
    let that = this;
    //获取时间：年月日
    let dataTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    // let hour = new Date().getHours()
    // let minute = new Date().getMinutes()
    dataTime = `${yy}-${mm}-${dd} `;
    that.setData({
      nowTime: dataTime
    })
  },

  //选择闲置品类型
  choiceGoodType(e) {
    let that = this;
    // console.log("闲置品类型", e.detail.value);
    that.setData({
      ShowGoogType: that.data.GoodType[e.detail.value],
      GoodTypeIndex: e.detail.value
    })
  },

  //输入闲置品品牌
  getInputBrand(e) {
    let that = this;
    // console.log("闲置品品牌", e.detail.value);
    that.setData({
      InputBrand: e.detail.value
    })
  },

  //选择闲置品成色
  choiceQuality(e) {
    let that = this;
    // console.log("闲置品成色", e.detail.value);
    that.setData({
      showQuality: that.data.quality[e.detail.value],
      qualityIndex: e.detail.value
    })
  },

  //是否包邮
  choiceOrFreeShipping(e) {
    let that = this;
    // console.log("闲置品是否包邮", e.detail.value);
    if (e.detail.value == 0) { //是
      that.setData({
        showOrFreeShipping: that.data.OrFreeShipping[e.detail.value],
        OrFreeShippingIndex: true
      })
    } else if (e.detail.value == 1) { //否
      that.setData({
        showOrFreeShipping: that.data.OrFreeShipping[e.detail.value],
        OrFreeShippingIndex: false
      })
    }
  },

  //闲置品运费
  getInputFreight(e) {
    let that = this;
    // console.log("闲置品运费", e.detail.value);
    that.setData({
      inputFreight: e.detail.value
    })
  },

  //获取商品标题
  getGootTitle(e) {
    let that = this;
    // console.log("商品标题", e.detail.value);
    that.setData({
      inputTitleText: e.detail.value
    })
  },

  //获取商品简介
  getContent(e) {
    let that = this;
    // console.log("商品简介", e.detail.html);
    that.setData({
      getInputContent: e.detail.html
    })
  },

  //获取商品价格
  getOldGoodPrtice(e) {
    let that = this;
    // console.log("商品价格", e.detail.value);
    that.setData({
      getInputGoodPrtice: e.detail.value
    })
  },

  //将图片上传的云存储中
  uploadImage(index){
    let that=this
    if(that.data.goPageType==1){ //更新
      wx.cloud.uploadFile({//上传至微信云存储
        cloudPath:'oldGoodInfo/' + new Date().getTime() + "_" +  Math.floor(Math.random()*1000) + ".jpg",//使用时间戳加随机数给图片命名
        filePath:that.data.imgList[index],// 本地文件路径
        success: res => {
          // // 返回文件 ID
          // console.log("上传成功",res.fileID)
          that.data.images_success[index] = res.fileID;
          that.data.images_success_size = that.data.images_success_size+1;
 
          if(that.data.images_success_size == that.data.imgList.length){
              //将商品数据上传到数据库中
                that.HoldDatabase();
          } else {
            that.uploadImage(index+1)
          }
        },
        fail: err =>{
          that.setData({
            images_success:[],
            images_success_size:0
          })
          wx.showToast({
            icon:'none',
            title: '上传失败，请重新上传',
          })
        }
      })
    }else if(that.data.goPageType==2){ //编辑页面 添加新的照片
      wx.cloud.uploadFile({//上传至微信云存储
        cloudPath:'oldGoodInfo/' + new Date().getTime() + "_" +  Math.floor(Math.random()*1000) + ".jpg",//使用时间戳加随机数给图片命名
        filePath:that.data.needNewImage[index],// 本地文件路径
        success: res => {
          // // 返回文件 ID
          // console.log("上传成功",res.fileID)
          that.data.images_success[index] = res.fileID;
          that.data.images_success_size = that.data.images_success_size+1;
          
          if(that.data.images_success_size == that.data.needNewImage.length){
              //将商品数据更新数据库
                that.YesReviseOldGoodInfo();
          } else {
            that.uploadImage(index+1)
          }
        },
        fail: err =>{
          that.setData({
            images_success:[],
            images_success_size:0
          })
          wx.showToast({
            icon:'none',
            title: '上传失败，请重新上传',
          })
        }
      })
    }
 
  },

  //删除云存储中的照片
  DeleteCloudPhone(index){
    let that=this;
    console.log("删除长度",that.data.DeletedPhotos.length);
    wx.cloud.deleteFile({
      fileList: [that.data.DeletedPhotos[index]],
      success: res => {
        console.log(res)
        console.log("照片删除成功");
        that.setData({
          DeleateImage_success_size:that.data.DeleateImage_success_size+1
        })
        if(that.data.DeleateImage_success_size==that.data.DeletedPhotos.length){
          if(that.data.goPageType==2){
            //新照片 添加到云存储中  编辑状态
            that.setData({
              images_success:that.data.needNewImage
            })
            that.uploadImage(0)
          }
        }else{
          that.DeleteCloudPhone(index+1)
        }
      },
      fail: err=>{
        console.log("删除失败");
      }
    })
  },

  //发布检测商品信息
  publishGood() {
    let that = this;
    // console.log("商品简述", that.data.getInputContent);
    if(that.data.GoodTypeIndex.length<=0||that.data.InputBrand<=0||that.data.qualityIndex==0 ||  that.data.qualityIndex<=0||that.data.OrFreeShippingIndex.length<=0||that.data.inputFreight.length<=0||that.data.inputTitleText.length<=0|| that.data.imgList.length<=0||that.data.getInputGoodPrtice.length<=0||that.data.getInputContent==="<p><br></p>"){
      wx.showToast({
        icon:'error',
        title: '信息不全',
      })
    }else {
      //上传到云存储中照片数据
      that.setData({
        images_success:that.data.imgList,
      })
      that.uploadImage(0)
    }
  },

  //将发布商品存放入数据库中
  HoldDatabase(){
    let that=this;
    //获取当前服务器时间
    that.getNowTime();
    console.log("闲置品类型", that.data.GoodTypeIndex);//√
    console.log("品牌", that.data.InputBrand); //√
    console.log("成色", that.data.qualityIndex); //√
    console.log("是否包邮", that.data.OrFreeShippingIndex); //√
    console.log("运费", that.data.inputFreight);//√
    console.log("商品标题", that.data.inputTitleText);//√
    console.log("商品简述", that.data.getInputContent);//√
    console.log("云存储图片数据:", that.data.images_success);//√
    console.log("商品价格", that.data.getInputGoodPrtice);
    console.log("商家ID", app.globalData.user_openid);  //√
    console.log("商品发布时间", that.data.nowTime);//√
    console.log("用户基本信息",app.globalData.userInfo);//√
    wx.cloud.callFunction({
      name:'getDate',
      data:{   //freight number类型  goodPrtice number类型  oldGoodType number类型 quality错误
        num:'AddNewPublishOldGoodInfo',
        businessID:app.globalData.user_openid,//商家ID
        oldGoodType:parseInt(that.data.GoodTypeIndex),//闲置品类型
        brand:that.data.InputBrand,//品牌
        quality:that.data.qualityIndex,//成色
        goodDescribe:that.data.getInputContent,//商品描述信息
        goodTitle:that.data.inputTitleText,//商品题目
        goodImage:that.data.images_success[0],//商品照片
        goodPrtice:parseInt(that.data.getInputGoodPrtice),//商品价格
        showImage:that.data.images_success,//商品详细照片
        IsTransport:that.data.OrFreeShippingIndex,//是否包邮
        freight: parseInt(that.data.inputFreight),//运费
        orAttestation:app.globalData.userInfo.orAttestation,//是否实名认证
        goodPublishTime:that.data.nowTime,//商品发布时间
        goodState:0,//商品状态
      }
    })
    .then(res=>{
      console.log("闲置品发布成功",res);
      wx.showToast({
        icon:'success',
        title: '发布成功',
      })
      setTimeout(function(){
        wx.switchTab({
          url: '../ReplacementOld/ReplacementOld',
        })
      },2000)
    })
    .catch(err=>{
      console.log("闲置品发布失败",err);
    })

  },
  //获取需编辑 闲置品的具体信息
  getEditOldGoodInfo(){
      let that=this;
      console.log("闲置品ID",that.data.oldGoodID);

      wx.cloud.database().collection('OldCommodities')
      .where({
        _id:that.data.oldGoodID,
        businessID:app.globalData.user_openid,
        orAttestation:app.globalData.userInfo.orAttestation
      })
      .get()
      .then(res=>{
        console.log("需编辑的闲置品信息获取成功",res.data[0]);
        that.setData({
          editOldGoodInfo:res.data[0],
          ShowGoogType:that.data.GoodType[res.data[0].oldGoodType],//闲置品类型
          showQuality:that.data.quality[res.data[0].quality],//成色
          InputBrand:res.data[0].brand,//品牌 √
          GoodTypeIndex:res.data[0].oldGoodType,//闲置品下标  √
          qualityIndex:res.data[0].quality,//成色下标 √
          imgList:res.data[0].showImage,
          oldImage:res.data[0].showImage,
          againImageSize:res.data[0].showImage.length,
          getInputContent:res.data[0].goodDescribe,//商品描述信息 √
          inputTitleText:res.data[0].goodTitle,//商品题目 √
          getInputGoodPrtice:res.data[0].goodPrtice,//商品价格 √
          inputFreight:res.data[0].freight,//运费  √

        })
        // console.log("最初照片长度",that.data.againImageSize);
        if(res.data[0].IsTransport==false){ //不包邮 √
          that.setData({
            showOrFreeShipping:'否',
            OrFreeShippingIndex:1
          })
        }else if(red.data[0].IsTransport==true){ //包邮
          that.setData({
            showOrFreeShipping:'是',
            OrFreeShippingIndex:0
          })
        }
      })
      .catch(err=>{
        console.log("需编辑的闲置品信息获取失败",err);
      })
  },

  //确认修改商品信息
  reviseOldGoodInfo(){
    let that=this;
    if(that.data.GoodTypeIndex.length<=0||that.data.InputBrand<=0||that.data.qualityIndex==0 ||  that.data.qualityIndex<=0||that.data.OrFreeShippingIndex.length<=0||that.data.inputFreight.length<=0||that.data.inputTitleText.length<=0|| that.data.imgList.length<=0||that.data.getInputGoodPrtice.length<=0||that.data.getInputContent==="<p><br></p>"){
      wx.showToast({
        icon:'error',
        title: '信息不全',
      })
    }else {
      wx.showLoading({
        title: '正在修改',
        mask:true,
      })
      if(that.data.DeletedPhotos.length<=0){
          console.log("不需要从云存储中删除图片");
      }else{
          //获取最终 要从云存储中删除的照片集
          for(var i=0;i<that.data.DeletedPhotos.length;i++){
            if(that.data.DeletedPhotos[i].includes("http",0)==true){
              that.data.DeletedPhotos.splice(i, 1)
            }
          };
          // console.log("最终删除照片",that.data.DeletedPhotos);  
      }
      //获取最终 要向云存储中添加照片的集合
      // 不相等 证明 有新的照片
      if(that.data.imgList.length!=that.data.oldImage.length){
          //获取 最终添加的照片数量
          // let number=that.data.imgList.length-that.data.oldImage.length;
          // console.log("最终添加照片的数量",number);
          // console.log("从头添加新照片的下标",that.data.oldImage.length);
          //获取要添加新照片集合
          var newPhone=that.data.imgList.slice(that.data.oldImage.length,that.data.imgList.length);
          // console.log("要新添加的照片集合",newPhone);
          that.setData({
            needNewImage:newPhone
          })
      }
        console.log("获取要从云存储中删除的照片集合",that.data.DeletedPhotos);
        console.log("获取要新添加到云存储中的照片集合",that.data.needNewImage);
        //从云存储中删除照片集合
        that.DeleteCloudPhone(0);
    }
  },

  //修改更新该商品信息
  YesReviseOldGoodInfo(){
    let that=this;
     //获取当前服务器时间
     that.getNowTime();
    let ReadyGoUpImage=that.data.oldImage.concat(that.data.images_success);
    console.log("更新商品信息");
    console.log("最终完成的照片结果",ReadyGoUpImage);
    if (that.data.OrFreeShippingIndex == 0) { //是
      that.setData({
        OrFreeShippingIndex: true
      })
    } else if (that.data.OrFreeShippingIndex == 1) { //否
      that.setData({
        OrFreeShippingIndex: false
      })
    }
    //更新文章信息
    wx.cloud.callFunction({
      name:'getDate',
      data:{
        num:"updateReviseOldGoodInfo",
        oldGoodID:that.data.oldGoodID,//闲置品ID √
        businessID:app.globalData.user_openid,//卖家ID  √
        oldGoodType:parseInt(that.data.GoodTypeIndex),//闲置品类型  √
        brand:that.data.InputBrand,//品牌  √
        quality:that.data.qualityIndex,//成色 √
        goodDescribe:that.data.getInputContent,//商品描述信息 √
        goodTitle:that.data.inputTitleText,//商品题目 √
        goodImage:ReadyGoUpImage[0],//商品照片 √
        goodPrtice:parseInt(that.data.getInputGoodPrtice),//商品价格 √
        showImage:ReadyGoUpImage,//商品详细照片 √
        IsTransport:that.data.OrFreeShippingIndex,//是否包邮
        freight: parseInt(that.data.inputFreight),//运费 √
        goodPublishTime:that.data.nowTime,//发布时间 √
      }
    })
    .then(res=>{
      console.log("文章信息更新成功",res);
      wx.hideLoading()
      wx.showToast({
        icon:"success",
        title: '修改成功',
      })  
      setTimeout(function(){
        wx.switchTab({
          url: '../Mine/Mine',
        })
      },2000)

    })
    .catch(err=>{
      console.log("文章信息更新失败",err);
    })

  }

})