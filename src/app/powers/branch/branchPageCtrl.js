/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.branch')
        .controller('branchPageCtrl', branchPageCtrl);

    /** @ngInject */
    function branchPageCtrl($scope, $stateParams, Log, Branch) {

        $scope.show = {
            bid: $stateParams.bid,
            branchData: {
                id: 'id3001',
                branchName: '3：10千伏一段压变',
                aL: '100A',
                bL: '105A',
                cL: '103A',
                p: '0.00KW',
                pElement: '1.00',
                aU: '10.01KV',
                bU: '10.03KV',
                cU: '10.09KV',
                q: '0.01KVar',
                wp: '0.05kwh',
                temp: '8℃'
            },
            branchState: 'assets/img/app/power/test_branch_state.png',
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
            branchEqp: []
        };
        $scope.rowCollection = [];

        /**
         * ----------------------------------  delete
         */
        $scope.dd = function () {
            $scope.show.branchEqp = [
                {
                    "id": "1",
                    "name": "变压器1",
                    "type": "变压器",
                    "model": "test",
                    "manufacturer": "test",
                    "banch_name": "支线1",
                    "client_name": "时代金融",
                    "lastet_date": "2017-04-07 17:17:46",
                    "operationstatus": "1"
                },
                {
                    "id": "5",
                    "name": "变压器3",
                    "type": "变压器",
                    "model": "test",
                    "manufacturer": "test",
                    "banch_name": "支线5",
                    "client_name": "时代金融",
                    "lastet_date": "2017-03-03 17:17:46",
                    "operationstatus": "0"
                }
            ];
            $scope.rowCollection = $scope.show.branchEqp;
        };

        $scope.init = function () {

            Branch.query({
                bid: $scope.show.bid,
                device: 'device'
            }, function (data) {
                if (data.data) {
                    $scope.show.branchEqp = data.data;
                    $scope.rowCollection = data.data;
                }
            }, function (err) {

            });

            $scope.dd();
        };
        $scope.init();

        $scope.formatDate = function (date) {
            if (date) {
                return moment(date).format('YYYY-MM-DD');
            }
        };

        $scope.setItem = function (did) {

            alert("设置：" + did);

        };

        $scope.delItem = function (did) {

            alert("删除：" + did);

        };

    }

})();
