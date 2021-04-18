// pages/personal/personal.js
import request from '../../utils/request'
let startY=0
let endY=0
let moveDistance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transform:'translateY(0)',
    transition:'',
    userInfo:{},
    recentList:[]
  },
  async getUserRecentPlayList(){
    if(this.data.userInfo.userId)
    {
      let result=await request('/user/record',{uid:this.data.userInfo.userId,type:0})
      let index=0
      let resultList=result.allData.slice(0,10).map(item=>{
        item.id=index++
        return item
      })
      this.setData({
        recentList:resultList
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo')
    if(userInfo)
    this.setData({
      userInfo:JSON.parse(userInfo)
    })
    this.getUserRecentPlayList()
  },
  handleTouchStart(event){
    this.setData({
      transition:""
    })
    startY=event.touches[0].clientY
  },
  handleTouchMove(event){
    endY=event.touches[0].clientY
    moveDistance=endY-startY
    if(moveDistance<0)
    return
    else if(moveDistance>=80)
    moveDistance=80
    this.setData({
      transform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      transform:'translateY(0)',
      transition:'transform 0.5s linear'
    })
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
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