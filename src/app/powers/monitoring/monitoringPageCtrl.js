/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $location, PageTopCache, Log, Clientimg,
                                ClientimgHelper, Branch, HttpToast, $cookies) {

        $scope.show = {};
        $scope.branchData = {};

        $scope.init = function () {
            PageTopCache.cache.state = $state.$current; // active

            Clientimg.query({
                    cid: $location.search().id
                },
                function (data) {
                    $scope.show = ClientimgHelper.query(data);
                }, function (err) {
                    HttpToast.toast(err);
                });
        };
        $scope.init();

        $scope.onBeforeShow = function (id) {
            Branch.query({
                    bid: id
                },
                function (data) {
                    $scope.branchData = data;
                    // $cookies.putObject("eCookie",[] );
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.viewBranchDetail = function (id) {
            $state.go('branch', {bid: id});

            // var uid = Config.UserInfo.uid ? Config.UserInfo.uid : Config.Banana('uid');
        }

    }

})();
