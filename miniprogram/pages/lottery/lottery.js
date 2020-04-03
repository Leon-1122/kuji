getApp();
const req = require('../../req/index.js');
let userInfo = {},
    userId = '',
    machineId = '',
    isLoggedIn = false,
    lotteryId = '',
    lotteryName = '',
    openStatus = false,
    price = 0,
    sortInfo = {};

Page({
    data: {
        lotteryId: "",
        topImg: "",
        lotteryOrder: 0,
        lotteryLength: 0,
        cardRemain: 0,
        cardTotal: 0,
        price: 0,
        tabListActive: true,
        productPreview: [],
        remainShow: [],
        payModalShow: false,
        cardPayCount: 0,
        cardPayTotal: 0,
        moneyBagRemain: 0,
        lotteryPop: false,
        lastProduct: null,
        stepOne: true,
        drawCount: 0,
        productDrawn: [],
        modalShow: false
    },
    onLoad: function(params) {
        userInfo = wx.getStorageSync('userInfo');
        userId = wx.getStorageSync('mp-req-session-id');
        machineId = wx.getStorageSync("machineId");
        lotteryId = params.mlid;
        lotteryName = params.mlname;

        if (userId && userInfo) {
            isLoggedIn = true;
        }
        this.getData(lotteryId);
    },
    getData: function(lotteryId, callback) {
        var that = this;
        req.machineLottery.getMachineLotteryDetail({
                machineId,
                lotteryId
            })
            .then((res) => {
                console.log(res);
                sortInfo = res.data.sortInfo;

                if (res.data.count === 0) {
                    that.setData({
                        lotteryLength: 0
                    });
                } else if (res.data.lotteryInfo.cardTotal === 0) {
                    that.switchData(1);
                } else {
                    let lotteryInfo = res.data.lotteryInfo;
                    openStatus = lotteryInfo.status === 2 ? true : false;
                    price = lotteryInfo.price;
                    let remainShow = [];
                    lotteryInfo.productPreview.map(function(preview, index) {
                        remainShow[index] = {
                            level: preview.level,
                            total: 0,
                            remain: 0
                        };
                        lotteryInfo.productList.map(function(product) {
                            if (preview.level === product.level) {
                                remainShow[index].total += product.total;
                                remainShow[index].remain += product.remain;
                            }
                        });
                    });

                    that.setData({
                        lotteryId: lotteryId,
                        cardRemain: lotteryInfo.cardRemain,
                        cardTotal: lotteryInfo.cardTotal,
                        topImg: lotteryInfo.topImg,
                        productPreview: lotteryInfo.productPreview,
                        remainShow: remainShow,
                        lotteryOrder: res.data.sortInfo[lotteryInfo.id],
                        lotteryLength: res.data.count,
                        price: lotteryInfo.price,
                        lotteryPop: false,
                        stepOne: true
                    });
                }

                if (callback) {
                    callback();
                }
            })
            .catch((err) => {
                console.error(err);
                wx.showToast({
                    title: "出错啦！请联系客服",
                    icon: "none"
                });
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
    refreshData: function(callback) {
        this.getData(lotteryId, callback);

    },
    onShareAppMessage: function() {
        return {
            title: "".concat(lotteryName, " 一番赏等你来购买！"),
            path: "/pages/lottery/lottery?mlid=".concat(lotteryId, "&mlname=", lotteryName)
        };
    },
    previewTopImg: function() {
        let topImg = this.data.topImg;
        wx.previewImage({
            current: topImg,
            urls: [topImg]
        });
    },
    onSwiperLeft: function() {
        let order = this.data.lotteryOrder,
            totalLength = this.data.lotteryLength;
        if (order > 1) {
            order--;
        } else {
            order = totalLength;
        }
        this.switchData(order);
    },
    onSwiperRight: function() {
        let order = this.data.lotteryOrder,
            totalLength = this.data.lotteryLength;
        if (order < totalLength) {
            order++;
        } else {
            order = 1;
        }
        this.switchData(order);
    },
    switchData: function(order) {
        wx.showLoading({
            title: "加载中"
        });
        let newLotteryId = '';

        for (let key in sortInfo) {
            if (sortInfo[key] === order) {
                newLotteryId = key;
                break;
            }
        }

        this.getData(newLotteryId, wx.hideLoading());
    },
    onTabChange: function(event) {
        this.setData({
            tabListActive: !this.data.tabListActive
        });
    },
    previewProduct: function(event) {
        let productPreview = this.data.productPreview,
            urls = [];
        productPreview.map(function(item) {
            urls.push(item.productImg);
        }), wx.previewImage({
            current: event.currentTarget.dataset.url,
            urls: urls
        });
    },
    previewLastProduct: function(event) {
        wx.previewImage({
            current: event.currentTarget.dataset.url,
            urls: [event.currentTarget.dataset.url]
        });
    },
    previewDrawProduct: function(event) {
        let productDrawn = this.data.productDrawn,
            urls = [];
        productDrawn.map(function(item) {
            urls.push(item.productImg);
        }), wx.previewImage({
            current: event.currentTarget.dataset.url,
            urls: urls
        });
    },
    onGetUserInfo: function(event) {
        let that = this;

        // 更新队列状态
        req.machineLottery.updateQueuePayStep(lotteryId)
            .then((res) => {
                console.log(res);
               
                if (res.code === 0) {
                    if (isLoggedIn) {
                        if (openStatus) {
                            that.data.cardRemain < parseInt(event.currentTarget.dataset.count) ? wx.showToast({
                                title: "余量不足",
                                icon: "none"
                            }) : that.showPayModal(parseInt(event.currentTarget.dataset.count));
                        } else {
                            wx.showToast({
                                title: "此套即将开售，请耐心等待",
                                icon: "none"
                            });
                        }
                    } else {
                        userInfo = event.detail.userInfo
                        if (userInfo) {
                            req.user.updateUserInfo(userInfo)
                                .then((res) => {
                                    console.log(res);
                                    if (res.code === 0) {
                                        wx.setStorageSync('userInfo', userInfo);
                                        isLoggedIn = true;

                                        if (openStatus) {
                                            that.showPayModal(parseInt(event.currentTarget.dataset.count))
                                        } else {
                                            wx.showToast({
                                                title: "此套即将开售，请耐心等待",
                                                icon: "none"
                                            });
                                        }
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
                    }
                } else if (res.code === -10) {
                    that.setData({
                        dialogShow: true,
                        dialogTitle: "通知",
                        dialogContent: "操作时间超时，请重新选择一番赏",
                        dialogButton: [{
                            text: '确定'
                        }]
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
    },
    showPayModal: function(buyNum) {
        let that = this;

        req.user.getUserInfo(userId)
            .then((res) => {
                console.log(res);
                if (res.code === 0) {
                    that.setData({
                        payModalShow: true,
                        cardPayCount: buyNum,
                        cardPayTotal: price * buyNum,
                        moneyBagRemain: res.data.userInfo.moneyBag
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
    closePayModal: function() {
        this.setData({
            payModalShow: false
        });
    },
    moneyBagPay: function() {
        let that = this,
            cardPayCount = this.data.cardPayCount,
            cardPayTotal = this.data.cardPayTotal,
            moneyBagRemain = this.data.moneyBagRemain;

        wx.showLoading({
            title: "加载中"
        });

        if (cardPayTotal > moneyBagRemain) {
            wx.showToast({
                title: "钱袋余额不足",
                icon: "none"
            });
        } else {
            this.checkCount(function() {
                req.machineLottery.moneyBagPay(lotteryId, cardPayCount)
                    .then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            that.callDraw(cardPayCount);
                        } else if (res.code === -10) {
                            wx.hideLoading();
                            this.setData({
                                dialogShow: true,
                                dialogTitle: "通知",
                                dialogContent: "操作时间超时，请重新选择一番赏",
                                dialogButton: [{
                                    text: '确定'
                                }]
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
            });
        }
    },
    wechatPay: function() {
        let that = this;
        wx.showLoading({
            title: "加载中"
        });
        let cardPayCount = this.data.cardPayCount;
        this.checkCount(function() {
            req.machineLottery.wechatPay(lotteryId, cardPayCount)
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        let data = res.data;
                        wx.requestPayment({
                            timeStamp: data.timeStamp,
                            nonceStr: data.nonceStr,
                            package: data.package,
                            signType: data.signType,
                            paySign: data.paySign,
                            success: function(o) {
                                console.log(o);
                                that.callDraw(cardPayCount);
                            },
                            fail: function(o) {
                                console.log(o);
                                wx.showToast({
                                    title: "支付失败",
                                    icon: "none"
                                });
                            }
                        });
                    } else if (res.code === -10) {
                        wx.hideLoading();
                        this.setData({
                            dialogShow: true,
                            dialogTitle: "通知",
                            dialogContent: "操作时间超时，请重新选择一番赏",
                            dialogButton: [{
                                text: '确定'
                            }]
                        });
                    } else {
                        wx.showToast({
                            title: "支付失败",
                            icon: "none"
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                });
        });
    },
    checkCount: function(callback) {
        let that = this,
            cardPayCount = this.data.cardPayCount;

        req.machineLottery.getCardRemain(lotteryId)
            .then((res) => {
                console.log(res);
                if (res.code === 0) {
                    let cardRemain = res.data.cardRemain;

                    if (cardRemain < cardPayCount) {
                        wx.showToast({
                            title: "余量不足",
                            icon: "none"
                        });
                        that.refreshData();
                    } else if (cardRemain === 0) {
                        wx.showToast({
                            title: "此套已售罄",
                            icon: "none"
                        });
                        that.refreshData()
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
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
    refund: function() {
        // wx.cloud.callFunction({
        //     name: "setRefund",
        //     data: {
        //         money: totalFee / 100
        //     }
        // }).then(function(t) {
        //     wx.showToast({
        //         duration: 2e3,
        //         title: "被抢光啦！支付金额已放入钱袋，换一套试试吧！",
        //         icon: "none"
        //     });
        // }).catch(function(t) {
        //     console.error(t);
        // });
    },
    callDraw: function(count) {
        var that = this;

        wx.showLoading({
            title: "加载中"
        });

        req.machineLottery.getDrawResult(lotteryId, count)
            .then((res) => {
                console.log(res);
                if (res.code === 0) {
                    that.setData({
                        lotteryPop: true,
                        payModalShow: false,
                        lastProduct: res.data.lastProduct,
                        drawCount: count,
                        productDrawn: res.data.drawnList
                    });
                    wx.hideLoading();
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
    changeStep: function() {
        this.setData({
            stepOne: !this.data.stepOne
        });
    },
    lotteryClose: function() {
        //this.refreshData();
        // TODO 单次抽奖结束后，退出队列
        wx.switchTab({
            url: "/pages/index/index"
        });
    },
    showBuyInfo: function() {
        this.setData({
            modalShow: true
        });
    },
    closeModal: function() {
        this.setData({
            modalShow: false
        });
    },
    goBag: function() {
        wx.switchTab({
            url: "/pages/bag/bag"
        });
    },
    tapDialogButton() {
        wx.switchTab({
            url: "/pages/index/index"
        });
    },
});