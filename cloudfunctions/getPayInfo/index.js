// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const {
    WXPay,
    WXPayConstants,
    WXPayUtil
} = require('wx-js-utils');

const ip = require('ip');

const MCHID = '123456'
const KEY = '123456'
const TIMEOUT = 3000

// 云函数入口函数
exports.main = async(event, context) => {
    console.log('调用参数:\n', event)

    const {
        APPID,
        OPENID
    } = cloud.getWXContext()

    // 拼凑微信支付统一下单的参数
    const tradeNo = event.orderId;
    const body = '奖券';
    const spbill_create_ip = ip.address() || '127.0.0.1';
    const notify_url = 'https://www.qq.com';
    const total_fee = event.money;
    const time_stamp = '' + Math.ceil(Date.now() / 1000);
    const out_trade_no = `${tradeNo}`;
    const sign_type = WXPayConstants.SIGN_TYPE_MD5;

    const wxpay = new WXPay({
        appId: APPID,
        mchId: MCHID,
        key: KEY,
        timeout: TIMEOUT,
        signType: sign_type,
        useSandbox: false // 不使用沙箱环境
    })

    let orderParam = {
        body,
        spbill_create_ip,
        notify_url,
        out_trade_no,
        total_fee,
        openid: OPENID,
        trade_type: 'JSAPI'
    };

    // 调用 wx-js-utils 中的统一下单方法
    const {
        return_code,
        ...restData
    } = await wxpay.unifiedOrder(orderParam);

    console.log('微信支付统一下单调用结果:\n', restData)

    let code = 1,
        data = null;

    if (return_code === 'SUCCESS' && restData.result_code === 'SUCCESS') {
        const {
            prepay_id,
            nonce_str
        } = restData;

        // 微信小程序支付要单独进地签名，并返回给小程序端
        const package = `prepay_id=${prepay_id}`
        const sign = WXPayUtil.generateSignature({
            appId: APPID,
            nonceStr: nonce_str,
            package: package,
            signType: 'MD5',
            timeStamp: time_stamp
        }, KEY);

        let orderData = {
            out_trade_no,
            time_stamp,
            nonce_str,
            sign,
            sign_type,
            body,
            total_fee,
            prepay_id,
            sign,
            status: 0, // 订单文档的status 0 未支付 1 已支付 2 已关闭
            _openid: OPENID,
        };

        // 订单数据插入到数据库
        const db = cloud.database()
        orderId = await db.collection('order').add({
            data: orderData
        })._id

        code = 0
        data = {
            nonceStr: nonce_str,
            paySign: sign,
            signType: 'MD5',
            timeStamp: time_stamp,
            package: package,
            orderId: orderId
        }

    } else {
        code = 1
    }

    return {
        code,
        data
    };
}