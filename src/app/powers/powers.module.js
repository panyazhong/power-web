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

        // baSidebarServiceProvider.addStaticItem({
        //     title: '时代金融',
        //     icon: 'ion-grid',
        //     subMenu: [{
        //         title: '万6迪威行甲线',
        //         icon: 'ion-record',
        //         subMenu: [{
        //             title: '供水支线',
        //             icon: 'ion-flame',
        //             disabled: true
        //         }, {
        //             title: '集控室支线',
        //             icon: 'ion-key',
        //             disabled: true
        //         }, {
        //             title: '脱硫支线',
        //             icon: 'ion-lightbulb',
        //             disabled: true
        //         }]
        //     }, {
        //         title: '国4迪威行乙线',
        //         icon: 'ion-record',
        //         subMenu: [{
        //             title: '除灰支线',
        //             icon: 'ion-record',
        //             disabled: true
        //         }]
        //     }, {
        //         title: '万81迪威行丙线',
        //         icon: 'ion-record',
        //         subMenu: [{
        //             title: '测试支线',
        //             icon: 'ion-record',
        //             disabled: true
        //         }]
        //     }]
        // });

    }

})();
