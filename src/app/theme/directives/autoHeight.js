(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('autoHeight', autoHeight);

    function autoHeight($window) {
        return {
            restrict: 'A',
            scope: {},
            link: function ($scope, element) {
                var winowHeight = $window.innerHeight;
                var headerHeight = 66 + 30;
                var footerHeight = 16 + 10;
                element.css('min-height',
                    (winowHeight - headerHeight - footerHeight) + 'px');
            }
        };
    }

})();