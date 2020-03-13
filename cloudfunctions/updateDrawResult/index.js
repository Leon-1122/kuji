// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('调用参数:\n', event)
    const openid = cloud.getWXContext().OPENID

    try {
        var lastProduct, drawProduct
        const transaction = await db.startTransaction()
        const projectRes = await transaction.collection('project-detail').doc(event.projectDetailId).get()
        const userInfo = await db.collection('user').where({
            _openid: openid
        }).get()
        const userRes = await transaction.collection('user').doc(userInfo.data[0]._id).get()

        if (projectRes.data && userRes) {
            var productList = projectRes.data.productList
            var oversell = false;
            var newProductList = productList.map(function (e, i) {
                if (e.sku === event.sku) {
                    if (e.remain < event.count) {
                        oversell = true;
                    } else {
                        e.remain = e.remain - event.count;
                        drawProduct = {
                            name: e.name,
                            productImg: e.productImg
                        }
                    }
                }
                return e;
            });

            // 库存不足
            if (oversell) {
                await transaction.rollback()

                console.log(`库存不足，抽取失败`)

                return {
                    success: false,
                    errorCode: 'oversell'
                }
            }

            // 最终赏判断
            if (projectRes.data.cardRemain === event.count) {
                var lastIndex
                productList.map(function (e, i) {
                    if (e.level === 'Last One') {
                        lastIndex = i
                        lastProduct = {
                            name: e.name,
                            productImg: e.productImg
                        }
                    }
                })
                newProductList[lastIndex].remain = 0
            }

            // 更新奖品剩余数量
            const updateProjectRes = await transaction.collection('project-detail').doc(event.projectDetailId).update({
                data: {
                    cardRemain: _.inc(event.count * -1),
                    productList: newProductList
                }
            })

            // 更新用户赏袋信息
            var bagListNew = userRes.data.bagList
            bagListNew.push(drawProduct)
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
                success: true
            }
        } else {
            await transaction.rollback()

            return {
                success: false,
                errorCode: 'locked'
            }
        }
    } catch (e) {
        console.error(`transaction error`, e)

        return {
            success: false,
            errorCode: 'systemError'
        }
    }
}