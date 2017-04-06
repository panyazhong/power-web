/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.branch')
        .controller('branchPageCtrl', branchPageCtrl);

    /** @ngInject */
    function branchPageCtrl($scope) {

        $scope.show = {
            branchData: {
                id: 'deviceid001',
                deviceName: '3：10千伏一段压变',
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
            branchEqp: [  // 当前支线下所有设备
                {
                    did: 'd2001',
                    name: '1#分站1#10KV变压器',
                    type: '变压器',
                    model: 'SCB10-1600/10',
                    manufacturer: '许继变压器有限公司',
                    client: '奕欧来1#分站',
                    branch: '1',
                    date: '2016/4/20',
                    operationstatus: '运行'
                },
                {
                    did: 'd2002',
                    name: '1#分站1#10KV变压器',
                    type: '开关',
                    model: 'SCB10-1600/10',
                    manufacturer: '许继变压器有限公司',
                    client: '奕欧来1#分站',
                    branch: '2',
                    date: '2016/4/20',
                    operationstatus: '运行'
                },
                {
                    did: 'd2003',
                    name: '1#分站1#10KV变压器',
                    type: '电容器',
                    model: 'SCB10-1600/10',
                    manufacturer: '许继变压器有限公司',
                    client: '奕欧来1#分站',
                    branch: '3',
                    date: '2016/4/20',
                    operationstatus: '运行'
                },
                {
                    did: 'd2004',
                    name: '1#分站1#10KV变压器',
                    type: '开关',
                    model: 'SCB10-1600/10',
                    manufacturer: '许继变压器有限公司',
                    client: '奕欧来1#分站',
                    branch: '1',
                    date: '2016/4/20',
                    operationstatus: '运行'
                },
                {
                    did: 'd2005',
                    name: '1#分站1#10KV变压器',
                    type: '电容器',
                    model: 'SCB10-1600/10',
                    manufacturer: '许继变压器有限公司',
                    client: '奕欧来1#分站',
                    branch: '3',
                    date: '2016/4/20',
                    operationstatus: '运行'
                },
                {
                    did: 'd2006',
                    name: '1#分站1#10KV变压器',
                    type: '变压器',
                    model: 'SCB10-1600/10',
                    manufacturer: '许继变压器有限公司',
                    client: '奕欧来1#分站',
                    branch: '1',
                    date: '2016/4/20',
                    operationstatus: '运行'
                },
                {
                    did: 'd2007',
                    name: '1#分站1#10KV变压器',
                    type: '开关',
                    model: 'SCB10-1600/10',
                    manufacturer: '许继变压器有限公司',
                    client: '奕欧来1#分站',
                    branch: '2',
                    date: '2016/4/20',
                    operationstatus: '运行'
                }
            ]
        };

        $scope.rowCollection = [];

        $scope.initData = function () {
            $scope.rowCollection = $scope.show.branchEqp;
        };
        $scope.initData();

        $scope.setItem = function (did) {

            alert("设置：" + did);

        };

        $scope.delItem = function (did) {

            alert("删除：" + did);

        };

    }

})();
