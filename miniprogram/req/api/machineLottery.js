function install(req, request) {
    req.machineLottery = {
        getMachineLotteryList(machineId) {
            const url = `${req.apiUrl}/api/v1/wx/getMachineLotteryList`;
            return request({
                url,
                method: 'GET',
                data: {
                    machineId
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        },
        getMachineLotteryDetail(param) {
            const url = `${req.apiUrl}/api/v1/wx/getMachineLotteryDetail`;
            return request({
                url,
                method: 'GET',
                data: param,
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        },
        getCardRemain(lotteryId) {
            const url = `${req.apiUrl}/api/v1/wx/getCardRemain`;
            return request({
                url,
                method: 'GET',
                data: {
                    lotteryId
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        },
        getDrawResult(lotteryId, count) {
            const url = `${req.apiUrl}/api/v1/wx/getDrawResult`;
            return request({
                url,
                method: 'GET',
                data: {
                    lotteryId,
                    count
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
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
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
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
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        },
        getQueue(lotteryId) {
            const url = `${req.apiUrl}/api/v1/wx/getQueue`;
            return request({
                url,
                method: 'GET',
                data: {
                    lotteryId
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        },
        addQueue(lotteryId) {
            const url = `${req.apiUrl}/api/v1/wx/addQueue`;
            return request({
                url,
                method: 'PUT',
                data: {
                    lotteryId
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        },
        quitQueue(lotteryId) {
            const url = `${req.apiUrl}/api/v1/wx/quitQueue`;
            return request({
                url,
                method: 'PUT',
                data: {
                    lotteryId
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        },
        updateQueuePayStep(lotteryId) {
            const url = `${req.apiUrl}/api/v1/wx/updateQueuePayStep`;
            return request({
                url,
                method: 'PUT',
                data: {
                    lotteryId
                },
                fail: function (err) {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                },
            });
        }
    };
}

module.exports = {
    install,
};