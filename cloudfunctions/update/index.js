// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('调用参数:\n', event)
    let tableName = event.tableName, where = event.where, data = event.data;

    try {
        return await db.collection(tableName).where(where).update({
            data: data,
        })
    } catch (e) {
        console.error(e)
    }
}