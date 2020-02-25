// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('调用参数:\n', event)
    const wxContext = cloud.getWXContext()

    return db.collection('user').where({
        _openid: wxContext.OPENID
    }).get()
}