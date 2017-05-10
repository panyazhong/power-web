(function () {
    'use strict';

    angular.module('BlurAdmin.power.events', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('events', {
                url: '/events',
                title: '当前事件',
                params: {'cid': null},
                templateUrl: 'app/powers/events/events.html',
                controller: 'eventsPageCtrl',
            });
    }

})();
