/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    function BaSidebarCtrl($scope, baSidebarService,userCache) {

        //$scope.menuItems = baSidebarService.getMenuItems();
        $scope.menuItems = [
            {
            icon: "ion-android-home",
            stateRef: "",
            title: "概况总览",
            },
            {
                icon: "ion-android-home",
                stateRef: "",
                title: "能源管理",
                subMenu: [
                    {
                        icon: 'ion-android-home',
                        level: 1,
                        stateRef: "charts.morris",
                        title: "光伏",

                    },
                    {
                        icon: 'ion-android-home',
                        level: 1,
                        stateRef: "profile",
                        title: "风力发电",
                    }]
            },
            {
                icon: "ion-android-home",
                stateRef: "device",
                title: "设备台账"
            },
            {
                icon: "ion-android-home",
                stateRef: "alarm",
                title: "预警报警"
            },
            {
                icon: "ion-android-home",
                stateRef: "",
                title: "历史查询"
            },
            {
                icon: "ion-android-home",
                stateRef: "report",
                title: "报表中心"
            },
        ]
        $scope.show={
            userType: userCache.getUserType(),
        }
        $scope.init = function () {
            var item = {
                icon: "ion-android-settings",
                stateRef: "",
                title: "设置",
                subMenu: [
                    {
                        icon: 'ion-android-home',
                        level: 1,
                        stateRef: "setuser",
                        title: "人员设置",

                    },
                    {
                        icon: 'ion-android-home',
                        level: 1,
                        stateRef: "setprice",
                        title: "电价设置",
                    }]
            }

            if ($scope.show.userType == 8 || $scope.show.userType == 4) {
                $scope.menuItems.push(item);
            }

        };
        $scope.init();
        $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

        $scope.hoverItem = function ($event) {
            $scope.showHoverElem = true;
            $scope.hoverElemHeight =  $event.currentTarget.clientHeight;
            var menuTopValue = 95;
            $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        };
        $scope.$on('$stateChangeSuccess', function () {
            if (baSidebarService.canSidebarBeHidden()) {
                baSidebarService.setMenuCollapsed(true);
            }
        });
    }
})();