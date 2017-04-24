(function () {
    'use strict';

    angular.module('BlurAdmin.power.setpwd')
        .controller('setpwdPageCtrl', setpwdPageCtrl);

    /** @ngInject */
    function setpwdPageCtrl($scope,PageTopCache) {
        PageTopCache.cache.state = 'settings';

    }

})();
