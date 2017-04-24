(function () {
    'use strict';

    angular.module('BlurAdmin.power.setuser')
        .controller('setuserPageCtrl', setuserPageCtrl);

    /** @ngInject */
    function setuserPageCtrl($scope, PageTopCache, Log, User, UserHelper, HttpToast) {
        PageTopCache.cache.state = 'settings';

        $scope.show = {
            userList: []
        };

        $scope.init = function () {
            User.query({},
                function (data) {
                    $scope.show.userList = UserHelper.query(data);
                },
                function (err) {
                    HttpToast.toast(err);
                })
        };
        $scope.init();

        $scope.add = function () {
            Log.i('add');
        };

        $scope.print = function () {
            Log.i('print');
        };

        $scope.export = function () {
            Log.i('export');
        };

    }

})();
