// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

function draw(productList) {
    var index = 0,
        indexList = []
    productList.map(function(e, i) {
        if (e.remain > 0 && e.level != 'Last One') {
            indexList[index] = i
            index++
        }
    });

    if (indexList.length > 0) {
        var drawNo = parseInt(Math.random() * indexList.length, 10)
        productList[indexList[drawNo]].remain = productList[indexList[drawNo]].remain - 1
        var drawItem = productList[indexList[drawNo]]
        return {
            name: drawItem.name,
            productImg: drawItem.productImg
        }
    }

    return null
}

// 云函数入口函数
exports.main = async(event, context) => {
    console.log('调用参数:\n', event)
    const openid = cloud.getWXContext().OPENID

    try {
        var lastProduct, drawList = []
        const transaction = await db.startTransaction()
        const projectRes = await transaction.collection(event.projectDatabaseName).doc(event.projectID).get()
        const userInfo = await db.collection('user').where({
            _openid: openid
        }).get()
        const userRes = await transaction.collection('user').doc(userInfo.data[0]._id).get()

        if (projectRes.data && userRes) {
            var productList = projectRes.data.productList

            // 库存不足
            if (projectRes.data.cardRemain < event.count) {
                await transaction.rollback()

                console.log(`库存不足，抽取失败`)

                return {
                    updateFail: false,
                    callRefund: true,
                    last: lastProduct,
                    list: drawList
                }
            }

            // 随机抽取n次
            for (var count = event.count; count > 0; count--) {
                var drawItem = draw(productList, count, drawList)
                if (drawItem) {
                    drawList.push(drawItem)
                } else {
                    break
                }
            }

            // 最终赏判断
            if (drawList.length > 0 && projectRes.data.cardRemain === event.count) {
                var lastIndex
                productList.map(function(e, i) {
                    if (e.level === 'Last One') {
                        lastIndex = i
                        lastProduct = {
                            name: e.name,
                            productImg: e.productImg
                        }
                    }
                })
                productList[lastIndex].remain = 0
            }

            // 更新奖品剩余数量
            const updateProjectRes = await transaction.collection(event.projectDatabaseName).doc(event.projectID).update({
                data: {
                    cardRemain: _.inc(drawList.length * -1),
                    productList: productList
                }
            })

            // 更新用户赏袋信息
            var bagListNew = userRes.data.bagList.concat(drawList)
            if (lastProduct) {
                bagListNew.push(lastProduct)
            }
            const updateUserRes = await transaction.collection('user').doc(userInfo.data[0]._id).update({
                data: {
                    bagList: bagListNew
                }
            })

            await transaction.commit()

            console.log(`transaction succeeded`)

            return {
                updateFail: false,
                callRefund: false,
                last: lastProduct,
                list: drawList
            }
        } else {
            await transaction.rollback()

            return {
                updateFail: true,
                callRefund: false,
                last: lastProduct,
                list: drawList
            }
        }
    } catch (e) {
        console.error(`transaction error`, e)

        return {
            updateFail: false,
            callRefund: true,
            last: lastProduct,
            list: drawList
        }
    }
}