const API_CONFIG = {
    getBaseUrl: function() {
        const hostname = window.location.hostname;
        return `https://${hostname}:${this.BE_PORT}`;
    },

    getApiUrl: function() {
        return this.getBaseUrl();
    },

};