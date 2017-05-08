/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('monitoring', {
                url: '/monitoring',
                title: '实时监控',
                params: {'cid': null},
                templateUrl: 'app/powers/monitoring/monitoring.html',
                controller: 'monitoringPageCtrl',
            });
    }

})();
