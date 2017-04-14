/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $location, PageTopCache, Clientimg, ClientimgHelper,
                                Branch, HttpToast, GlobalCache) {

        PageTopCache.cache.state = $state.$current; // active

        $scope.show = {};
        $scope.branchData = {};

        $scope.init = function () {
            GlobalCache.set('cid', $location.search().id);

            console.log('cid: ' + GlobalCache.get('cid'));
            console.log('bid: ' + GlobalCache.get('bid'));

            Clientimg.query({
                    cid: GlobalCache.get('cid')
                },
                function (data) {
                    $scope.show = ClientimgHelper.query(data);
                }, function (err) {
                    HttpToast.toast(err);
                });
        };
        $scope.init();

        /**
         * hover前搜索
         */
        $scope.onBeforeShow = function (id) {
            Branch.query({
                    bid: id
                },
                function (data) {
                    $scope.branchData = data;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        /**
         * 查看分支详情
         */
        $scope.viewBranchDetail = function (id) {
            $state.go('branch', {bid: id});
            GlobalCache.set('bid', id);
        }

    }

})();
