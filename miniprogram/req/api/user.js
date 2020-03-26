function install(req, request) {
    req.user = {
        getUserInfo(userId) {
            const url = `${req.apiUrl}/api/v1/wx/getUserInfo`;
            return request({
                url,
                method: 'GET',
                data: {
                    userId
                }
            });
        },
        updateUserInfo(userInfo) {
            const url = `${req.apiUrl}/api/v1/wx/updateUserInfo`;
            return request({
                url,
                method: 'PUT',
                data: {
                    userInfo
                }
            });
        },
    };
}

module.exports = {
    install,
};