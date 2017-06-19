(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $stateParams, PageTopCache, Clientimg, ClientimgHelper,
                                Branch, HttpToast, SidebarCache, Sidebar, Log, locals, EventsCache, $rootScope, ToastUtils) {

        PageTopCache.cache.state = $state.$current; // active
        $stateParams.cid ? locals.put('cid', $stateParams.cid) : '';

        $scope.show = {
            imgs: {},   // images info
            branch: {}  // branch info
        };

        $scope.queryClientImg = function (cid) {

            var id = locals.get('cid', '') ? locals.get('cid', '') : cid;   //缓存不为空取缓存，否则默认取第一个
            EventsCache.subscribeClient(id);   // 订阅变电站信息

            Clientimg.query({
                    cid: id
                },
                function (data) {
                    $scope.show.imgs = ClientimgHelper.query(data, {});
                    // Log.i("Clientimg处理后:\n " + JSON.stringify($scope.show.imgs));
                    // data.client.name; 变电站名称，若需要可用
                    PageTopCache.currentState.state = data.client.name + " / 一次系统图";
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.init = function () {
            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.queryClientImg(data.sidebar[0].clientId);
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.queryClientImg(SidebarCache.getData().sidebar[0].clientId);
            }
        };
        $scope.init();

        $scope.setBranchInfo = function (data) {
            $scope.show.branch.currentA = data.currentA;
            $scope.show.branch.currentB = data.currentB;
            $scope.show.branch.currentC = data.currentC;
            $scope.show.branch.p = data.p;
            $scope.show.branch.powerFactor = data.powerFactor;

            $scope.show.branch.voltageA = data.voltageA;
            $scope.show.branch.voltageB = data.voltageB;
            $scope.show.branch.voltageC = data.voltageC;
            $scope.show.branch.q = data.q;
            $scope.show.branch.wp = data.wp;
            $scope.show.branch.temperature = data.temperature;
        };

        /**
         * 显示前搜索
         */
        $scope.onBeforeShow = function (id) {

            $scope.show.branch = {};    // init
            EventsCache.subscribeBranch(id);    // 订阅支线信息

            // 1.缓存取变量信息
            var obj = locals.getObject('clientInfo');
            var branchInfo = JSON.parse(obj.content)[id];
            $scope.setBranchInfo(branchInfo);

            // 2.取支线名称、id
            Branch.query({
                    bid: id
                },
                function (data) {
                    $scope.show.branch.name = data.name;
                    $scope.show.branch.bid = data.bid;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        /**
         * 查看分支详情
         */
        $scope.viewBranchDetail = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '支线信息异常。稍后再试.');
                return
            }

            $state.go('branch', {bid: id}, {reload: true});

            locals.put('bid', id);
        };

        /* socket refresh*/
        /**
         * 支线基本信息
         */
        $rootScope.$on('branchRefresh', function (event, data) {
            if (!data) {
                return
            }

            $scope.setBranchInfo(data);
        });

        /**
         * 一次系统图
         */
        $rootScope.$on('refresh', function (event, item) {
            if (!item.states) {
                return
            }

            var data = item.states;

            $scope.show.imgs = ClientimgHelper.query($scope.show.imgs, data);
        });
    }

})();
