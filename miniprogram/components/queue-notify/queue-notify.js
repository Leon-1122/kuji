const req = require('../../req/index.js');
const app = getApp();
const timeInterval = app.globalData.queueSearchInterval ? app.globalData.queueSearchInterval : 30000;

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        lotteryId: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        showQueueModal: false,
        queuenCount: 0,
        queueTime: 0,
        inQueue: false,
        interval: null,
    },

    // 组件生命周期
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            
        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行

        },
    },

    // 数据监听器
    observers: {
        'lotteryId': function (lotteryId) {
            if (!this.data.lotteryId) {
                return;
            }
            this.setQueueInfo();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        startQueue: function() {
            let that = this;
            req.machineLottery.addQueue(this.data.lotteryId)
                .then((res) => {
                    console.log(res);
                    that.setData({
                        inQueue: true,
                    });

                    if (!that.data.interval) {
                        that.data.interval = setInterval(() => {
                            that.countDown(that);
                        }, timeInterval);
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
        cancelQueue: function() {
            let that = this;
            req.machineLottery.quitQueue(this.data.lotteryId)
                .then((res) => {
                    console.log(res);
                    that.setData({
                        inQueue: false,
                    });
                    clearInterval(that.data.interval);
                    that.data.interval = null;
                })
                .catch((err) => {
                    console.error(err);
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                });
        },
        countDown: function(delegate) {
            delegate.setQueueInfo();
            if (delegate.data.queueTime == 0) {
                clearInterval(delegate.data.interval);
                delegate.data.interval = null;
            }
        },
        setQueueInfo: function() {
            let that = this;
            req.machineLottery.getQueue(this.data.lotteryId)
                .then((res) => {
                    console.log(res);
                    if (res.data.queueCount === 0 || res.data.inUse) {
                        that.setData({
                            showQueueModal: false,
                            queueCount: res.data.queueCount,
                            queueTime: res.data.queueTime,
                            inQueue: res.data.inQueue
                        });
                    } else {
                        that.setData({
                            showQueueModal: true,
                            queueCount: res.data.queueCount,
                            queueTime: res.data.queueTime,
                            inQueue: res.data.inQueue
                        });

                        if (!that.data.interval) {
                            that.data.interval = setInterval(() => {
                                that.countDown(that);
                            }, timeInterval);
                        }
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
    }
})