getApp();

var Const = require('../../utils/const.js');
var userId = wx.getStorageSync('userId');

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

        var code, encryptedData = o.detail.encryptedData, iv = o.detail.iv;
        console.log(o.detail.encryptedData);
        console.log(o.detail.iv);
        
        wx.login({
            success: function(res) {
                console.log(res.code);
                code = res.code;

                wx.request({
                    url: Const.getUrl() + 'login',
                    method: 'POST',
                    data: {
                        code,
                        encryptedData,
                        iv
                    },
                    success: function(res) {
                        console.log(res.data);
                        userId = res.data.userId;
                        wx.setStorageSync('userId', userId);
                    },
                    fail: function(e) {
                        console.error(e);
                        wx.showToast({
                            title: "出错啦！请联系客服",
                            icon: "none"
                        });
                    }
                });
            }
        })
    },
    getUser: function(t) {
        var that = this;
        if (userId) {
            wx.request({
                url: Const.getUrl() + 'getUserInfo',
                method: 'GET',
                data: {
                    userId
                },
                success: function(res) {
                    console.log(res.data);

                    if (res.data.userInfo) {
                        that.setData({
                            userInfo: res.data.userInfo
                        });
                    } else {
                        wx.removeStorageSync('userId');
                        userId = null;
                    }
                },
                fail: function(e) {
                    console.error(e);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                }
            });
        }
    }
});