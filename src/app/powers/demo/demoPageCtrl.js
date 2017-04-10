/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.demo')
        .controller('demoPageCtrl', demoPageCtrl);

    /** @ngInject */
    function demoPageCtrl($scope, $state, baSidebarService, $window, User, Log, UserInfo, Overview, ImgPrefix) {

        $scope.menuItems = baSidebarService.getMenuItems();
        console.log("menuItems：\n" + JSON.stringify($scope.menuItems));

        $scope.prefix = ImgPrefix.prefix;

        $scope.test = function () {

            // 模拟登陆
            User.login({
                    account: 111,
                    psw: 111111
                },
                function (data) {
                    Log.i(JSON.stringify(data.data));
                }, function (err) {

                });

            Overview.query({},
                function (data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].ico = ImgPrefix.prefix + data.data[i].ico;
                    }
                    UserInfo.info = data.data;

                }, function (err) {

                });

        };
        $scope.test();

    }

})();
