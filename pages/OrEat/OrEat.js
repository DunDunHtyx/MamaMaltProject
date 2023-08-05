Page({
  data: {
      tabs: ['孕期', '月子', '哺乳期','宝宝'],//第一导航栏
      tab:['不能吃','少吃','能吃'],//第二导航栏
      current:0,
      top:0,
      orEat:[],//能不能吃 数据信息
      finallEat:[],//呈现在页面的数据
      selectType:'',//选中的人员类型
      selectItem:'',//选中的食物类型
     },
     //第一个导航栏 点击事件
    tabSelect:function(e){
      var current = e.currentTarget.dataset.id
      this.setData({
        current:current
      })
      this.getFinall();
    },
    //第二个导航栏 点击事件
    tabSelect1:function(e){
      var top = e.currentTarget.dataset.id
      this.setData({
        top:top
      })
      this.getFinall();
    },
    //筛选 出的内容
    //  current  0:孕期 1：月子 2：哺乳期 3：宝宝
    //top 0:不能吃 1：少吃 2：能吃
    getFinall(){
        let that=this;
        console.log("第一个导航栏为",that.data.current);
        console.log("第二个导航栏为",that.data.top);
        if(that.data.current==0){ //孕期
            if(that.data.top==0){
                that.getCloudData(0,0);
            }else if(that.data.top==1){
              that.getCloudData(0,1);
            }else if(that.data.top==2){
              that.getCloudData(0,2);
            }
        } else if(that.data.current==1){//月子
            if(that.data.top==0){
                that.getCloudData(1,0);
            }else if(that.data.top==1){
              that.getCloudData(1,1);
            }else if(that.data.top==2){
              that.getCloudData(1,2);
            }
        }else if(that.data.current==2){//哺乳期
            if(that.data.top==0){
              that.getCloudData(2,0);
            }else if(that.data.top==1){
              that.getCloudData(2,1);
            }else if(that.data.top==2){
              that.getCloudData(2,2);
            }
        }else if(that.data.current==3){//宝宝
            if(that.data.top==0){
              that.getCloudData(3,0);
            }else if(that.data.top==1){
              that.getCloudData(3,1);
            }else if(that.data.top==2){
              that.getCloudData(3,2);
            }
        }
    },
  
    getCloudData(type,number){
      let that=this;
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          type:type,
          number:number,
          num:"fineSelectOrEat"
        }
      })
      .then(res=>{
          console.log("云函数获取成功",res.result.data);
          that.setData({
            finallEat:res.result.data
          })
      })
      .catch(err=>{
        console.log("云函数获取失败",err);
      })
    },
    onLoad(){
        let that=this;
        that.getOrEat();
    },
    //跳转 能不能吃详情页面
    goOrRateXQ(e){
      console.log("能不能从ID",e.currentTarget.dataset._id);
       wx.navigateTo({
         url: '../OrEatXQ/OrEatXQ?_id='+e.currentTarget.dataset._id,
       }) 
    },
  //获取后台能不能吃数据
  getOrEat(){
      let that=this;
      wx.cloud.callFunction({
        name:'getDate',
        data:{
          num:"OrEat"
        }
      })
      .then(res=>{
        console.log("调用云函数成功",res.result.data);
        that.setData({
          orEat:res.result.data,
          finallEat:res.result.data
        })
      })
      .catch(err=>{
        console.log("调用云函数失败",err);
      })
  }
})
