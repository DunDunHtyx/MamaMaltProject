// pages/idlePublish/idlePublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['孕妇用品','儿童玩具','图书','童装童鞋','婴儿用品'],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    selectShowCS: false,
    selectDataCS: ['全新','95新','半成新','一般'],//成色下拉列表的数据
    indexCS: 0,
    selectShowBY: false,
    selectDataBY: ['是','否'],//成色下拉列表的数据
    indexBY: 0,
    fileList: [
      // {
      //   url: 'https://img.yzcdn.cn/vant/leaf.jpg',
      //   name: '图片1',
      //   deletable: true,
      // },
      // // Uploader 根据文件后缀来判断是否为图片文件
      // // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      // {
      //   url: 'http://iph.href.lu/60x60?text=default',
      //   name: '图片2',
      //   isImage: true,
      //   deletable: true,
        
      // },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
  },
  // 成色
  selectTapCS() {
    this.setData({
      selectShowCS: !this.data.selectShowCS
    });
  },
  // 点击下拉列表
  optionTapCS(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      indexCS: Index,
      selectShowCS: !this.data.selectShowCS
    });
  },
  // 是否包邮
  selectTapBY() {
    this.setData({
      selectShowBY: !this.data.selectShowBY
    });
  },
  // 点击下拉列表
  optionTapBY(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      indexBY: Index,
      selectShowBY: !this.data.selectShowBY
    });
  },
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})