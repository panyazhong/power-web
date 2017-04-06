(function() {
    'use strict';

    angular.module('Lodash', [])
    .factory('_', function($window) {
        return $window._;
    })
    .run(function($rootScope, _) {
        $rootScope._ = _;
    });

})();
