// pages/recommend/recommend.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendMusicList:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    let userInfo=wx.getStorageSync('userInfo')
    if(userInfo)
    {
      let result=await request('/recommend/songs')
      this.setData({
        recommendMusicList:result.recommend
      })
    }
    else
      wx.showModal({
      cancelColor: 'cancelColor',
      title: '登录提示',
      content:'请登录后浏览',
      success:(res)=>{
        res.confirm&&wx.reLaunch({
          url: '/pages/login/login'
        })
      }
    })
    PubSub.subscribe('switchType',(name,type)=>{
      let {recommendMusicList,index}=this.data
      if(type==='pre')
      {
        index===0&&(index=recommendMusicList.length)
        index-=1
      }
      else
      {
        index===recommendMusicList.length-1&&(index=-1)
        index+=1
      }
      this.setData({
        index
      })
      let musicId=recommendMusicList[index].id
      PubSub.publish('musicId',musicId)
    })
  },
  toSongDetail(event){
    let {song,index}=event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?songId=${song.id}`,
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