(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components.pageTop')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, $state, PageTopCache, locals, User, HttpToast, SkipUtils, $rootScope) {

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
                    title: '巡检查询',
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
            eventTotal: 0,// 默认0
            setData: [
                {
                    title: '用户设置',
                    state: 'setuser'
                },
                {
                    title: '报警设置',
                    state: 'setalarm'
                },
                {
                    title: '账号设置',
                    state: 'setpwd'
                }
            ],
            userName: locals.getObject('user').name,
            userType: locals.getObject('user').hasTop
        };

        $scope.init = function () {
            var item = {
                title: '平台设置',
                state: 'settings'
            };

            if (locals.getObject('user').hasTop == 1) {
                $scope.show.topBarData.push(item);
            }

        };
        // $scope.init();

        $scope.checkUserType = function (item) {
            switch (item.state) {
                case "setuser":
                    return $scope.show.userType == 1 ? true : false;
                    break;
                case "setalarm":
                    return true;
                    break;
                case "setpwd":
                    // return $scope.show.userType == 1 ? true : false;
                    return true;
                    break;
            }
        };

        $scope.changeState = function (item) {

            if (item.state == 'settings') {
                $scope.isSetting = true;
                item.isopen = !item.isopen;
                return;
            }

            PageTopCache.cache.state = item.state;
            $scope.isSetting = false;
            $state.go(item.state);
        };

        $scope.changeSetState = function (obj) {
            $state.go(obj.state);
        };

        $scope.logout = function () {
            User.exit({
                logout: 'logout'
            }, function (data) {
                SkipUtils.exit(data);
            }, function (err) {
                HttpToast.toast(err);
            })
        };

        /**
         * 未处理的event数量
         */
        $rootScope.$on('refresh', function (event, item) {
            if (!item.count) {
                return
            }

            if (item.count > 500) {
                $scope.show.eventTotal = '500+';
            } else {
                $scope.show.eventTotal = item.count;
            }
        });

    }

})();
