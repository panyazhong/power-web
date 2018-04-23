/**
 * @author dapan
 * created on 04/19/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.accidentExpected', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accidentExpected', {
                url: '/accidentExpected',
                templateUrl: 'app/powers/accidentExpected/accidentExpected.html',
                controller: 'accidentExpectedPageCtrl',
            });
    }

})();