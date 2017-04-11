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
                          ImgPrefix, HttpToast, $cookies) {

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

                    }
                }, function (err) {
                    HttpToast.toast(err);
                });

            // Sidebar.query({},
            //     function (data) {
            //         UserInfo.info.sidebar = data.data;
            //
            //     }, function (err) {
            //         HttpToast.toast(err);
            //     });
            //
            // Overview.query({},
            //     function (data) {
            //         for (var i = 0; i < data.data.length; i++) {
            //             data.data[i].ico = ImgPrefix.prefix + data.data[i].ico;
            //         }
            //         UserInfo.info.client = data.data;
            //
            //     }, function (err) {
            //         HttpToast.toast(err);
            //     });


            if (KeywordCache.isEmpty()) {
                Keyword.query({},
                    function (data) {
                        if (data.data) {
                            KeywordCache.create(data.data);
                        }
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            }

        };
        $scope.test();

    }

})();
