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
                           HttpToast, EventsCache, $rootScope, _) {

        // $scope.menuItems = baSidebarService.getMenuItems();
        // $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
        // $scope.menuItems = $scope.setLeftMenu($scope.info);    // 设置侧边栏数据

        $scope.show = {
            menuItems: []
        };

        $scope.setLeftMenu = function (obj) {
            var data = obj;
            var menuData = [];
            data.map(function (item) {
                // 一级菜单
                var i = {};
                i.clientId = item.clientId;
                i.title = item.clientName;
                i.icon = 'ion-record';
                if (item.incominglineData.length > 0) {
                    i.subMenu = [];
                    item.incominglineData.map(function (subItem) {
                        // 二级菜单
                        var j = {};
                        j.incominglingId = subItem.incominglingId;
                        j.title = subItem.incominglineName;
                        j.icon = 'ion-record';
                        if (subItem.branchData.length > 0) {
                            j.subMenu = [];
                            subItem.branchData.map(function (subSubItem) {
                                // 三级菜单
                                var k = {};
                                k.branchId = subSubItem.branchId;
                                k.title = subSubItem.branchName;
                                k.icon = 'ion-record';
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

        $scope.setMenu = function () {
            if (SidebarCache.isEmpty()) {
                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        locals.putObject('sidebar', data.sidebar);
                        $scope.show.menuItems = $scope.setLeftMenu(data.sidebar);
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.show.menuItems = $scope.setLeftMenu(locals.getObject('sidebar'));
            }
        };

        $scope.init = function () {
            $scope.statusCache = EventsCache.subscribeStatus(); // subscribe

            $scope.setMenu();
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

            $scope.show.menuItems.map(function (item) {
                // 一级菜单
                if (data[item.clientId]) {
                    item.icon = 'ion-star';
                }
                else {
                    item.icon = 'ion-record';
                }

                if (item.subMenu.length > 0) {
                    item.subMenu.map(function (subItem) {
                        // 二级菜单
                        if (data[item.clientId] && data[item.clientId][subItem.incominglingId]) {
                            subItem.icon = 'ion-star';
                        }
                        else {
                            subItem.icon = 'ion-record';
                        }

                        if (subItem.subMenu.length > 0) {
                            subItem.subMenu.map(function (subSubItem) {
                                // 三级菜单
                                if (data[item.clientId] && data[item.clientId][subItem.incominglingId] &&
                                    data[item.clientId][subItem.incominglingId][subSubItem.branchId]
                                ) {
                                    subSubItem.icon = 'ion-star';
                                }
                                else {
                                    subSubItem.icon = 'ion-record';
                                }
                            });
                        }
                    });
                }
            });
        });

    }
})();
