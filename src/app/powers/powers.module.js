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

        'BlurAdmin.power.demo',
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
        $urlRouterProvider.otherwise('/demo');
        //
        // baSidebarServiceProvider.addStaticItem({
        //     title: '时代金融',
        //     icon: 'ion-grid',
        //     subMenu: [{
        //         title: '万6迪威行甲线',
        //         icon: 'ion-record',
        //         subMenu: [{
        //             title: '供水支线',
        //             icon: 'ion-flame',
        //             stateRef: 'device'
        //         }]
        //     }]
        // });

    }

})();
