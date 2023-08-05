var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navScrollLeft: 0, //设置横向滚动条位置
    currentNav: 0, //选项下标
    scrollViewHeight: '', //计算后的可用高度
    scrollTabItem: [], //滚动条滚动项
    showSort: '综合',
    sort: ['综合', '价格从低到高', '价格从高到低'], //排序下拉选择
    showQuality: '默认',
    quality: ['默认', '全新', '九成新', '七成新', '六成新', '五成新'], //成色 下拉选择
    getSearch: '儿童绘本', //输入的内容
    placeholderText: '儿童绘本',
    scrollViewHeight: '', //计算后的可用高度
    showRightGoods: [], //展示匹配到的商品
    sortIndex: -1, //排序值
    qualityIndex: "0", //成色值
    orSearch: false, //是否开始搜索
    LastSearchText:'',//上一次输入的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取滚动栏项
    that.getScrollItem();
    // 获得可使用高度
    that.getRightHeight();
    // 获取匹配到的数据
    that.getRightGoods();
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


  //获取可使用的高度
  getRightHeight() {
    let that = this;
    let query = wx.createSelectorQuery().in(this);
    query.select('#topModule').boundingClientRect();
    query.exec((res) => {
      let navbarHeight = res[0].height;
      let scrollViewHeight = app.globalData.deviceInfo.windowHeight - navbarHeight;
      // console.log("计算后可用长度", scrollViewHeight);
      that.setData({
        scrollViewHeight: scrollViewHeight
      })
    })
  },

  //获取滚动条滚动项
  getScrollItem() {
    let that = this;
    wx.cloud.callFunction({
        name: 'getDate',
        data: {
          num: 'getScrollItem',
        }
      })
      .then(res => {
        // console.log("后台旧物置换滚动栏滚动项获取成功", res.result.data);
        that.setData({
          scrollTabItem: res.result.data
        })
      })
      .catch(err => {
        console.log("后台旧物置换滚动栏滚动项获取失败", err);
      })

  },


  // 获取输入的旧物置换内容
  getOldSearch(e) {
    let that = this;
    // console.log("输入的内容", e.detail.value);
    that.setData({
      getSearch: e.detail.value
    })
  },

  // 点击搜索
  Search() {
    let that = this;
    if(that.data.orSearch==false||that.data.LastSearchText!==that.data.getSearch ){
      that.setData({
        showRightGoods:[]
      })
    }
    console.log("搜索内容",that.data.getSearch);
    console.log("排序",that.data.sortIndex);
    console.log("长度",that.data.showRightGoods.length);
    console.log("成色选择",that.data.qualityIndex);
    console.log("搜索状态",that.data.orSearch);
    console.log("上一次输入的内容",that.data.LastSearchText);
    let len = that.data.showRightGoods.length;
    //成色默认  显示全部搜索结果
    if (that.data.qualityIndex === '0') {
      wx.cloud.callFunction({
          name: 'getDate',
          data: {
            num: 'searchAllOldGoods',
            searchContent: that.data.getSearch, //搜索内容
            choiseSort: that.data.sortIndex, //排序
            len: len
          }
        })
        .then(res => {
          console.log("商品信息全部搜索成功", res.result.list);
          if (res.result.list.length <= 0) {
            wx.showToast({
              title: '未搜到相关商品',
              icon: 'error'
            })
          } else {
            that.setData({
              showRightGoods:that.data.showRightGoods.concat(res.result.list),
              orSearch: true,
              LastSearchText:that.data.getSearch
            })
          }
        })
        .catch(err => {
          console.log("商品信息筛选搜索失败", err);
          wx.showToast({
            title: '未搜索到',
            icon:'error'
          })
        })
        

    } else if (that.data.qualityIndex !== '0') { //成色选择 显示筛选结果
      wx.cloud.callFunction({
          name: 'getDate',
          data: {
            num: 'searchOldGoods',
            searchContent: that.data.getSearch, //搜索内容
            choiseSort: that.data.sortIndex, //排序
            quality: that.data.qualityIndex, //成色
            len: len
          }
        })
        .then(res => {
          console.log("商品信息搜索成功", res.result.list);
          if (res.result.list.length <= 0) {
            wx.showToast({
              title: '未搜到相关商品',
              icon: 'error'
            })
          } else {
            that.setData({
              showRightGoods:that.data.showRightGoods.concat(res.result.list),
              orSearch: true,
              LastSearchText:that.data.getSearch
            })
          }
        })
        .catch(err => {
          console.log("商品信息搜索失败", err);
        })
    }
  },

  //滚动选择框 点击事件 
  switchNav(e) {
    let that = this;
    // console.log("滚动", e.currentTarget.dataset.current);
    let cur = e.currentTarget.dataset.current;
    // console.log("滚动姓名", that.data.scrollTabItem[cur].name);
    if (this.data.currentNav == cur) {
      return false;
    } else {
      this.setData({
        currentNav: cur, //选中项下标
        PassTable: that.data.scrollTabItem[cur].name, //选中项名称
        showRightGoods: [],
        orSearch: false,
        qualityIndex: "0", //成色值
        showQuality: '默认',
        sortIndex: -1, //排序值
        showSort: '综合',
      })
      // 获取匹配到的商品信息
      that.getRightGoods();
    }
  },


  // 获取综合 下拉选择内容
  getSort(e) {
    let that = this;
    console.log("综合选中内容下标", e.detail.value);
    // console.log("综合选中内容", that.data.sort[e.detail.value]);

    if (e.detail.value == 0) { //综合  时间最新
      that.setData({
        sortIndex: -1,
        showSort: that.data.sort[e.detail.value],
        showRightGoods: []
      })
      if (that.data.orSearch == false) { //自匹商品
        // 获取匹配到的商品信息
        that.getRightGoods();
      } else { //搜索进行
        //获取 搜索到的内容信息
        that.Search();
      }

    } else if (e.detail.value == 1) { //价格从低到高
      that.setData({
        sortIndex: 1,
        showSort: that.data.sort[e.detail.value],
        showRightGoods: []
      })
      if (that.data.orSearch == false) { //自匹商品
        // 获取匹配到的商品信息
        that.getRightGoods();
      } else { //搜索进行
        //获取 搜索到的内容信息
        that.Search();
      }
    } else if (e.detail.value == 2) { //价格从高到低
      that.setData({
        sortIndex: -1,
        showSort: that.data.sort[e.detail.value],
        showRightGoods: []
      })
      if (that.data.orSearch == false) { //自匹商品
        // 获取匹配到的商品信息
        that.getRightGoods();
      } else { //搜索进行
        //获取 搜索到的内容信息
        that.Search();
      }
    }
  },


  // 获取 成色 下拉选择内容
  getQuality(e) {
    let that = this;
    // console.log("成色选中内容下标", e.detail.value);
    // console.log("成色选中内容", that.data.quality[e.detail.value]);
    let index = e.detail.value;
    that.setData({
      showQuality: that.data.quality[e.detail.value],
      qualityIndex: index.toString(),
      showRightGoods: []
    })
    if (that.data.orSearch == false) { //自匹商品
      // 获取匹配到的商品信息
      that.getRightGoods();
    } else { //搜索进行
      //获取 搜索到的内容信息
      that.Search();
    }
  },



  // 获取 匹配到的商品
  getRightGoods() {
    let that = this;
    // console.log("当前showRightGoods的长度", that.data.showRightGoods.length);
    let len = that.data.showRightGoods.length;
    // console.log("当前选中的商品类型", that.data.currentNav);
    // console.log("当前选择的排序情况", that.data.sortIndex);
    // console.log("当前选择的成色情况", that.data.qualityIndex);
    //如果 没有选择成色  一律按 默认成色 显示  即显示全部
    if (that.data.qualityIndex === '0') {
      wx.cloud.callFunction({
          name: 'getDate',
          data: {
            num: 'GetAllOldCommodities',
            oldGoodType: that.data.currentNav, //商品类型
            choiseSort: that.data.sortIndex, //排序
            len: len
          }
        })
        .then(res => {
          console.log("匹配到的全部商品获取成功", res.result.list);
          let list = res.result.list;
          if (list.length <= 0) {
            wx.showToast({
              icon: 'error',
              title: '没有更多数据',
            })
          } else {
            that.setData({
              showRightGoods: that.data.showRightGoods.concat(res.result.list)
            })
          }
        })
        .catch(err => {
          console.log("匹配到的全部商品获取失败", err);
        })
    } else if (that.data.qualityIndex !== '0') { //有 成色要求
      wx.cloud.callFunction({
          name: 'getDate',
          data: {
            num: 'GetOldCommodities',
            oldGoodType: that.data.currentNav, //商品类型
            quality: that.data.qualityIndex, //成色
            choiseSort: that.data.sortIndex, //排序
            len: len
          }
        })
        .then(res => {
          console.log("匹配到的商品获取成功", res.result.list);
          let list = res.result.list;
          if (list.length <= 0) {
            wx.showToast({
              icon: 'error',
              title: '没有更多数据',
            })
          } else {
            that.setData({
              showRightGoods: that.data.showRightGoods.concat(res.result.list)
            })
          }
        })
        .catch(err => {
          console.log("匹配到的商品获取失败", err);
        })
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    let that = this;

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    console.log("上拉触底了");
    if (that.data.orSearch == false) {
      //获取匹配商品信息
      that.getRightGoods();
    } else if (that.data.orSearch == true) {
      //获取搜索
      that.Search();
    }

  },

  //跳转商品详情页
  goOldObjectDetail(e){
    let that=this;
    console.log("跳转商品详情页",e.currentTarget.dataset.oldgoodid);
    wx.navigateTo({
      url: '../OldObjectDetail/OldObjectDetail?oldgoodid='+e.currentTarget.dataset.oldgoodid+'&Type='+1,
    })
  },

  //添加闲置用品
  addOldGoods(){
    let that=this;
    wx.navigateTo({
      url: '../addOldGood/addOldGood?oldGoodsID='+-999+"&PageType="+1,
    })
  }


})