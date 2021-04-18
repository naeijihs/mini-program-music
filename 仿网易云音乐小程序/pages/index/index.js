// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendrList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const bannerListData=await request('/banner',{type:2})
    this.setData({
      bannerList:bannerListData.banners
    })
    const recommendListData=await request('/personalized',{type:2})
    this.setData({
      recommendList:recommendListData.result
    })
    let index=0
    const array=[]
    while(index<5)
    {
      const topListData=await request('/top/list',{idx:index++})
      const topListItem={name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
      array.push(topListItem)
      this.setData({
        topList:array
      })
    }

  },
  toRecommend(){
    wx.navigateTo({
      url: '/pages/recommend/recommend',
    })
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
  onShareAppMessage: function () {

  }
})