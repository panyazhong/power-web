/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.demo')
        .controller('demoPageCtrl', demoPageCtrl);

    /** @ngInject */
    function demoPageCtrl($scope, $state, baSidebarService, $window) {

        $scope.menuItems = baSidebarService.getMenuItems();
        console.log("menuItems：\n" + JSON.stringify($scope.menuItems));

        $scope.test  = function () {

        };
        $scope.test();

    }

})();
