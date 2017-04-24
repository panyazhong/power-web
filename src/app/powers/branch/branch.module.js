(function () {
    'use strict';

    angular.module('BlurAdmin.power.branch', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('branch', {
                url: '/branch',
                title: '支线明细',
                params: {'bid': null},
                templateUrl: 'app/powers/branch/branch.html',
                controller: 'branchPageCtrl',
            });
    }

})();
