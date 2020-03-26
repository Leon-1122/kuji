getApp();

const req = require('../../req/index.js');
let userId = wx.getStorageSync('mp-req-session-id');

Page({
    data: {
        empty: true,
        bagList: []
    },
    onShow: function() {
        this.getData();
    },
    onHide: function() {},
    onPullDownRefresh: function() {
        this.getData(function() {
            wx.stopPullDownRefresh();
        });
    },
    getData: function(callback) {
        var that = this;

        if (userId) {
            req.user.getUserInfo(userId)
                .then((res) => {
                    console.log(res);
                    if (res.data.userInfo) {
                        let bagList = res.data.userInfo.bagList;
                        if (bagList && bagList.length > 0) {
                            that.setData({
                                bagList: bagList,
                                empty: false
                            });
                        } else {
                            that.setData({
                                empty: true
                            });
                        }
                    } else {
                        that.setData({
                            empty: true
                        });
                    }

                    if (callback) {
                        callback();
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
    },
    previewProduct: function(event) {
        var bagList = this.data.bagList,
            urls = [];
        bagList.map(function(currentValue) {
            urls.push(currentValue.productImg);
        }), wx.previewImage({
            current: event.currentTarget.dataset.url,
            urls: urls
        });
    },
});