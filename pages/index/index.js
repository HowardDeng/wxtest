// pages/index/index.js
var app = getApp();//获取当前小程序实例，方便使用全局方法和属性
var QQMapWX = require('../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
       * 页面配置
       */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    /*wether logic*/
    cur_id: app.curid,
    basic: "",
    now: "",
    qqmapkey: 'IJQBZ-HJUKR-EKRWE-WJH43-JHKN6-PXB4I',
    suggestion: {},
    longitude: "",
    latitue: "",
    province: "",
    city: "",
    location: "",
    v: app.version,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: this.data.qqmapkey
    });
    var that = this;

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

  },
  // 定义点击标题的事件处理函数，将选中标题的id赋值给selectedTitle
  bindtap: function (e) {
    console.log(e)
    this.setData({
      selectedTitle: e.currentTarget.id
    });
  },
  //定义滑块改变的事件处理函数，将current赋值给selectedTitle
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
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
    var that = this;
    wx.getLocation({
      success: function (res) {
        that.longitude = res.longitude;
        that.latitude = res.latitude;
        console.log(that.longitude + "," + that.latitude);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: that.latitude,
            longitude: that.longitude
          },
          success: function (res) {
            console.log(res);
            that.setData({
              province: res.result.address_component.province.replace('省', ''),
              city: res.result.address_component.city.replace('市', '')
            })
            console.log("province " + that.data.province);
            console.log("city " + that.data.city);

            that.getnow(function (d) {//获取到数据的回调函数
              wx.hideToast();

              d.now["cond_src"] = "https://cdn.heweather.com/cond_icon/" + d.now.cond_code + ".png";
              d.basic["update"] = d.update;
              that.setData({ basic: d.basic, now: d.now })//更新数据，视图将同步更新
              console.log(d);
            });
            that.getsuggestion(function (d) {
              console.log(d);
              var lifestyle = d.lifestyle;
              var msuggestion = {};
              lifestyle.forEach(function (item, index) {
                if (item.type == "comf") {
                  msuggestion["comf"] = item;
                } else if (item.type == "drsg") {
                  msuggestion["drsg"] = item;
                } else if (item.type == "flu") {
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
                that.setData({ suggestion: msuggestion });
              })
            });

          }
        })
      },
    })
  },
  //3、自定义页面方法：获取当前天气API
  getnow:function(fn){
    wx.request({//请求服务器，类似ajax
      url: 'https://xiaoffjj.com/wether', 
      data: {
            city:this.data.city,
            province:this.data.province,
            },//和风天气提供用户key，可自行注册获得
      header: {'Content-Type': 'application/json'},
      success: function(res) {fn(res.data.HeWeather6[0]);}//成功后将数据传给回调函数执行
    })
  },
  //获取生活指数API
  getsuggestion:function(fn){
    wx.request({
      url: 'https://xiaoffjj.com/lifestyle', 
      data: {
        city: this.data.city,
        province: this.data.province,
      },
      header: {'Content-Type': 'application/json'},
      success: function(res) {fn(res.data.HeWeather6[0]);}
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '二货留言',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  //3、自定义页面方法：获取当前天气API
  getnow: function (fn) {
    wx.request({//请求服务器，类似ajax
      url: 'https://xiaoffjj.com/wether',
      data: {
        city: this.data.city,
        province: this.data.province,
      },//和风天气提供用户key，可自行注册获得
      header: { 'Content-Type': 'application/json' },
      success: function (res) { fn(res.data.HeWeather6[0]); }//成功后将数据传给回调函数执行
    })
  },
  //获取生活指数API
  getsuggestion: function (fn) {
    wx.request({
      url: 'https://xiaoffjj.com/lifestyle',
      data: {
        city: this.data.city,
        province: this.data.province,
      },
      header: { 'Content-Type': 'application/json' },
      success: function (res) { fn(res.data.HeWeather6[0]); }
    })
  },

  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }

})