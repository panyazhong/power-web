(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('lineSvg', lineSvg);

    function lineSvg() {
        return {
            restrict: 'E',
            templateUrl: 'app/powers/temp/line.html',
            scope: {
                line: '='
            }
        }
    }

})();