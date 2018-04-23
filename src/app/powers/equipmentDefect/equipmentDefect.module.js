/**
 * @author dapan
 * created on 04/19/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.equipmentDefect', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('equipmentDefect', {
                url: '/equipmentDefect',
                templateUrl: 'app/powers/equipmentDefect/equipmentDefect.html',
                controller: 'equipmentDefectPageCtrl',
            });
    }

})();