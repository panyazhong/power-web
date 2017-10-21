(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components.pageTop')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, $state, PageTopCache, User, HttpToast, SkipUtils, $rootScope, userCache) {

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
                },
                ],
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
            setData2: [
                {
                    title: '负荷数据',
                    state: 'tfuhe'
                },
                {
                    title: '需量数据',
                    state: 'txuliang'
                },
                {
                    title: '电量数据',
                    state: 'tdianliang'
                },
                // {
                //     title: '分时数据',
                //     state: 'tfenshi'
                // }
            ],
            userName: userCache.getName(),
            userType: userCache.getUserType()
        };

        $scope.init = function () {
            var item = {
                title: '平台设置',
                state: 'settings'
            };

            if (userCache.getUserType() == 1) {
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
                // case "tfuhe":
                //     // return $scope.show.userType == 1 ? true : false;
                //     return true;
                //     break;
                // case "txuliang":
                //     // return $scope.show.userType == 1 ? true : false;
                //     return true;
                //     break;
                // case "tdianliang":
                //     // return $scope.show.userType == 1 ? true : false;
                //     return true;
                //     break;
            }
        };
        $scope.checkUserTypeH = function (item) {
            switch (item.state) {
                case "tfuhe":
                    return true;
                    break;
                case "txuliang":
                    return true;
                    break;
                case "tdianliang":
                    return true;
                    break;
                // case "tfenshi":
                //     return true;
                //     break;
            }
        };
        $scope.changeState = function (item) {

            if (item.state == 'settings'||item.state == 'history') {
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
        $rootScope.$on('refresh', function (event, statusData) {
            if (!statusData || !statusData.length) return;

            var count = 0;
            for (var i = 0; i < statusData.length; i++) {
                var obj = statusData[i];
                if (obj.data) {
                    count += parseInt(obj.data);
                }
            }

            $scope.show.eventTotal = count > 500 ? '500+' : count;
        });

    }

})();
