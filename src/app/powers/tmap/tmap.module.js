(function () {
    'use strict';

    angular.module('BlurAdmin.power.tmap', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('tmap', {
                url: '/tmap',
                title: 'GIS',
                templateUrl: 'app/powers/tmap/tmap.html',
                controller: 'tmapPageCtrl',
            });
    }

})();
