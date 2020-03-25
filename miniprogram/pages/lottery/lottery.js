getApp();

var t = wx.cloud.database(),
    a = (t.command, t.command.aggregate, t.collection("user")),
    e = !1,
    n = "",
    o = "",
    r = !1,
    i = "",
    c = 0,
    price = 0,
    machineCode = wx.getStorageSync("machineCode");

Page({
    data: {
        topImg: "",
        projectOrder: 0,
        projectLength: 0,
        cardRemain: 0,
        cardTotal: 0,
        price: 0,
        tabListActive: !0,
        productPreview: [],
        remainShow: [],
        payModalShow: !1,
        cardPayCount: 0,
        cardPayTotal: 0,
        moneyBagRemain: 0,
        lotteryPop: !1,
        lastProduct: null,
        stepOne: !0,
        drawCount: 0,
        productDrawed: [],
        modalShow: !1
    },
    onLoad: function(t) {
        console.log('machineCode:' + machineCode);
        this.getUser(), n = t.pjid, o = t.pjname, this.getData(n);
    },
    getUser: function() {
        wx.cloud.callFunction({
            name: "getUser"
        }).then(function(t) {
            e = t.result.data.length > 0;
        });
    },
    getData: function(a, e) {
        var n = this;
        var projectId = a;
        t.collection('project-detail').where({
            machineCode: machineCode
        }).orderBy("order", "asc").get().then(function(t) {
            var a = !0;
            console.log(t);
            if (t.data.map(function(t) {
                    t.cardRemain > 0 && (a = !1);
                }), a) n.setData({
                projectLength: t.data.length
            }), n.switchData(1);
            else {
                var o = !0,
                    c = !1,
                    s = void 0,
                    y = void 0;
                try {
                    for (var l, u = t.data[Symbol.iterator](); !(o = (l = u.next()).done); o = !0) {
                        var d = l.value;
                        if (d.cardRemain > 0 && d.projectId === projectId)
                            if ("break" === function() {
                                    var a = d._id,
                                        o = d.order,
                                        c = d.openStatus,
                                        s = d.cardRemain,
                                        y = d.cardTotal,
                                        l = d.topImg,
                                        u = d.productPreview,
                                        h = d.productList;
                                    r = c, i = a, price = d.price;
                                    var w = [];
                                    return u.map(function(t, a) {
                                        w[a] = {
                                            level: t.level
                                        }, w[a].total = 0, w[a].remain = 0, h.map(function(e) {
                                            e.level === t.level && (w[a].total += e.total, w[a].remain += e.remain);
                                        });
                                    }), n.setData({
                                        cardRemain: s,
                                        cardTotal: y,
                                        topImg: l,
                                        productPreview: u,
                                        remainShow: w,
                                        projectOrder: o,
                                        projectLength: t.data.length,
                                        price: price
                                    }, e && e()), "break";
                                }()) break;
                    }
                } catch (t) {
                    c = !0, s = t;
                } finally {
                    try {
                        o || null == u.return || u.return();
                    } finally {
                        if (c) throw s;
                    }
                }
            }
        });
    },
    onPullDownRefresh: function() {
        this.refreshData(wx.stopPullDownRefresh());
    },
    tapRefresh: function() {
        wx.showLoading({
            title: "加载中"
        }), this.refreshData(wx.hideLoading());
    },
    refreshData: function(a) {
        var e = this;
        t.collection('project-detail').doc(i).get().then(function(t) {
            var n = t.data,
                o = n._id,
                c = n.order,
                s = n.openStatus,
                l = n.cardRemain,
                y = n.cardTotal,
                u = n.topImg,
                d = n.productPreview,
                h = n.productList;
            r = s, i = o, price = n.price;
            var w = [];
            d.map(function(t, a) {
                w[a] = {
                    level: t.level
                }, w[a].total = 0, w[a].remain = 0, h.map(function(e) {
                    e.level === t.level && (w[a].total += e.total, w[a].remain += e.remain);
                });
            }), e.setData({
                cardRemain: l,
                cardTotal: y,
                topImg: u,
                productPreview: d,
                remainShow: w,
                projectOrder: c,
                lotteryPop: !1,
                stepOne: !0,
                price: price
            }, a && a());
        });
    },
    onShareAppMessage: function() {
        return {
            title: "".concat(o, " 一番赏等你来购买！"),
            path: "/pages/lottery/lottery?pjid=".concat(n, "&pjname=").concat(o)
        };
    },
    previewTopImg: function() {
        var t = this.data.topImg;
        wx.previewImage({
            current: t,
            urls: [t]
        });
    },
    onSwiperLeft: function() {
        var t = this.data,
            a = t.projectOrder,
            e = t.projectLength;
        a > 1 ? a -= 1 : a = e, this.switchData(a);
    },
    onSwiperRight: function() {
        var t = this.data,
            a = t.projectOrder;
        a < t.projectLength ? a += 1 : a = 1, this.switchData(a);
    },
    switchData: function(a) {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), t.collection('project-detail').where({
            machineCode: machineCode, 
            order: a
        }).get().then(function(t) {
            var a = t.data[0],
                n = a._id,
                o = a.order,
                c = a.openStatus,
                s = a.cardRemain,
                y = a.cardTotal,
                l = a.topImg,
                u = a.productPreview,
                d = a.productList;
            r = c, i = n;
            var h = [];
            u.map(function(t, a) {
                h[a] = {
                    level: t.level
                }, h[a].remain = 0, d.map(function(e) {
                    e.level === t.level && (h[a].total = e.total, h[a].remain += e.remain);
                });
            }), e.setData({
                cardRemain: s,
                cardTotal: y,
                topImg: l,
                productPreview: u,
                remainShow: h,
                projectOrder: o
            }, wx.hideLoading());
        });
    },
    onTabChange: function(t) {
        this.setData({
            tabListActive: !this.data.tabListActive
        });
    },
    previewProduct: function(t) {
        var a = this.data.productPreview,
            e = [];
        a.map(function(t) {
            e.push(t.productImg);
        }), wx.previewImage({
            current: t.currentTarget.dataset.url,
            urls: e
        });
    },
    previewLastProduct: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.url,
            urls: [t.currentTarget.dataset.url]
        });
    },
    previewDrawProduct: function(t) {
        var a = this.data.productDrawed,
            e = [];
        a.map(function(t) {
            e.push(t.productImg);
        }), wx.previewImage({
            current: t.currentTarget.dataset.url,
            urls: e
        });
    },
    onGetUserInfo: function(n) {
        var o = this;
        if (e) {
            if (r) this.data.cardRemain < parseInt(n.currentTarget.dataset.count) ? wx.showToast({
                title: "余量不足",
                icon: "none"
            }) : this.showPayModal(parseInt(n.currentTarget.dataset.count));
            else wx.showToast({
                title: "此套即将开售，请耐心等待",
                icon: "none"
            });
        } else {
            var i = n.detail.userInfo;
            i.moneyBag = 0, i.bagList = [], i.createTime = t.serverDate(),
                a.add({
                    data: i
                }).then(function(t) {
                    e = !0, r ? o.showPayModal(parseInt(n.currentTarget.dataset.count)) : wx.showToast({
                        title: "此套即将开售，请耐心等待",
                        icon: "none"
                    });
                }).catch(function(t) {
                    console.error(t);
                });
        }
    },
    showPayModal: function(t) {
        var a = this;
        this.setData({
            payModalShow: !0,
            cardPayCount: t,
            cardPayTotal: price * t
        }), wx.cloud.callFunction({
            name: "getUser"
        }).then(function(t) {
            var e = 0;
            t.result.data[0].moneyBag && (e = t.result.data[0].moneyBag), a.setData({
                moneyBagRemain: e
            });
        });
    },
    closePayModal: function() {
        this.setData({
            payModalShow: !1
        });
    },
    moneyBagPay: function() {
        var t = this;
        wx.showLoading({
            title: "加载中"
        });
        var a = this.data,
            e = a.cardPayCount,
            o = a.cardPayTotal,
            r = a.moneyBagRemain;
        o > r ? wx.showToast({
            title: "钱袋余额不足",
            icon: "none"
        }) : this.checkCount(function() {
            c = price * 100 * e, wx.cloud.callFunction({
                name: "setMoneyBag",
                data: {
                    money: r - o
                }
            }).then(function(a) {
                t.callDraw(i, e);
            }).catch(console.error);
        });
    },
    wechatPay: function() {
        var t = this;
        wx.showLoading({
            title: "加载中"
        });
        var a = this.data.cardPayCount;
        this.checkCount(function() {
            c = price * 100 * a, wx.cloud.callFunction({
                name: "getPayInfo",
                data: {
                    orderId: "" + Date.parse(new Date()) + Math.round(1e3 * Math.random()),
                    money: c
                }
            }).then(function(e) {
                var o = e.result;
                if (o.code === 0) {
                    r = o.data.nonceStr, c = o.data.paySign, s = o.data.signType, l = o.data.timeStamp;
                    wx.requestPayment({
                        timeStamp: l,
                        nonceStr: r,
                        package: o.data.package,
                        signType: s,
                        paySign: c,
                        success: function(e) {
                            t.callDraw(i, a);
                        },
                        fail: function(t) {
                            wx.hideLoading(), wx.showToast({
                                title: "支付失败",
                                icon: "none"
                            });
                        }
                    });
                } else {
                    wx.hideLoading(), wx.showToast({
                        title: "支付失败",
                        icon: "none"
                    });
                }
            });
        });
    },
    checkCount: function(a) {
        var e = this,
            o = this.data.cardPayCount;
        t.collection('project-detail').doc(i).get().then(function(t) {
            var n = t.data.cardRemain;
            n < 5 && 5 === o ? (wx.showToast({
                title: "余量不足",
                icon: "none"
            }), e.refreshData()) : n < 3 && (3 === o || 5 === o) ? (wx.showToast({
                title: "余量不足",
                icon: "none"
            }), e.refreshData()) : 0 === n ? (wx.showToast({
                title: "此套已售罄",
                icon: "none"
            }), e.refreshData()) : a && a();
        });
    },
    refund: function() {
        wx.cloud.callFunction({
            name: "setRefund",
            data: {
                money: c / 100
            }
        }).then(function(t) {
            wx.showToast({
                duration: 2e3,
                title: "被抢光啦！支付金额已放入钱袋，换一套试试吧！",
                icon: "none"
            });
        }).catch(function(t) {
            console.error(t);
        });
    },
    callDraw: function(a, e) {
        var n = this;

        // // 跳转到翻奖页面
        // wx.navigateTo({
        //     url: '../luckDraw/luckDraw?projectDetailId='.concat(a, '&count=').concat(e)
        // });
        
        wx.showLoading({
            title: "加载中"
        });
        wx.cloud.callFunction({
            name: "getDrawResult",
            data: {
                projectDetailId: a,
                count: e
            }
        }).then(function(o) {
            o.result.updateFail ? n.callDraw(a, e) : o.result.callRefund ? n.refund() : (console.log(o.result)
                , o.result.last ? n.setData({
                    lotteryPop: !0,
                    payModalShow: !1,
                    lastProduct: o.result.last,
                    drawCount: e,
                    productDrawed: o.result.list
                }, function() {
                    wx.hideLoading();
                }) : n.setData({
                    lotteryPop: !0,
                    payModalShow: !1,
                    lastProduct: null,
                    drawCount: e,
                    productDrawed: o.result.list
                }, function() {
                    wx.hideLoading();
                }));
        }).catch(function(t) {
            wx.showToast({
                title: "出错啦！请联系客服",
                icon: "none"
            });
        });
    },
    changeStep: function() {
        var t = this.data.stepOne;
        this.setData({
            stepOne: !t
        });
    },
    lotteryClose: function() {
        this.refreshData();
    },
    showBuyInfo: function() {
        this.setData({
            modalShow: !0
        });
    },
    closeModal: function() {
        this.setData({
            modalShow: !1
        });
    },
    goBag: function() {
        wx.switchTab({
            url: "/pages/bag/bag"
        });
    }
});