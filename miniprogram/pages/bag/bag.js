getApp(), wx.cloud.database().collection("user");

var t = "", e = {}, o = "", a = 0;

Page({
    data: {
        empty: !1,
        bagList: []
    },
    onShow: function() {
        this.getData();
    },
    onHide: function() {
    },
    onPullDownRefresh: function() {
        this.getData(function() {
            wx.stopPullDownRefresh();
        });
    },
    getData: function(a) {
        var c = this;
        wx.cloud.callFunction({
            name: "getUser"
        }).then(function(s) {
            if (s.result.data.length > 0) {
                var n = s.result.data[0].bagList;
                n && 0 !== n.length ? s.result.data[0].addressObject && s.result.data[0].addressObject.provinceName ? (t = s.result.data[0].address, 
                e = s.result.data[0].addressObject, o = s.result.data[0].addressObject.provinceName, 
                c.setData({
                    bagList: n,
                    empty: !1
                }, a && a())) : (o = !1, c.setData({
                    bagList: n,
                    empty: !1
                }, a && a())) : c.setData({
                    empty: !0
                }, a && a());
            } else c.setData({
                empty: !0
            }, a && a());
        });
    },
    previewProduct: function(t) {
        console.log(t);
        var e = this.data.bagList, o = [];
        e.map(function(t) {
            o.push(t.productImg);
        }), wx.previewImage({
            current: t.currentTarget.dataset.url,
            urls: o
        });
    }
});