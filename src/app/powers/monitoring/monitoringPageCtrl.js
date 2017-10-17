(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $stateParams, PageTopCache, Clientimg, ClientimgHelper,
                                Branch, HttpToast, SidebarCache, Sidebar, Log, locals, EventsCache,
                                $rootScope, ToastUtils, clientCache, previewCache, $timeout, Client, clientSvg) {

        PageTopCache.cache.state = $state.$current; // active
        $stateParams.cid ? locals.put('cid', $stateParams.cid) : '';

        $scope.show = {
            mapData: []
        };

        /**
         *  查看line详情
         */
        $scope.viewBranch = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '支线信息异常。稍后再试.');
                return
            }

            $state.go('branch', {bid: id}, {reload: true});

            locals.put('bid', id);
        };

        $scope.initInfo = function () {
            // svg
            $scope.tree = {};
            // svg监控数据
            $scope.monitorData = [];
        };

        $scope.queryClientSvg = function () {
            var p = {
                id: locals.get('cid', ''),
                svg: 'svg'
            };
            Client.querySvg(p,
                function (data) {
                    $scope.tree = clientSvg.create(data);
                    Log.i('b，svg转换后 :\n ' + JSON.stringify($scope.tree));
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        // b. 根据变电站id获取svg信息
        $scope.initFilterInfo = function () {
            $scope.initInfo();  // clear info

            var cid = locals.get('cid', '');
            if (cid) {
                EventsCache.subscribeClient(cid);   // 订阅变电站信息

                $scope.queryClientSvg();
            }
            else {  // 和其它界面diff，不存在也需选中一个客户
                locals.put('cid', $scope.show.mapData[0].id);
                $timeout(function () {
                    EventsCache.subscribeClient($scope.show.mapData[0].id);   // 订阅变电站信息

                    $scope.queryClientSvg();
                }, 200);
            }

        };

        /**
         * a. 获取变电站信息
         * b. 根据变电站id获取svg信息
         */
        // a. 获取变电站信息
        $scope.init = function () {

            var pm = previewCache.getPreview();
            pm.then(function (data) {
                $scope.show.mapData = data;

                $scope.initFilterInfo();
            });

        };
        $scope.init();

        /**
         * socket
         */
        var monitorListener = $rootScope.$on('monitor', function (event, data) {
            if (!data) return;
            if (!$scope.tree || !$scope.tree.data || !$scope.tree.data.length) return;
            var cid = locals.get('cid', '');
            if (cid != data.id) return;

            Log.i('rec-monitor : \n' + JSON.stringify(data));

            // 系统图监控数据
            $scope.monitorData = data.lines;
        });

        var filterListener = $rootScope.$on('filterInfo', function (event, data) {
            if (!data) return;

            Log.i('filterInfo: ' + JSON.stringify(data));

            if (data.cid) {
                $scope.initFilterInfo();
            }
        });

        $scope.$on('$destroy', function () {
            monitorListener();
            filterListener();
            monitorListener = null;
            filterListener = null;
        });
    }

})();