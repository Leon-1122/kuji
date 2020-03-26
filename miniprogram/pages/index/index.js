getApp();

var machineId = '', t = wx.cloud.database();

Page({
    data: {
        project: []
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
    getData: function(e) {
        var n = this;
        t.collection("project").where({
            machineId: machineId
        }).orderBy("order", "desc").get().then(function(t) {
            console.log(t.data);
            n.setData({
                project: t.data
            }, e && e());
        }).catch(function(t) {
            console.error(t);
        });
    },
    onBannerImgTap: function(t) {
        var e = t.currentTarget.dataset, n = e.pjid, o = e.pjname;
        e.cantap ? wx.navigateTo({
            url: "/pages/lottery/lottery?pjid=".concat(n, "&pjname=").concat(o)
        }) : wx.showToast({
            title: "已售罄",
            icon: "none"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "快来购买一番赏吧！",
            path: "/pages/index/index"
        };
    }
});