getApp();

var t = wx.cloud.database(), e = t.collection("user"), n = !1;

Page({
    data: {
        userInfo: null,
        showOpenSettingBtn: !1
    },
    onShow: function() {
        this.getUser();
    },
    getUser: function(t) {
        var e = this;
        wx.cloud.callFunction({
            name: "getUser"
        }).then(function(o) {
            o.result.data.length > 0 ? (n = !0, e.setData({
                userInfo: o.result.data[0]
            }, t && t())) : n = !1;
        });
    },
    onGetUserInfo: function(o) {
        var s = this;
        if (!n) {
            var a = o.detail.userInfo, c = wx.getStorageSync("inviteCode");
            c && (a.inviteCode = c), a.moneyBag = 0, a.bagList = [], a.createTime = t.serverDate(), 
            e.add({
                data: a
            }).then(function(t) {
                n = !0, s.setData({
                    userInfo: a
                });
            }).catch(function(t) {
                console.error(t);
            });
        }
    },
    openSetting: function() {
        var t = this;
        wx.getSetting({
            success: function(e) {
                e.authSetting["scope.address"] && t.chooseAddress(function() {
                    t.setData({
                        showOpenSettingBtn: !1
                    });
                });
            }
        });
    },
    onAddressManage: function() {
        this.data.userInfo ? this.chooseAddress() : wx.showToast({
            title: "请先登录",
            icon: "none"
        });
    },
    chooseAddress: function(t) {
        var e = this;
        wx.chooseAddress({
            success: function(n) {
                wx.showLoading({
                    title: "加载中"
                });
                var o = "".concat(n.provinceName).concat(n.cityName).concat(n.countyName).concat(n.detailInfo, ",").concat(n.userName, ",").concat(n.telNumber);
                console.log(n);
                wx.cloud.callFunction({
                    name: "setAddress",
                    data: {
                        address: o,
                        addressObject: n,
                        phoneNumber: n.telNumber
                    }
                }).then(function(n) {
                    e.getUser(function() {
                        wx.hideLoading();
                    }), t && t();
                }).catch(function(t) {
                    console.error(t);
                });
            },
            fail: function(t) {
                wx.getSetting({
                    success: function(t) {
                        t.authSetting["scope.address"] || e.setData({
                            showOpenSettingBtn: !0
                        });
                    }
                });
            }
        });
    }
});