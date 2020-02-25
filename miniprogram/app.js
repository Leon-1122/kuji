App({
    onLaunch: function() {
        wx.cloud ? wx.cloud.init({
            env: "cloud-rhf5t",
            traceUser: !0
        }) : console.error("请使用 2.2.3 或以上的基础库以使用云能力"), this.globalData = {};
    }
});