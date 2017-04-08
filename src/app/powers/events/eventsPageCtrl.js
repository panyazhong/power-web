/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.events')
        .controller('eventsPageCtrl', eventsPageCtrl);

    /** @ngInject */
    function eventsPageCtrl($scope, $state, $location, PageTopCache, ToastUtils, Log, Overview, Clientimg, Branch) {

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

            Overview.queryDetail({
                    cid: 1
                },
                function (data) {

                }, function (err) {

                });
            Clientimg.query({
                    cid: 1
                },
                function (data) {

                }, function (err) {

                });
            Branch.query({
                    bid: 1
                },
                function (data) {

                }, function (err) {

                });

        };
        $scope.init();

    }

})();
