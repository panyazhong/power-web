/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.demo')
        .controller('demoPageCtrl', demoPageCtrl);

    /** @ngInject */
    function demoPageCtrl($scope, baSidebarService, User, UserCache, Keyword, KeywordCache,
                          ImgPrefix, HttpToast, $cookies, Sidebar, SidebarCache) {

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
                    if (data.data) {
                        UserCache.info = data.data;
                        $cookies.putObject("uScope", data.data, {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});
                    }
                }, function (err) {
                    HttpToast.toast(err);
                });

            if (SidebarCache.isEmpty()) {
                Sidebar.query({},
                    function (data) {
                        if (data.data) {
                            SidebarCache.info = data.data;
                        }
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            }


        };
        $scope.test();

    }

})();
