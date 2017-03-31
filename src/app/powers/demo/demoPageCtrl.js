/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.demo')
        .controller('demoPageCtrl', demoPageCtrl);

    /** @ngInject */
    function demoPageCtrl($scope, baSidebarService, $window) {

        console.log("demo .........");

        $scope.menuItems = baSidebarService.getMenuItems();
        $scope.menuItemsAccess = [];
        // var jsonMenu = JSON.parse($window.sessionStorage.menus); // JSON from Service


        console.log("menuItems: " + JSON.stringify($scope.menuItems));
        console.log("windowsMenu: " + $window.sessionStorage.menus);
    }

})();
