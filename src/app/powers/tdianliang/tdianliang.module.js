/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.tdianliang', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('tdianliang', {
                url: '/tdianliang',
                title: '电量数据',
                templateUrl: 'app/powers/tdianliang/tdianliang.html',
                controller: 'tdianliangPageCtrl',
            });
    }

})();
