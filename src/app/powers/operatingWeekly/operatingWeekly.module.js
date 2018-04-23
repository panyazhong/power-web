/**
 * @author dapan
 * created on 04/19/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.operatingWeekly', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('operatingWeekly', {
                url: '/operatingWeekly',
                templateUrl: 'app/powers/operatingWeekly/operatingWeekly.html',
                controller: 'operatingWeeklyPageCtrl',
            });
    }

})();