getApp();

const req = require('../../req/index.js');
let machineId = '';

Page({
    data: {
        lotteryList: []
    },
    onLoad: function(param) {
        console.log(param);
        if (param.machineId) {
            machineId = param.machineId;
        }
        wx.setStorageSync("machineId", machineId);
    },
    onShow: function() {
        this.getData();
    },
    onPullDownRefresh: function() {
        this.getData(wx.stopPullDownRefresh);
    },
    getData: function(callback) {
        let that = this;
        req.machineLottery.getMachineLotteryList(machineId)
            .then((res) => {
                console.log(res);
                if (res.data.lotteryList) {
                    that.setData({
                        lotteryList: res.data.lotteryList
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
    onBannerImgTap: function(event) {
        var data = event.currentTarget.dataset;
        if (data.cantap) {
            wx.navigateTo({
                url: "/pages/lottery/lottery?mlid=".concat(data.mlid, "&mlname=", data.mlname)
            })
        } else {
            wx.showToast({
                title: "已售罄",
                icon: "none"
            });
        }
    },
    onShareAppMessage: function() {
        return {
            title: "快来购买一番赏吧！",
            path: "/pages/index/index?machineId".concat(machineId)
        };
    }
});