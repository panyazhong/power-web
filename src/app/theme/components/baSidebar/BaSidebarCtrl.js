(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    function BaSidebarCtrl($scope, baSidebarService, $state, locals, SidebarCache, Sidebar, Log,
                           HttpToast, $rootScope, _, clientCache, $timeout) {

        $scope.show = {
            menuItems: []
        };

        /*
        $scope.setLeftMenu = function (obj) {
            var data = obj;
            var menuData = [];
            data.map(function (item) {
                // 一级菜单
                var i = {};
                i.clientId = item.clientId;
                i.title = item.clientName;
                i.icon = 'indicator-normal indicator-one';
                if (item.incominglineData.length > 0) {
                    i.subMenu = [];
                    item.incominglineData.map(function (subItem) {
                        // 二级菜单
                        var j = {};
                        j.incominglingId = subItem.incominglingId;
                        j.title = subItem.incominglineName;
                        j.icon = 'indicator-normal';
                        if (subItem.branchData.length > 0) {
                            j.subMenu = [];
                            subItem.branchData.map(function (subSubItem) {
                                // 三级菜单
                                var k = {};
                                k.branchId = subSubItem.branchId;
                                k.title = subSubItem.branchName;
                                k.icon = 'indicator-normal';
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
        */

        $scope.setLineData = function (i, t) {
            i["id"] = t.id;
            i["title"] = t.name;
            i["category"] = t.category;
            i["icon"] = t.category == '-1' ? 'indicator-normal indicator-one' : 'indicator-normal'; //是否是变电站
            i["stateRef"] = t.category == '-1' ? '' : 'branch';
            // i["subMenu"] = [];

            return i;
        };

        $scope.setLeftMenu = function (treeNodes) {
            if (!treeNodes || !treeNodes.length) return;

            var menuData = [];
            treeNodes.map(function (t) {
                // 一级菜单
                var i = $scope.setLineData({}, t);
                if (t.lines.length) {
                    i["subMenu"] = [];
                    t.lines.map(function (subT) {
                        // 二级菜单
                        var j = $scope.setLineData({}, subT);
                        if (subT.lines.length) {
                            j["subMenu"] = [];
                            subT.lines.map(function (subSubT) {
                                // 三级菜单
                                var k = $scope.setLineData({}, subSubT);
                                /** 差异需要判断是否有子树 **/
                                if (subSubT.lines.length) {
                                    k["subMenu"] = [];  // 无需添加树结构，[]即可
                                    j.subMenu.push(k);
                                } else {
                                    j.subMenu.push(k);
                                }
                            });
                            i.subMenu.push(j);
                        } else {
                            i.subMenu.push(j);
                        }
                    });
                    menuData.push(i);
                } else {
                    menuData.push(i);
                }
            });

            return menuData;
        };

        $scope.setMenu = function () {
            // if (SidebarCache.isEmpty()) {
            //     Sidebar.query({},
            //         function (data) {
            //             SidebarCache.create(data);
            //             locals.putObject('sidebar', data.sidebar);
            //             $scope.show.menuItems = $scope.setLeftMenu(data.sidebar);
            //         }, function (err) {
            //             HttpToast.toast(err);
            //         });
            // } else {
            //     $scope.show.menuItems = $scope.setLeftMenu(locals.getObject('sidebar'));
            // }

            var pm = clientCache.getTree();
            pm.then(function (data) {

                $scope.show.menuItems = $scope.setLeftMenu(data);
            });
        };

        $scope.init = function () {
            // $scope.setMenu();

            // 测试数据
            var data = [
                {
                    "id": "1",
                    "name": "南京军区",
                    "category": "-1",
                    "lines": [
                        {
                            "id": "1",
                            "name": "第1师",
                            "category": "0",
                            "lines": [
                                {
                                    "id": "2",
                                    "name": "第1-1旅",
                                    "category": "1",
                                    "lines": []
                                },
                                {
                                    "id": "3",
                                    "name": "第1-2旅",
                                    "category": "1",
                                    "lines": []
                                }
                            ]
                        },
                        {
                            "id": "8",
                            "name": "第2师",
                            "category": "0",
                            "lines": []
                        }
                    ]
                },
                {
                    "id": "2",
                    "name": "成都军区",
                    "category": "-1",
                    "lines": []
                }
            ];

            $timeout(function () {
                $scope.show.menuItems = $scope.setLeftMenu(data);
                Log.i('menuItems : \n' + JSON.stringify($scope.show.menuItems));
            });

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

        /**
         * 侧边栏states
         */
        $rootScope.$on('refresh', function (event, item) {
            if (!item.states) {
                return
            }

            var data = item.states;

            if ($scope.show.menuItems && Array.isArray($scope.show.menuItems)) {
                $scope.show.menuItems.map(function (item) {
                    // 一级菜单
                    if (data[item.clientId]) {
                        item.icon = 'indicator-error indicator-one';
                    }
                    else {
                        item.icon = 'indicator-normal indicator-one';
                    }

                    if (item.subMenu.length > 0) {
                        item.subMenu.map(function (subItem) {
                            // 二级菜单
                            if (data[item.clientId] && data[item.clientId][subItem.incominglingId]) {
                                subItem.icon = 'indicator-error';
                            }
                            else {
                                subItem.icon = 'indicator-normal';
                            }

                            if (subItem.subMenu.length > 0) {
                                subItem.subMenu.map(function (subSubItem) {
                                    // 三级菜单
                                    if (data[item.clientId] && data[item.clientId][subItem.incominglingId] &&
                                        data[item.clientId][subItem.incominglingId][subSubItem.branchId]
                                    ) {
                                        subSubItem.icon = 'indicator-error';
                                    }
                                    else {
                                        subSubItem.icon = 'indicator-normal';
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        $scope.saveCid = function (item) {
            locals.put('cid', item.clientId);
            var data = {
                type: 'cid',
                cid: item.clientId
            };
            $rootScope.$emit('filterInfo', data);

            Log.i('emit cid: ' + JSON.stringify(data));
        };

        $scope.saveInid = function (cObj, item) {
            locals.put('cid', cObj.clientId);
            locals.put('inid', item.incominglingId);
            var data = {
                type: 'inid',
                cid: cObj.clientId,
                inid: item.incominglingId
            };
            $rootScope.$emit('filterInfo', data);

            Log.i('emit Inid: ' + JSON.stringify(data));
        }

    }
})();
