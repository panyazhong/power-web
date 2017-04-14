/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    // function BaSidebarCtrl($scope, baSidebarService) {
    //
    //     $scope.menuItems = baSidebarService.getMenuItems();
    //     $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
    //
    //     $scope.hoverItem = function ($event) {
    //         $scope.showHoverElem = true;
    //         $scope.hoverElemHeight = $event.currentTarget.clientHeight;
    //         var menuTopValue = 66;
    //         $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
    //     };
    //
    //     $scope.$on('$stateChangeSuccess', function () {
    //         if (baSidebarService.canSidebarBeHidden()) {
    //             baSidebarService.setMenuCollapsed(true);
    //         }
    //     });
    // }


    /** @ngInject */
    function BaSidebarCtrl($scope, baSidebarService, $window, baConfig) {

        // $scope.menuItems = baSidebarService.getMenuItems();
        // $scope.menuItemsAccess = [];

        var menus = [{
            "title": "时代金融",
            "icon": "ion-grid",
            "subMenu": [{
                "title": "万6迪威行甲线",
                "icon": "ion-record",
                "subMenu": [{"title": "供水支线", "icon": "ion-record", "stateRef": "device"}]
            }]
        }, {
            "title": "时代金融",
            "icon": "ion-grid",
            "subMenu": [{
                "title": "万6迪威行甲线",
                "icon": "ion-record",
                "subMenu": [{"title": "供水支线", "icon": "ion-record", "stateRef": "demo"},
                    {"title": "暖气支线", "icon": "ion-record", "stateRef": "events"}]
            }]
        }
        ];

        // var jsonMenu = JSON.stringify(menus); // JSON from Service
        //
        // angular.forEach($scope.menuItems, function (baSideBarMenu) {
        //     angular.forEach(jsonMenu, function (accessMenu) {
        //         if (accessMenu.MenuName === baSideBarMenu.name) {
        //             $scope.menuItemsAccess.push(baSideBarMenu);
        //             return;
        //         }
        //     })
        // });

        $scope.menuItems = menus;

        $scope.defaultSidebarState = 'overview';    // def 激活的状态

        $scope.hoverItem = function ($event) {
            $scope.showHoverElem = true;
            $scope.hoverElemHeight = $event.currentTarget.clientHeight;
            var menuTopValue = 60;
            $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        };

        $scope.$on('$stateChangeSuccess', function () {
            if (baSidebarService.canSidebarBeHidden()) {
                baSidebarService.setMenuCollapsed(true);
            }
        });
    }

})();
