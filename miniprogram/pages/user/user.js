getApp();

const req = require('../../req/index.js');
let userId = '',
    userInfo = {};

Page({
    data: {
        userInfo: null
    },
    onShow: function() {
        userId = wx.getStorageSync('mp-req-session-id');
        userInfo = wx.getStorageSync('userInfo');
        this.getUser();
    },
    login: function(event) {
        if (userInfo) {
            return;
        }
        userInfo = event.detail.userInfo
        let that = this;

        if (userInfo) {
            req.user.updateUserInfo(userInfo)
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        wx.setStorageSync('userInfo', userInfo);
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
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                });
        }
    },
    getUser: function(t) {
        let that = this;
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