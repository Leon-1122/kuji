function install(req, request) {
    req.machineLottery = {
        getMachineLotteryList(machineId) {
            const url = `${req.apiUrl}/api/v1/wx/getMachineLotteryList`;
            return request({
                url,
                method: 'GET',
                data: {
                    machineId
                }
            });
        },
        getMachineLotteryDetail(param) {
            const url = `${req.apiUrl}/api/v1/wx/getMachineLotteryDetail`;
            return request({
                url,
                method: 'GET',
                data: param
            });
        },
        getCardRemain(lotteryId) {
            const url = `${req.apiUrl}/api/v1/wx/getCardRemain`;
            return request({
                url,
                method: 'GET',
                data: {
                    lotteryId
                }
            });
        },
        getDrawResult(lotteryId, count) {
            const url = `${req.apiUrl}/api/v1/wx/getDrawResult`;
            return request({
                url,
                method: 'GET',
                data: {
                    lotteryId,
                    count
                }
            });
        },
    };
}

module.exports = {
    install,
};