const API_CONFIG = {
    BE_PORT: 5000,
    BE_HOST: '192.168.123.72', // hoặc '192.168.56.1' tùy theo mạng bạn đang dùng

    getBaseUrl: function () {
        return `https://${this.BE_HOST}:${this.BE_PORT}`;
    },

    getApiUrl: function () {
        return this.getBaseUrl();
    },
};