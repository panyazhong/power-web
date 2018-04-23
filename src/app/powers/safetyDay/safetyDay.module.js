/**
 * @author dapan
 * created on 04/19/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.safetyDay', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('safetyDay', {
                url: '/safetyDay',
                templateUrl: 'app/powers/safetyDay/safetyDay.html',
                controller: 'safetyDayPageCtrl',
            });
    }

})();