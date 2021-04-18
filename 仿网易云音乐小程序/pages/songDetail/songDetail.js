// pages/songDetail/songDetail.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    songId:'',
    link:'',
    currentTime:'00:00',
    totalTime:'',
    currentWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId=options.songId
    if(app.globalData.isMusicPlay&&app.globalData.musicId===musicId)
    this.setData({
      isPlay:true
    })
    this.backgroundAudioManager=wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(()=>{
      this.changePlayState(true)
      app.globalData.musicId=musicId
    })
    this.backgroundAudioManager.onPause(()=>{
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(()=>{
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth=this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })
    this.backgroundAudioManager.onEnded(()=>{
      this.handleSwitch({currentTarget:{id:'next'}})
  
    })
    this.setData({
      songId:musicId
    })
    this.getSong(musicId)
  },
  changePlayState(isPlay)
  {
    app.globalData.isMusicPlay=isPlay
    this.setData({
      isPlay
    })
  },
  async getSong(sid){
    let result=await request('/song/detail',{ids:sid})
    let totalTime=moment(result.songs[0].dt).format('mm:ss')
    this.setData({
      song:result.songs[0],
      totalTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  handleMusicPlay(){
    let {isPlay,link}=this.data
    this.musicControl(!isPlay,link)
  },
  async musicControl(isPlay,link){
    if(isPlay)
    { 
      if(!link)
      {
        let result=await request('/song/url',{id:this.data.songId})
        link=result.data[0].url
        this.setData({
          link
        })
        this.backgroundAudioManager.src=link
        this.backgroundAudioManager.title=this.data.song.name
      }
      else
      this.backgroundAudioManager.play()
    }
    else
      this.backgroundAudioManager.pause()
  },
  handleSwitch(event){
    let type=event.currentTarget.id
    this.backgroundAudioManager.stop()
    PubSub.subscribe('musicId',(name,musicId)=>{
      this.setData({
        songId:musicId
      })
      this.getSong(musicId)
      this.musicControl(true)
      PubSub.unsubscribe('musicId')
    })
    PubSub.publish('switchType',type)
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