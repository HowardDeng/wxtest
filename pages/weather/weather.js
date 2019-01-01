//weather.js
var app = getApp();//获取当前小程序实例，方便使用全局方法和属性
var QQMapWX = require('../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  //1、页面数据部分
  data:{
    cur_id:app.curid,
    basic:"",
    now:"",
    qqmapkey: 'IJQBZ-HJUKR-EKRWE-WJH43-JHKN6-PXB4I',
    suggestion:{},
    longitude: "",
    latitue:"",
    province:"",
    city:"",
    location:""},//设置页面数据，后面空值将在页面显示时通过请求服务器获取

  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: this.data.qqmapkey
    });
  },
  //2、系统事件部分
  onShow:function(){
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.longitude = res.longitude;
        that.latitude = res.latitude;
        console.log(that.longitude + "," + that.latitude);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude:that.latitude,
            longitude: that.longitude
          },
          success:function(res){
            console.log(res);
            that.setData({
              province: res.result.address_component.province,
              city: res.result.address_component.city
            })
            console.log("province " + that.data.province)
            console.log("city " + that.data.city)
          }
        })
        },
    })
    
    that.getnow(function(d){//获取到数据的回调函数
      wx.hideToast();

      d.now["cond_src"] ="https://cdn.heweather.com/cond_icon/"+d.now.cond_code+".png";
      d.basic["update"] = d.update;
      that.setData({basic:d.basic,now:d.now})//更新数据，视图将同步更新
      console.log(d);
    })
    that.getsuggestion(function(d){
      console.log(d);
      var lifestyle = d.lifestyle;
      var msuggestion = {};
      lifestyle.forEach(function(item,index){
        if(item.type == "comf"){
          msuggestion["comf"] = item;
        }else if(item.type == "drsg"){
          msuggestion["drsg"] = item;
        } else if (item.type =="flu"){
          msuggestion["flu"] = item;
        } else if (item.type == "trav") {
          msuggestion["trav"] = item;
        } else if (item.type == "sport") {
          msuggestion["sport"] = item;
        } else if (item.type == "uv") {
          msuggestion["uv"] = item;
        } else if (item.type == "cw") {
          msuggestion["cw"] = item;
        }
        that.setData({suggestion:msuggestion});
      })
    })},
  //3、自定义页面方法：获取当前天气API
  getnow:function(fn){
    wx.request({//请求服务器，类似ajax
      url: 'https://www.xiaoffjj.com/wether', 
      data: {
            city:this.city,
            province:this.province,
            },//和风天气提供用户key，可自行注册获得
      header: {'Content-Type': 'application/json'},
      success: function(res) {fn(res.data.HeWeather6[0]);}//成功后将数据传给回调函数执行
    })
  },
  //获取生活指数API
  getsuggestion:function(fn){
    wx.request({
      url: 'https://www.xiaoffjj.com/lifestyle', 
      data: {
        city: this.data.city,
        province: this.data.province,
      },
      header: {'Content-Type': 'application/json'},
      success: function(res) {fn(res.data.HeWeather6[0]);}
    })
  },
  //4、页面事件绑定部分
  bindViewTap:function(){wx.switchTab({url: '../city/city'})}//跳转菜单页面 
})

