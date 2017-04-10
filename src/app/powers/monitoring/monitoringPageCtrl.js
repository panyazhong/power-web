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
                                ClientimgHelper, Branch) {
        $scope.show = {};
        $scope.branchData = {};

        $scope.init = function () {
            PageTopCache.cache.state = $state.$current; // 激活state

            Clientimg.query({
                    cid: $location.search().id
                },
                function (data) {
                    if (data.data) {
                        $scope.show = ClientimgHelper.query(data.data);
                    }
                }, function (err) {

                });
        };
        $scope.init();

        $scope.onBeforeShow = function (id) {

            Branch.query({
                    bid: id
                },
                function (data) {
                    if (data.data) {
                        $scope.branchData = data.data;
                    }
                }, function (err) {

                });
        };

        $scope.viewBranchDetail = function (id) {
            $state.go('branch', {bid: id});
        }

    }

})();
