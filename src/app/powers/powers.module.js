(function () {
    'use strict';

    angular.module('BlurAdmin.power', [
        'ui.router',
        'Lodash',
        'BlurAdmin.power.device',
        'BlurAdmin.power.alarm',
        'BlurAdmin.power.report',
        'BlurAdmin.power.train',
        'BlurAdmin.power.techQa',
        'BlurAdmin.power.setuser',
        'BlurAdmin.power.setprice',
        'BlurAdmin.power.setaccount',
        'BlurAdmin.power.meeting',
        'BlurAdmin.power.safetyDay',
        'BlurAdmin.power.workTicket',
        'BlurAdmin.power.operatingWeekly',
        'BlurAdmin.power.equipmentDefect',
        'BlurAdmin.power.accidentExpected',
    ])
        .config(routeConfig)
        .run(initialize);

    /** @ngInject */
    function routeConfig($urlRouterProvider) {

        $urlRouterProvider.otherwise('/device');
    }

    function initialize(EventsCache, $rootScope, $interval,$window) {
        console.log('initialize...');
        //EventsCache.login();
        //$window.localStorage.clear();
    }
})();
