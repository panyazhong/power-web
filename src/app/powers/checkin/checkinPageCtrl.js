(function () {
    'use strict';

    angular.module('BlurAdmin.power.checkin')
        .controller('checkinPageCtrl', checkinPageCtrl);

    /** @ngInject */
    function checkinPageCtrl($scope,EventsCache) {

        EventsCache.event.totalCount = 9;   // test del


    }

})();
