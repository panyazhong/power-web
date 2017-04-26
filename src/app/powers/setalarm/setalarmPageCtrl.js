(function () {
    'use strict';

    angular.module('BlurAdmin.power.setalarm')
        .controller('setalarmPageCtrl', setalarmPageCtrl)
        .controller('editAlertCtrl', editAlertCtrl);

    /** @ngInject */
    function setalarmPageCtrl($scope, PageTopCache, AlertMsg, HttpToast, ModalUtils, _, Log, ToastUtils) {
        PageTopCache.cache.state = 'settings';

        $scope.show = {
            setList: []
        };
        $scope.rowCollection = [];

        $scope.init = function () {
            AlertMsg.query({},
                function (data) {
                    data.map(function (item) {
                        item.showStatus = item.status == '1';
                    });

                    $scope.show.setList = data;
                    $scope.rowCollection = data;
                },
                function (err) {
                    HttpToast.toast(err);
                })
        };
        $scope.init();

        $scope.edit = function (item) {
            var data = _.cloneDeep(item);

            ModalUtils.openMsg('app/powers/setalarm/widgets/editAlertModal.html', '',
                editAlertCtrl, {obj: data},
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.init();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });

        };

        $scope.submit = function (item) {

            var params = {
                early_warning: item.early_warning,
                warning: item.warning,
                status: item.showStatus ? '0' : '1',
                mtid: item.mtid
            };

            AlertMsg.edit(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.init();  // 成功
                },
                function (err) {
                    HttpToast.toast(err);
                    $scope.init();  // 失败也刷新列表
                })
        };

    }

    function editAlertCtrl($scope, params, AlertMsg, ToastUtils, HttpToast) {
        $scope.show = params.obj;

        $scope.init = function () {
            // formart
            $scope.show.early_warning = parseInt($scope.show.early_warning);
            $scope.show.warning = parseInt($scope.show.warning);
        };
        $scope.init();

        $scope.form = {
            early_warning: '',
            warning: '',
            status: $scope.show.status,
            mtid: $scope.show.mtid
        };

        $scope.submit = function () {

            if (!$scope.show.early_warning || !$scope.show.warning) {
                ToastUtils.openToast('warning', ' 请完善所有信息！');
                return;
            }

            if ($scope.show.early_warning) {
                $scope.form.early_warning = $scope.show.early_warning;
            }
            if ($scope.show.warning) {
                $scope.form.warning = $scope.show.warning;
            }

            AlertMsg.edit($scope.form,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.$close(data);
                },
                function (err) {
                    HttpToast.toast(err);
                })

        };

    }

})();
