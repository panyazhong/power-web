/**
 * @author dapan
 * created on 04/18/2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.meeting', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('meeting', {
                url: '/meeting',
                templateUrl: 'app/powers/meeting/meeting.html',
                controller: 'meetingPageCtrl',
            });
    }

})();