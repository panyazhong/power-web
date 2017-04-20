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
            // User.login({
            //         account: 111,
            //         psw: 111111
            //     },
            //     function (data) {
            //         $cookies.putObject("uScope", data, {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});
            //         // init cookie
            //         // $cookies.remove('clientScope');
            //         $cookies.remove('cid');
            //         $cookies.remove('bid');
            //
            //         Sidebar.query({},
            //             function (data) {
            //                 SidebarCache.create(data);
            //                 $cookies.putObject("clientScope", data.clients, {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});
            //             }, function (err) {
            //                 HttpToast.toast(err);
            //             });
            //
            //     }, function (err) {
            //         HttpToast.toast(err);
            //     });

            var info = {"clients":[{"cid":"1","name":"\u65f6\u4ee3\u91d1\u878d","ico":"public\/img\/client\/blue.png","longitude":"121.48","latitude":"31.22"},{"cid":"2","name":"\u4ea4\u901a\u5927\u5b66","ico":"public\/img\/client\/red.png","longitude":"121.16","latitude":"30.89"}],"sidebar":[{"clientId":"1","clientName":"\u65f6\u4ee3\u91d1\u878d","incominglineData":[{"incominglingId":"1","incominglineName":"\u65f6\u4ee3\u91d1\u878dA\u7ebf","branchData":[{"branchId":"1","branchName":"\u652f\u7ebf1"},{"branchId":"2","branchName":"\u652f\u7ebf2"},{"branchId":"3","branchName":"\u652f\u7ebf3"},{"branchId":"4","branchName":"\u652f\u7ebf4"},{"branchId":"5","branchName":"\u652f\u7ebf5"},{"branchId":"6","branchName":"\u652f\u7ebf6"},{"branchId":"7","branchName":"\u652f\u7ebf7"},{"branchId":"8","branchName":"\u652f\u7ebf8"},{"branchId":"9","branchName":"\u652f\u7ebf9"},{"branchId":"10","branchName":"\u652f\u7ebf10"},{"branchId":"11","branchName":"\u652f\u7ebf11"},{"branchId":"12","branchName":"\u652f\u7ebf12"},{"branchId":"13","branchName":"\u652f\u7ebf13"},{"branchId":"14","branchName":"\u652f\u7ebf14"},{"branchId":"15","branchName":"\u652f\u7ebf15"},{"branchId":"16","branchName":"\u652f\u7ebf16"},{"branchId":"17","branchName":"\u652f\u7ebf17"},{"branchId":"18","branchName":"\u652f\u7ebf18"}]},{"incominglingId":"2","incominglineName":"\u65f6\u4ee3\u91d1\u878dB\u7ebf","branchData":[]},{"incominglingId":"3","incominglineName":"\u65f6\u4ee3\u91d1\u878dC\u7ebf","branchData":[]}]},{"clientId":"2","clientName":"\u4ea4\u901a\u5927\u5b66","incominglineData":[{"incominglingId":"4","incominglineName":"\u4ea4\u901a\u5927\u5b66A\u7ebf","branchData":[{"branchId":"19","branchName":"\u652f\u7ebf19"}]}]}]};

            console.log("infoC: "+JSON.stringify(info.clients));


            $cookies.putObject("clientScope", info.clients, {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});


        };
        $scope.test();

    }

})();
