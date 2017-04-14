/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.branch')
        .controller('branchPageCtrl', branchPageCtrl);

    /** @ngInject */
    function branchPageCtrl($scope, $stateParams, Branch, HttpToast, Device, ToastUtils, GlobalCache,
                            BranchimgHelper, PageTopCache) {

        PageTopCache.cache.state = 'monitoring';

        $scope.show = {
            bid: $stateParams.bid || GlobalCache.get('bid'),
            branchAlarm: [
                {
                    desc: '过流一段跳闸',
                    state: 'normal',
                    color: '#d43875'
                },
                {
                    desc: '3QF电压正常',
                    state: 'caution',
                    color: '#5f53a0'
                },
                {
                    desc: '过流二段跳闸',
                    state: 'danger',
                    color: '#29945b'
                },
                {
                    desc: '2QF在运行位置分闸',
                    state: 'normal',
                    color: '#d43875'
                },
                {
                    desc: '零流跳闸',
                    state: 'normal',
                    color: '#d43875'
                }, {
                    desc: '1ZK、3ZK小开关故障',
                    state: 'danger',
                    color: '#29945b'
                }, {
                    desc: '零流二段跳闸',
                    state: 'caution',
                    color: '#5f53a0'
                }, {
                    desc: '二段计量柜3ZK故障',
                    state: 'caution',
                    color: '#5f53a0'
                }, {
                    desc: '弹簧未储能',
                    state: 'danger',
                    color: '#29945b'
                }, {
                    desc: '二段压变3ZK故障',
                    state: 'normal',
                    color: '#d43875'
                }, {
                    desc: '自切跳闸',
                    state: 'caution',
                    color: '#5f53a0'
                }
            ],
            branchData: {},      // 支线基本信息
            branchEqp: [],   // 支线设备列表
        };
        $scope.rowCollection = [];

        $scope.queryList = function () {
            Branch.queryList({
                    bid: $scope.show.bid,
                    device: 'device'
                },
                function (data) {
                    $scope.show.branchEqp = data;
                    $scope.rowCollection = data;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.init = function () {
            Branch.query({
                    bid: $scope.show.bid
                },
                function (data) {
                    $scope.branchData = BranchimgHelper.query(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            $scope.queryList();
        };
        $scope.init();

        $scope.formatDate = function (date) {
            if (date) {
                return moment(date).format('YYYY-MM-DD');
            }
        };

        /**
         * 编辑设备
         * @param did
         */
        $scope.setItem = function (did) {

            alert("设置：" + did);
            // $scope.queryList();  //编辑完刷新

        };

        /**
         * 删除设备
         * @param did
         */
        $scope.delItem = function (did) {

            Device.delete({
                    did: did
                },
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.queryList();
                }, function (err) {
                    HttpToast.toast(err);
                });

        };

    }

})();
