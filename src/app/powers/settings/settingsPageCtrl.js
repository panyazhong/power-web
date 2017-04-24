(function () {
    'use strict';

    angular.module('BlurAdmin.power.settings')
        .controller('settingsPageCtrl', settingsPageCtrl);

    /** @ngInject */
    function settingsPageCtrl($scope, PageTopCache) {
        PageTopCache.cache.state = 'settings';

    }

})();
