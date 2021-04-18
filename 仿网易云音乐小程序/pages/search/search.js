// pages/search/search.js
import request from '../../utils/request'
let tag=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'',
    hotList:[],
    searchValue:'',
    searchList:[],
    historyList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    this.getHistoryList()
  },
  async getInitData(){
    let result=await request('/search/default')
    let list=await request('/search/hot/detail')
    this.setData({
      placeholder:result.data.showKeyword,
      hotList:list.data
    })
  },
  handleInput(event){
    let searchValue=event.detail.value.trim()
    this.setData({
      searchValue
    })
    if(tag)
    return
    tag=true
    setTimeout(()=>{
      this.getSearchList()
      tag=false
    },500)
  },
  async getSearchList(){
    if(!this.data.searchValue.trim())
    {
      this.setData({
        searchList:[]
      })
      return
    }
    let {searchValue,historyList}=this.data
    let result=await request('/search',{keywords:searchValue,limit:10})
    let index=historyList.indexOf(searchValue)
    if(index!==-1)
    historyList.splice(index,1)
    historyList.unshift(searchValue)
    this.setData({
      searchList:result.result.songs,
      historyList
    })
    wx.setStorageSync('historyList', historyList)
  },
  getHistoryList(){
    let historyList=wx.getStorageSync('historyList')
    if(historyList)
    this.setData({
      historyList
    })
  },
  clear(){
    this.setData({
      searchValue:'',
      searchList:[]
    })
  },
  delete(){
    wx.showModal({
      title:'清空历史记录',
      content:'确认清空历史记录吗',
      success:(res)=>{
        if(res.confirm)
        {
          this.setData({
            historyList:[]
          })
          wx.removeStorageSync('historyList')
        }
      }
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