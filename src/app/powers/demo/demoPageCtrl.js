/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.demo')
        .controller('demoPageCtrl', demoPageCtrl);

    /** @ngInject */
    function demoPageCtrl($scope, baSidebarService, User, HttpToast, $cookies, Sidebar, SidebarCache) {

        // 自定义侧边栏
        $scope.menuItems = baSidebarService.getMenuItems();
        console.log("menuItems：\n" + JSON.stringify($scope.menuItems));

        $scope.test = function () {

            // 模拟登陆
            User.login({
                    account: 111,
                    psw: 111111
                },
                function (data) {
                    $cookies.putObject("uScope", data, {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});
                    // init cookie
                    // $cookies.remove('clientScope');
                    $cookies.remove('cid');
                    $cookies.remove('bid');

                    Sidebar.query({},
                        function (data) {
                            // SidebarCache.create(data);
                            $cookies.putObject("clientScope", data.clients, {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});
                        }, function (err) {
                            HttpToast.toast(err);
                        });

                }, function (err) {
                    HttpToast.toast(err);
                });

        };
        $scope.test();

    }

})();
