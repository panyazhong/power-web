/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    function BaSidebarCtrl($scope, baSidebarService, $state, locals, SidebarCache, Sidebar, Log,
                           HttpToast, EventsCache, $rootScope) {

        // $scope.menuItems = baSidebarService.getMenuItems();
        // $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
        // $scope.menuItems = $scope.setLeftMenu($scope.info);    // 设置侧边栏数据

        $scope.setLeftMenu = function (obj) {
            var data = obj;
            var menuData = [];
            data.map(function (item) {
                // 一级菜单
                var i = {};
                i.clientId = item.clientId;
                i.title = item.clientName;
                // i.icon = 'ion-record';

                if ($scope.statusCache.status && $scope.statusCache.status[i.clientId]) {
                    Log.i("i.icon111");
                    i.icon = 'ion-record';
                }
                else {
                    Log.i("i.icon2222");
                    i.icon = 'ion-star';
                }

                // i.icon = $scope.statusCache.status && $scope.statusCache.status[i.clientId] ? 'ion-record' : 'ion-star';
                if (item.incominglineData.length > 0) {
                    i.subMenu = [];
                    item.incominglineData.map(function (subItem) {
                        // 二级菜单
                        var j = {};
                        j.incominglingId = subItem.incominglingId;
                        j.title = subItem.incominglineName;
                        // j.icon = 'ion-record';

                        j.icon = $scope.statusCache.status && $scope.statusCache.status[i.clientId] &&
                        $scope.statusCache.status[i.clientId][j.incominglingId] ? 'ion-record' : 'ion-star';

                        if (subItem.branchData.length > 0) {
                            j.subMenu = [];
                            subItem.branchData.map(function (subSubItem) {
                                // 三级菜单
                                var k = {};
                                k.branchId = subSubItem.branchId;
                                k.title = subSubItem.branchName;

                                // k.icon = 'ion-record';
                                k.icon = $scope.statusCache.status && $scope.statusCache.status[i.clientId] &&
                                $scope.statusCache.status[i.clientId][j.incominglingId] &&
                                $scope.statusCache.status[i.clientId][j.incominglingId][k.branchId] ? 'ion-record' : 'ion-star';

                                k.stateRef = 'branch';

                                j.subMenu.push(k);
                            });

                            i.subMenu.push(j);
                        }
                    });

                    menuData.push(i);
                }
            });
            return menuData;
        };

        $scope.statusCache = {
            status: {}  // socket imgsInfo
        };

        $scope.init = function () {
            $scope.statusCache = EventsCache.subscribeStatus(); // subscribe

            if (SidebarCache.isEmpty()) {
                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        locals.putObject('sidebar', data.sidebar);
                        $scope.menuItems = $scope.setLeftMenu(data.sidebar);
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.menuItems = $scope.setLeftMenu(locals.getObject('sidebar'));
            }
        };
        $scope.init();

        $scope.defaultSidebarState = 'test';    // 默认选中的state

        $scope.$on('$stateChangeSuccess', function () {
            if (baSidebarService.canSidebarBeHidden()) {
                baSidebarService.setMenuCollapsed(true);
            }
        });

        $scope.hoverItem = function ($event) {
            $scope.showHoverElem = true;
            $scope.hoverElemHeight = $event.currentTarget.clientHeight;
            var menuTopValue = 66;
            $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        };

        $scope.goState = function (e, id) {
            $('.page-sb-item').removeClass('color-purple');
            $(e.target.firstElementChild.lastElementChild).addClass('color-purple');

            $state.go('branch', {bid: id}, {reload: true});
        };

        $rootScope.$on('refresh', function (event, data) {
            console.log("refresh...\n" + JSON.stringify(data));

            // $scope.statusCache.status = data;
            //
            // if (SidebarCache.isEmpty()) {
            //     Sidebar.query({},
            //         function (data) {
            //             SidebarCache.create(data);
            //             locals.putObject('sidebar', data.sidebar);
            //             $scope.menuItems = $scope.setLeftMenu(data.sidebar);
            //         }, function (err) {
            //             HttpToast.toast(err);
            //         });
            // } else {
            //     $scope.menuItems = $scope.setLeftMenu(locals.getObject('sidebar'));
            // }
        });

    }
})();
