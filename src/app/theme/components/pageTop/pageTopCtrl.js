/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components.pageTop')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, $state, PageTopCache, locals) {

        $scope.show = {
            topBarData: [
                {
                    title: '概况总览',
                    state: 'overview'
                },
                {
                    title: '实时监控',
                    state: 'monitoring'
                },
                {
                    title: '设备台账',
                    state: 'device'
                },
                {
                    title: '当前事件',
                    state: 'events'
                },
                {
                    title: '签到查询',
                    state: 'checkin'
                },
                {
                    title: '历史数据',
                    state: 'history'
                },
                {
                    title: '报表查询',
                    state: 'report'
                },
                {
                    title: '平台设置',
                    state: 'settings'
                }],
            cache: PageTopCache.cache,
            userName: locals.getObject('user').name,
            setData: [
                {
                    title: '用户设置',
                    state: 'setuser'
                },
                {
                    title: '报警设置',
                    state: 'setpwd'
                },
                {
                    title: '管理员设置',
                    state: 'setalarm'
                }
            ]
        };

        $scope.changeState = function (item) {
            PageTopCache.cache.state = item.state;

            if (item.state == 'settings') {
                $scope.isSetting = true;
                item.isopen = !item.isopen;
                return;
            }

            $scope.isSetting = false;
            $state.go(item.state);
        };

        $scope.changeSetState = function (obj) {
            $state.go(obj.state);
        };

        $scope.logout = function () {
            alert('退出登陆...');
        };

    }

})();
