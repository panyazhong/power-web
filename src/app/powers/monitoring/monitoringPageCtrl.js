/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $location) {

        $scope.show = {
            clientId: ''
        };

        $scope.getParams = function () {
            $scope.show.clientId = $location.search().id;
            console.log("传过来客户id是：" + $scope.show.clientId);

            console.log("current：" + $state.$current);
        };
        $scope.getParams();

    }

})();
