/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $stateParams, PageTopCache, Clientimg, ClientimgHelper,
                                Branch, HttpToast, SidebarCache, Sidebar, Log, locals, EventsCache) {

        PageTopCache.cache.state = $state.$current; // active
        $stateParams.cid ? locals.put('cid', $stateParams.cid) : '';

        $scope.show = {
            imgs: {},   // images info
            branch: {}  // branch info
        };
        $scope.stbranch = {
            branch: {}  // socket branchInfo
        };
        $scope.stimgs = {
            imgs: {}  // socket imgsInfo
        };
        $scope.cName = '';

        $scope.queryClientImg = function (cid) {

            var id = locals.get('cid', '') ? locals.get('cid', '') : cid;   //cookie不会空取put的，否则默认取第一个

            EventsCache.subscribeMsg(id);                         // 订阅 变电站
            $scope.stimgs = EventsCache.subscribeClientImgs(id);  // 订阅 一次系统图图片

            Clientimg.query({
                    cid: id
                },
                function (data) {
                    $scope.show.imgs = ClientimgHelper.query(data);
                    $scope.cName = data.client.name;
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

        /**
         * 显示前搜索
         */
        $scope.onBeforeShow = function (id) {
            $scope.subscribeBranch(id);    // sub

            Branch.query({
                    bid: id
                },
                function (data) {
                    $scope.show.branch = data;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        /**
         * 查看分支详情
         */
        $scope.viewBranchDetail = function (id) {

            $state.go('branch', {bid: id}, {reload: true});

            locals.put('bid', id);
            locals.put('cName', $scope.cName);
        };

        /**
         *  subscribe
         */
        $scope.subscribeBranch = function (bid) {
            $scope.stbranch = EventsCache.subscribeBranch(bid); // 订阅 支线基本信息
        };
    }

})();
