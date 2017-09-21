(function () {
    'use strict';

    angular.module('BlurAdmin.power.setpwd')
        .controller('setpwdPageCtrl', setpwdPageCtrl);

    /** @ngInject */
    function setpwdPageCtrl($scope, PageTopCache, ToastUtils, User, HttpToast, SkipUtils, Log) {
        PageTopCache.cache.state = 'settings';

        $scope.show = {
            pageTabData: [
                {
                    title: '修改手机号',
                    state: 'base'
                },
                {
                    title: '修改密码',
                    state: 'detail'
                }
            ],
            pageTabState: 'base'   // 默认state
        };

        $scope.form = {
            pwd: '',
            newpwd: '',
            renewpwd: ''
        };

        $scope.data = {
            pwd: '',
            phone: '',
            code: '',
            validCode: true
        };

        $scope.changeState = function (state) {
            $scope.show.pageTabState = state;
        };

        $scope.initForm = function () {
            $scope.form = {
                pwd: '',
                newpwd: '',
                renewpwd: ''
            };

            $scope.data = {
                pwd: '',
                phone: '',
                code: ''
            };

            var code = $('#code');
            clearInterval($scope.t);
            code.html("重新获取");
            $scope.data.validCode = true;
            code.removeClass("btn_unable");
        };

        // 修改手机号
        // getSmsCode
        $scope.getSms = function (num) {
            var params = {
                verify: 'verify',
                psw: $scope.data.pwd,
                phone1: num
            };

            User.getCode(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                },
                function (err) {
                    HttpToast.toast(err);
                })
        };

        $scope.getCode = function () {
            if (!$scope.data.pwd) {
                ToastUtils.openToast('warning', '密码不能为空！');
                return;
            }

            var regP = /^1[3|4|5|7|8]\d{9}$/;
            if (!regP.test($scope.data.phone)) {
                ToastUtils.openToast('warning', '手机号格式不正确');
                return;
            }

            if (!$scope.data.validCode) {
                return;
            }

            $scope.getSms($scope.data.phone);

            // $scope.data.validCode = true;
            var time = 120;
            var code = $('#code');
            if ($scope.data.validCode) {
                $scope.data.validCode = false;
                code.addClass("btn_unable");
                $scope.t = setInterval(function () {
                    time--;
                    code.html(time + "秒");
                    if (time == 0) {
                        clearInterval($scope.t);
                        code.html("重新获取");
                        $scope.data.validCode = true;
                        code.removeClass("btn_unable");
                    }
                }, 1000)
            }

        };

        $scope.checkForm = function () {
            if (!$scope.data.pwd) {
                ToastUtils.openToast('warning', '密码不能为空！');
                return false;
            }

            if (!$scope.data.phone) {
                ToastUtils.openToast('warning', '新手机号不能为空！');
                return false;
            }

            if (!$scope.data.code) {
                ToastUtils.openToast('warning', '验证码不能为空！');
                return false;
            }

            return true
        };

        $scope.editPhone = function () {

            if (!$scope.checkForm()) {
                return
            }

            var params = {
                modify: 'modify',
                code: $scope.data.code,
                phone1: $scope.data.phone
            };

            User.editPhone(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.initForm();
                },
                function (err) {
                    HttpToast.toast(err);
                })

        };

        // 修改密码
        $scope.checkFormPwd = function () {

            for (var Key in $scope.form) {
                if (!$scope.form[Key]) {
                    ToastUtils.openToast('warning', '请完善所有信息！');
                    return false;
                }
            }

            if ($scope.form.newpwd.length < 6 || $scope.form.renewpwd.length < 6) {
                ToastUtils.openToast('warning', '新密码至少6位！');
                return false;
            }

            if ($scope.form.newpwd != $scope.form.renewpwd) {
                ToastUtils.openToast('warning', '新密码输入不一致！');
                return false;
            }

            return true;
        };

        $scope.editPwd = function () {

            if (!$scope.checkFormPwd()) {
                return
            }

            var params = {
                pwd: 'psw',
                oldPsw: $scope.form.pwd,
                newPsw: $scope.form.newpwd
            };

            User.editpwd(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.initForm();
                },
                function (err) {
                    HttpToast.toast(err);
                })
        };

    }

})();
