/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.history')
        .controller('historyPageCtrl', historyPageCtrl);

    /** @ngInject */
    function historyPageCtrl($scope,EventsCache) {

        EventsCache.event.totalCount = 88;  // test del

    }

})();
