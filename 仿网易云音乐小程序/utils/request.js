import config from './config'
export default (url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.host+url,
      method,
      data,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.includes('MUSIC_U')):''
      },
      success(res){
        if(data.isLogin)
        wx.setStorage({
          data: res.cookies,
          key: 'cookies',
        })
        resolve(res.data)
      },
      fail(err){
        reject(err)
      }
    })
  })
}