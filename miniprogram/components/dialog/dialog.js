Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true
    },
    properties: {
        title: {
            type: String,
            value: ''
        },
        extClass: {
            type: String,
            value: ''
        },
        maskClosable: {
            type: Boolean,
            value: true
        },
        mask: {
            type: Boolean,
            value: true
        },
        show: {
            type: Boolean,
            value: false,
            observer: '_showChange'
        },
        buttons: {
            type: Array,
            value: []
        }
    },
    data: {
        innerShow: false
    },
    ready: function ready() {
        var buttons = this.data.buttons;
        var len = buttons.length;
        buttons.forEach(function(btn, index) {
            if (len === 1) {
                btn.className = 'weui-dialog__btn_primary';
            } else if (index === 0) {
                btn.className = 'weui-dialog__btn_default';
            } else {
                btn.className = 'weui-dialog__btn_primary';
            }
        });
        this.setData({
            buttons: buttons
        });
    },

    methods: {
        buttonTap: function buttonTap(e) {
            var index = e.currentTarget.dataset.index;

            this.triggerEvent('buttontap', {
                index: index,
                item: this.data.buttons[index]
            }, {});
        },
        close: function close() {
            var data = this.data;
            if (!data.maskClosable) return;
            this.setData({
                show: false
            });
            this.triggerEvent('close', {}, {});
        },
        stopEvent: function stopEvent() {}
    }
});