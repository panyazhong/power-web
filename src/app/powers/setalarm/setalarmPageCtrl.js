(function () {
    'use strict';

    angular.module('BlurAdmin.power.setalarm')
        .controller('setalarmPageCtrl', setalarmPageCtrl);

    /** @ngInject */
    function setalarmPageCtrl($scope, PageTopCache) {
        PageTopCache.cache.state = 'settings';

    }

})();
