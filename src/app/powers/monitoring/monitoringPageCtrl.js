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
                                Branch, HttpToast, SidebarCache, Sidebar, Log, locals) {

        PageTopCache.cache.state = $state.$current; // active
        $location.search().id ? locals.put('cid', $location.search().id) : '';

        $scope.show = {};
        $scope.branchData = {};

        $scope.queryClientImg = function (cid) {

            var id = locals.get('cid', '') ? locals.get('cid', '') : cid;   //cookie不会空取put的，否则默认取第一个

            Clientimg.query({
                    cid: id
                },
                function (data) {
                    $scope.show = ClientimgHelper.query(data);
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

            $state.go('branch', {bid: id}, {reload: true});

            locals.put('bid', id);
        }

    }

})();
