var loginDialog = new Object()
loginDialog.timeInit = 60

//loginDialog.delegate   倒计时界面：this对象
loginDialog.setDelegate = function setDelegate(delegate) {
    loginDialog.delegate = delegate
}

// 倒计时显示可以放到loginDialog.delegate.countDown()方法中单独处理，也可以使用统一的字段显示

loginDialog.startCountTime = function startCountTime() {
    loginDialog.time -= 1;
    loginDialog.delegate.countDown(loginDialog.time)

    // 统一字段显示： loginDialog.delegate.setData({countStr:"xx秒后重新获取",countEnd:false})

    if (loginDialog.time == 0) {
        loginDialog.time = loginDialog.timeInit;
        loginDialog.delegate.countDown(loginDialog.time)
        // 取消
        clearTimeout(loginDialog.timeout)
        return;
    }
    loginDialog.timeout = setTimeout(startCountTime, 1000);
}

loginDialog.stopCountTime = function stopCountTime() {
    clearTimeout(loginDialog.timeout);
}

module.exports = loginDialog;