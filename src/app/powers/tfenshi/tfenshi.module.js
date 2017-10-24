/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.tfenshi', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('tfenshi', {
                url: '/tfenshi',
                title: '历史数据/分时数据',
                templateUrl: 'app/powers/tfenshi/tfenshi.html',
                controller: 'tfenshiPageCtrl',
            });
    }

})();
