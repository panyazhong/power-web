/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('contentTop', contentTop);

    /** @ngInject */
    function contentTop($location, $state, PageTopCache) {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/contentTop/contentTop.html',
            link: function ($scope) {
                $scope.$watch(function () {
                    $scope.activePageTitle = $state.current.title;
                    if ($state.current.name == 'monitoring' || $state.current.name == 'branch') {
                        $scope.clientTitle = PageTopCache.currentState.state;
                    } else {
                        $scope.clientTitle = '';
                    }
                });
            }
        };
    }

})();