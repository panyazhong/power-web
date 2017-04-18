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
                                Branch, HttpToast, $cookies, ToastUtils) {

        PageTopCache.cache.state = $state.$current; // active
        $location.search().id ? $cookies.put('cid', $location.search().id) : '';

        $scope.show = {};
        $scope.branchData = {};

        $scope.init = function () {

            if (!$cookies.get('cid')) {
                ToastUtils.openToast('warning', '请先选择一个变电站！');
                return;
            }

            Clientimg.query({
                    cid: $cookies.get('cid')
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
            $cookies.put('bid', id);
        }

    }

})();
