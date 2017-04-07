/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.events')
        .controller('eventsPageCtrl', eventsPageCtrl);

    /** @ngInject */
    function eventsPageCtrl($scope, $state, $location, PageTopCache, ToastUtils, Log) {

        $scope.show = {
            clientId: ''
        };

        $scope.init = function () {
            PageTopCache.cache.state = $state.$current;

            Log.i("传过来客户id是：" + $location.search().id);
            Log.i("当前state是：" + $state.$current);


            // ToastUtils.openToast('success', '上传success...');
            // ToastUtils.openToast('error', '上传error.....');
            // ToastUtils.openToast('info', '上传info........');
            // ToastUtils.openToast('warning', '上传warning..........');
        };
        $scope.init();

    }

})();
