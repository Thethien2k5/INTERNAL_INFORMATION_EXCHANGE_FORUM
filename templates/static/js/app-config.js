const API_CONFIG = {
    SERVER_HOSTNAME: window.location.hostname,
    BE_PORT: 5000,

    getApiUrl: function() {
        return `https://${this.SERVER_HOSTNAME}:${this.BE_PORT}`;
    }
};