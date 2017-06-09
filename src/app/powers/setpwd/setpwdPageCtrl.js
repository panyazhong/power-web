(function () {
    'use strict';

    angular.module('BlurAdmin.power.setpwd')
        .controller('setpwdPageCtrl', setpwdPageCtrl);

    /** @ngInject */
    function setpwdPageCtrl($scope, PageTopCache, ToastUtils, User, HttpToast, SkipUtils) {
        PageTopCache.cache.state = 'settings';

        $scope.form = {
            pwd: '',
            newpwd: '',
            renewpwd: ''
        };

        $scope.submit = function () {

            for (var Key in $scope.form) {
                if (!$scope.form[Key]) {
                    ToastUtils.openToast('warning', '请完善所有密码信息！');
                    return;
                }
            }

            if ($scope.form.pwd.length < 6 || $scope.form.newpwd.length < 6) {
                ToastUtils.openToast('warning', '新密码至少6位！');
                return;
            }

            if ($scope.form.newpwd != $scope.form.renewpwd) {
                ToastUtils.openToast('warning', '新密码输入不一致！');
                return;
            }

            var params = {
                psw: 'psw',
                oldPsw: $scope.form.pwd,
                newPsw: $scope.form.newpwd
            };

            User.editpwd(params,
                function (data) {
                    SkipUtils.exit(data);
                }, function (err) {
                    HttpToast.toast(err);
                })

        };

    }

})();
