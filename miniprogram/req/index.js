const req = require('../utils/mp-req/index.js');
// api
const userApi = require('./api/user.js');
const machineLotteryApi = require('./api/machineLottery.js');

const apiUrlTable = {
    local: 'http://localhost:1337',
    pre: 'https://stg-mp-req.leanapp.cn',
    release: 'https://mp-req.leanapp.cn',
};
const apiUrl = apiUrlTable.local;
const sessionHeaderKey = 'userid';

/**
 * code换取sessionId
 * @param {string} code
 */
function code2sessionId(code, userInfo) {
    return new Promise((res, rej) => {
        wx.request({
            url: `${apiUrl}/api/v1/wx/login`,
            method: 'POST',
            data: {
                code
            },
            success(r1) {
                if (r1.data && r1.data.code === 0) {
                    res(r1.data.data.sessionId);
                } else {
                    rej(r1);
                }
            },
            fail: rej,
        });
    });
}

/**
 * 检查session是否有效
 * @param {any} res
 */
function isSessionAvailable(res) {
    // 永不过期
    return true;
}

req.init({
    apiUrl,
    code2sessionId,
    isSessionAvailable,
    sessionHeaderKey
});

req.use(userApi);
req.use(machineLotteryApi);

module.exports = req;