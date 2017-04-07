/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $location, PageTopCache, ToastUtils, Log) {

        $scope.show = {

        };

        $scope.init = function () {
            PageTopCache.cache.state = $state.$current;

            Log.i("传过来客户id是：" + $location.search().id);
            Log.i("当前state是：" + $state.$current);
        };
        $scope.init();

        /**
         * 显示控件详情
         */
        $scope.showDetail = function (obj) {
            Log.i(obj.id);
        };

        /**
         * 查看设备明细
         */
        $scope.lookDetail = function () {
            /**
             * 需要将设备id传递过去，或全局变量记录当前设备信息
             */
            $state.go('branch');
        }

    }

})();
