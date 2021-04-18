// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    selectedId:'',
    videoList:[],
    vid:'',
    videoTimeUpdate:[],
    refreshTriggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },
  async getVideoGroupList(){
    let result=await request('/video/group/list')
    if(result.data)
    this.setData({
      videoGroupList:result.data.slice(0,14),
      selectedId:result.data[0].id
    })
    this.getVideoList()
  },
  selected(event){
    this.setData({
      selectedId:event.currentTarget.id,
      videoList:[]
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList()
  },
  async getVideoList(){
    let userInfo=wx.getStorageSync('userInfo')
    if(userInfo)
    {
      let result=await request('/video/group',{id:this.data.selectedId})
      wx.hideLoading()
      let index=0
      let videoList=result.datas.map(item=>{
      item.id=index++
      return item
      }) 
      this.setData({
        videoList,
        refreshTriggered:false
      })
    }
    else
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'登录提示',
        content:'请您登录后浏览',
        success:(res)=>{
          res.confirm&&wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
  },
  handlePlay(event){ 
    let vid=event.currentTarget.id
    this.setData({
      vid
    })
    this.videoContext=wx.createVideoContext(vid)
    let {videoTimeUpdate}=this.data
    let videoItem=videoTimeUpdate.find(item=>item.vid===vid)
    videoItem&&this.videoContext.seek(videoItem.currentTime)
    this.videoContext.play()
  },
  handleTimeUpdate(event){
    let videoItem={vid:event.currentTarget.id,currentTime:event.detail.currentTime}
    let {videoTimeUpdate}=this.data
    let videoItem2=videoTimeUpdate.find(item=>item.vid===videoItem.vid)
    if(videoItem2)
    videoItem2.currentTime=event.detail.currentTime
    else
    videoTimeUpdate.push(videoItem)
    this.setData({
      videoTimeUpdate
    })
  },
  handleEnd(event){
    let {videoTimeUpdate}=this.data
    let array=videoTimeUpdate.filter(item=>item.vid!==event.currentTarget.id)
    this.setData({
      videoTimeUpdate:array
    })
  },
  bindRefresh(){
    this.getVideoList()
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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
  onShareAppMessage: function ({from}) {
    return {
      title:'分享给朋友'
    }
  }
})