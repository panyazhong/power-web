/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    function BaSidebarCtrl($scope, baSidebarService, $state) {

        // $scope.menuItems = baSidebarService.getMenuItems();
        // $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

        var data = {
            "clients": [{
                "cid": "1",
                "name": "\u65f6\u4ee3\u91d1\u878d",
                "ico": "public\/img\/client\/blue.png",
                "longitude": "121.48",
                "latitude": "31.22"
            }, {
                "cid": "2",
                "name": "\u4ea4\u901a\u5927\u5b66",
                "ico": "public\/img\/client\/red.png",
                "longitude": "121.16",
                "latitude": "30.89"
            }],
            "sidebar": [{
                "clientId": "1",
                "clientName": "\u65f6\u4ee3\u91d1\u878d",
                "incominglineData": [{
                    "incominglingId": "1",
                    "incominglineName": "\u65f6\u4ee3\u91d1\u878dA\u7ebf",
                    "branchData": [{
                        "branchId": "1",
                        "branchName": "\u652f\u7ebf1"
                    }, {"branchId": "2", "branchName": "\u652f\u7ebf2"}, {
                        "branchId": "3",
                        "branchName": "\u652f\u7ebf3"
                    }, {"branchId": "4", "branchName": "\u652f\u7ebf4"}, {
                        "branchId": "5",
                        "branchName": "\u652f\u7ebf5"
                    }, {"branchId": "6", "branchName": "\u652f\u7ebf6"}, {
                        "branchId": "7",
                        "branchName": "\u652f\u7ebf7"
                    }, {"branchId": "8", "branchName": "\u652f\u7ebf8"}, {
                        "branchId": "9",
                        "branchName": "\u652f\u7ebf9"
                    }, {"branchId": "10", "branchName": "\u652f\u7ebf10"}, {
                        "branchId": "11",
                        "branchName": "\u652f\u7ebf11"
                    }, {"branchId": "12", "branchName": "\u652f\u7ebf12"}, {
                        "branchId": "13",
                        "branchName": "\u652f\u7ebf13"
                    }, {"branchId": "14", "branchName": "\u652f\u7ebf14"}, {
                        "branchId": "15",
                        "branchName": "\u652f\u7ebf15"
                    }, {"branchId": "16", "branchName": "\u652f\u7ebf16"}, {
                        "branchId": "17",
                        "branchName": "\u652f\u7ebf17"
                    }, {"branchId": "18", "branchName": "\u652f\u7ebf18"}]
                }, {
                    "incominglingId": "2",
                    "incominglineName": "\u65f6\u4ee3\u91d1\u878dB\u7ebf",
                    "branchData": []
                }, {
                    "incominglingId": "3",
                    "incominglineName": "\u65f6\u4ee3\u91d1\u878dC\u7ebf",
                    "branchData": []
                }]
            }, {
                "clientId": "2",
                "clientName": "\u4ea4\u901a\u5927\u5b66",
                "incominglineData": [{
                    "incominglingId": "4",
                    "incominglineName": "\u4ea4\u901a\u5927\u5b66A\u7ebf",
                    "branchData": [{"branchId": "19", "branchName": "\u652f\u7ebf19"}]
                }]
            }]
        };

        $scope.setLeftMenu = function (obj) {
            var data = obj.sidebar;
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

        $scope.menuItems = $scope.setLeftMenu(data);    // 设置侧边栏数据
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
            console.log("nodeName：" + e.target.firstElementChild.lastElementChild.nodeName);

            $('.page-sb-item').removeClass('color-purple');
            $(e.target.firstElementChild.lastElementChild).addClass('color-purple');

            $state.go('branch', {bid: id}, {reload: true});
        };

    }
})();
