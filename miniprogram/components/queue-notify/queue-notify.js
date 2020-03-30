const loginDialog = require('../../utils/loginDialog/index.js');
const db = wx.cloud.database();

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        timeout: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        startCount: function () {
            loginDialog.time = 60;
            loginDialog.setDelegate(this);
            loginDialog.startCountTime();
        },
        stopCount: function () {
            loginDialog.stopCountTime();
        },
        countDown: function (time) {
            db.collection("test").add({
                data: { countDown: time }
            }).then(res => {
                console.log(res)
            })
                .catch(console.error);
            this.setData({
                timeout: time
            });
        },
    }
})
