getApp();

const req = require('../../req/index.js');
let userId = wx.getStorageSync('mp-req-session-id');

Page({
    data: {
        userInfo: null
    },
    onShow: function() {
        this.getUser();
    },
    login: function(o) {
        if (userId) {
            return;
        }

        var code, userInfo = o.detail.userInfo,
            that = this;
        req.user.updateUserInfo(userInfo)
            .then((res) => {
                console.log(res);
                if (res.code === 0) {
                    that.setData({
                        userInfo: res.data.userInfo
                    });
                } else {
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                wx.showToast({
                    title: "出错啦！请联系客服",
                    icon: "none"
                });
            });
    },
    getUser: function(t) {
        var that = this;
        if (userId) {
            req.user.getUserInfo(userId)
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        that.setData({
                            userInfo: res.data.userInfo
                        });
                    } else {
                        wx.showToast({
                            title: "出错啦！请联系客服",
                            icon: "none"
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                });
        }
    }
});