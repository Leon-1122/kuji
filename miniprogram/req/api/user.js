function install(req, request) {
    req.user = {
        getUserInfo(userId) {
            const url = `${req.apiUrl}/api/v1/wx/getUserInfo`;
            return request({
                url,
                method: 'GET',
                data: {
                    userId
                }
            });
        },
        updateUserInfo(userInfo) {
            const url = `${req.apiUrl}/api/v1/wx/updateUserInfo`;
            return request({
                url,
                method: 'PUT',
                data: {
                    userInfo
                }
            });
        },
        moneyBagPay(lotteryId, num) {
            const url = `${req.apiUrl}/api/v1/wx/moneyBagPay`;
            return request({
                url,
                method: 'PUT',
                data: {
                    lotteryId,
                    num,
                }
            });
        },
        wechatPay(lotteryId, num) {
            const url = `${req.apiUrl}/api/v1/wx/wechatPay`;
            return request({
                url,
                method: 'PUT',
                data: {
                    lotteryId,
                    num
                }
            });
        },
    };
}

module.exports = {
    install,
};