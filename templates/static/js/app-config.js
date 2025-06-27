(function(window){

    if (typeof window.API_CONFIG !== 'undefined') return;

    window.API_CONFIG = {
        BE_PORT:5000,

        getBaseUrl: function() {
            const hostname = window.location.hostname;
            return `https://${hostname}:${this.BE_PORT}`;
        },

        getApiUrl: function() {
            return this.getBaseUrl();
        },

    };
})(window);

