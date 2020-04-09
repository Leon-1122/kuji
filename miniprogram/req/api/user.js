function install(req, request) {
    req.user = {
        getUserInfo(userId) {
            const url = `${req.apiUrl}/api/v1/wx/getUserInfo`;
            return request({
                url,
                method: 'GET',
                data: {
                    userId
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
        updateUserInfo(userInfo) {
            const url = `${req.apiUrl}/api/v1/wx/updateUserInfo`;
            return request({
                url,
                method: 'PUT',
                data: {
                    userInfo
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
        reportVisit(machineId) {
            const url = `${req.apiUrl}/api/v1/wx/reportVisit`;
            return request({
                url,
                method: 'PUT',
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
    };
}

module.exports = {
    install,
};