/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.events')
        .controller('eventsPageCtrl', eventsPageCtrl);

    /** @ngInject */
    function eventsPageCtrl($scope, $location) {

        $scope.show = {
            clientId: ''
        };

        $scope.getParams = function () {
            $scope.show.clientId = $location.search().id;
            console.log("传过来客户id是：" + $scope.show.clientId);
        };
        $scope.getParams();

    }

})();
