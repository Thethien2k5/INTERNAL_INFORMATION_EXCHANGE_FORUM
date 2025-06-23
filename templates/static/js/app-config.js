const API_CONFIG = {
    BE_PORT: 5000,

    getBaseUrl: function () {
        const hostname = window.location.hostname;
        return `https://${hostname}:${this.BE_PORT}`;
    },

    getApiUrl: function() {
        return this.getBaseUrl();
    },

};