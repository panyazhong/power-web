(function () {
    'use strict';

    angular.module('BlurAdmin.power', [
        'ui.router',
        'Lodash',

        'BlurAdmin.power.overview',
        'BlurAdmin.power.monitoring',
        'BlurAdmin.power.device',
        'BlurAdmin.power.events',
        'BlurAdmin.power.checkin',
        'BlurAdmin.power.history',
        'BlurAdmin.power.report',
        'BlurAdmin.power.settings',
        'BlurAdmin.power.branch',
        'BlurAdmin.power.setuser',
        'BlurAdmin.power.setpwd',
        'BlurAdmin.power.setalarm'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider) {

        $urlRouterProvider.otherwise('/overview');  // 默认进入概况总览

    }

})();
