getApp();
const machineCode = wx.getStorageSync("machineCode"), db = wx.cloud.database();
let projectDetailId = '';

Page({
    data: {
        carWidth: '', //卡片宽度
        number: 1,
        cardData: []
    },
    onLoad(t) {
        let count = t.count, carWidth = 0, cardData = [], that = this;
        projectDetailId = t.projectDetailId;
        // 获取奖池信息
        db.collection('project-detail').where({
            _id: projectDetailId
        }).field({
            productList: true,
        }).get().then(function (result) {
            console.log(result);
            let productList = result.data[0].productList, id = 0;
            productList.map(function (product, index) {
                if (product.level !== 'Last One') {
                    for (var i = product.total, j = product.remain; i > 0; i--,j--) {
                        var show = true, disabled = true, opacity = true;
                        if (j > 0) {
                            show = false;
                            disabled = false;
                            opacity = false;
                        }
                        cardData.push(
                            {
                                front: '../../icon/ticket_back2.jpg',
                                back: product.productImg,
                                id: ++id,
                                showClass: show,
                                opacity: false,
                                level: product.level,
                                name: product.name,
                                sku: product.sku,
                                disabled: disabled,
                                opacity: opacity
                            }
                        );
                    }
                }
            });
            console.log(cardData);
            cardData.sort(that.randomsort);
            that.setData({
                cardData,
                number: count
            })
        });

        this.addPosition(cardData); // 数组添加移动坐标位置
        wx.getSystemInfo({
            success(res) {
                carWidth = parseInt((res.windowWidth - 40) / 3);

            }
        })
        this.setData({
            carWidth
        })
                            
    },

    // 数组添加移动坐标值 并且把所有的disabled 状态还原会false 
    addPosition(cardData){
        const lineTotal = 3 // 单行数
        cardData.map((item, index) => {
            let x = index % lineTotal
            let y = parseInt(index / lineTotal)
            item.twoArry = { x, y }
            item.disabled = false;   // 还原所有的disabled 状态
        })
        this.setData({cardData})
    },

    //全部翻转
    allChange() {
        const { cardData } = this.data
        cardData.map(item => {
            if (!item.showClass) {
                item.showClass = true;
            }
        })
        this.setData({
            cardData
        })
    },

    //洗牌
    allMove() {
        const { carWidth, cardData } = this.data;
        // 110 是卡牌宽度加边距
        this.shuffle(carWidth) //移动到中心,  110 是牌的宽度，加上外边距边框
        let timer = setTimeout(() => {
            // 每次移动到中心位置以后，先打乱数组顺序，给数组每一项重新添加移动坐标值，setData({cardData}) 然后在散开
            cardData.sort(this.randomsort);
            this.addPosition(cardData)
            clearTimeout(timer)
            this.shuffle(0) // 间隔1秒钟，移动到原来位置
        }, 1000)
    },
    // 洗牌函数
    shuffle(translateUnit) {
        let { cardData } = this.data;
        console.log(cardData)
        cardData.map((item, index) => {
            let animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease'
            })
            animation.export()
            const translateUnitX = translateUnit * (1 - item.twoArry.x)
            const translateUnitY = translateUnit * (1 - item.twoArry.y)
            animation.translate(translateUnitX, translateUnitY).step()
            item.animationData = animation.export()
            item.opacity = false;
            if (item.showClass) {
                item.showClass = false;
            }
        })
        this.setData({
            cardData
        })
    },

    // 打乱数组顺序
    randomsort(a, b) {
        return Math.random()>.5 ? -1 : 1;
        //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    },

    // 处理单个点击翻转
    handleCurClick(event) {
        let curId = event.currentTarget.dataset.id;
        // 每次点击时获取被点击拍的disable 属性，
        let disabled = event.currentTarget.dataset.disabled;
        //如果为true 就返回不继续向下执行
        if(disabled){
           return; 
        }
        let { cardData, number, carWidth } = this.data;
        let that = this, name = '', sku = '';

        cardData.forEach(item => {
            if (item.id === curId) {
                name = item.name;
                sku = item.sku;
                item.showClass = true;
                item.disabled = true;
                return;
            }
        });

        // 扣除库存并添加到奖袋
        wx.cloud.callFunction({
            name: "updateDrawResult",
            data: {
                projectDetailId: projectDetailId,
                sku: sku,
                count: 1
            }
        }).then(function(o) {
            if (o.result.success) {
                number--;

                if (number <= 0) {
                    cardData.forEach(item => {
                        item.disabled = true;
                    });
                }

                that.setData({
                    cardData,
                    number
                })

                setTimeout(() => {
                    wx.showModal({
                        title: '提示',
                        content: '恭喜您抽中' + name + '！',
                        showCancel: false,
                        confirmText: number <= 0 ? '结束' : '再翻一次',
                        success(res) {
                            if (number <= 0) {
                                wx.switchTab({
                                    url: "/pages/bag/bag"
                                });
                            }
                        }
                    })
                }, 500);
            } else {
                if (o.result.errorCode === 'oversell') {
                    that.setData({
                        cardData,
                        number
                    })

                    setTimeout(() => {
                        wx.showModal({
                            title: '提示',
                            content: '该奖品库存不足，请重新抽取！',
                            showCancel: false,
                            confirmText: number <= 0 ? '结束' : '再翻一次',
                            success(res) {
                                if (number <= 0) {
                                    wx.switchTab({
                                        url: "/pages/bag/bag"
                                    });
                                }
                            }
                        })
                    }, 500);
                } else {
                    wx.showToast({
                        title: "出错啦！请联系客服",
                        icon: "none"
                    });
                }
            }
            
        }).catch(function(t) {
            wx.showToast({
                title: "出错啦！请联系客服",
                icon: "none"
            });
        });
    }
})