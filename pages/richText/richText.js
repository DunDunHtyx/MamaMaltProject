Page({

  /**
   * 页面的初始数据
   */
  data: {
    formats: '',
    title:'',//文章题目
  },

  //富文本实例化
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
    console.log("实例化成功");
  },
  // 进行样式修改
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)
  },
  //
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  //撤销
  undo() {
    this.editorCtx.undo()
  },
  //恢复
  redo() {
    this.editorCtx.redo()
  },
  //插入照片
  insertImage() {
    let that=this
    //选择招牌你
    wx.chooseMedia({
      count: 9,//文件个数
      mediaType: ['image','video'],//文件类型
      sourceType: ['album', 'camera'],//文件来源
      maxDuration: 30,//拍摄时间
      camera: 'back',//后置摄像头
      success(res) {
        console.log("图片",res.tempFiles[0].tempFilePath);
        that.uploadImage(res.tempFiles[0].tempFilePath);
      }
    })
  },
  //将照片上传云存储
  uploadImage(e){
    let that=this;
    wx.cloud.uploadFile({
      cloudPath:"文章照片/".concat(that.data.title, e.match(/\.[^.]+?$/)[0]),
      filePath:e,//文件路径
      success:res=>{
          console.log("照片上传成功",res);
          that.editorCtx.insertImage({
            src:res.fileID,
            data:{
              id:res.fileID,
              role:'god'
            },
            success:function(){
              wx.hideLoading()
            }
          })
      },
      fail:err=>{
        console.log("照片上传失败",err);
      }
    })
  },
  //清空
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  //获取输入的内容
  getContent(e){
    console.log("输入的内容",e.detail.html);
  },
  //获取 输入的题目
  getInputTitle(e){
    console.log("输入的题目",e.detail.value);
    this.setData({
      title:e.detail.value
    })
  }
})