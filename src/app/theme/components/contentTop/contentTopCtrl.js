/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components.contentTop')
        .controller('contentTopCtrl', contentTopCtrl);

    /** @ngInject */
    function contentTopCtrl($scope, $state, PageTopCache) {

        $scope.init = function () {

            $scope.$watch(function () {
                $scope.activePageTitle = $state.current.title;
                $scope.clientTitle = PageTopCache.currentState.state;
            });
        };
        $scope.init();

        // $scope.show = {
        //     cache: PageTopCache.cache
        // }

    }

})();
