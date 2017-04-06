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
                    color: '#f0444e'
                },
                {
                    desc: '3QF电压正常',
                    state: 'caution',
                    color: '#48aded'
                },
                {
                    desc: '过流二段跳闸',
                    state: 'danger',
                    color: '#2bc267'
                },
                {
                    desc: '2QF在运行位置分闸',
                    state: 'normal',
                    color: '#f0444e'
                },
                {
                    desc: '零流跳闸',
                    state: 'normal',
                    color: '#f0444e'
                }, {
                    desc: '1ZK、3ZK小开关故障',
                    state: 'danger',
                    color: '#2bc267'
                }, {
                    desc: '零流二段跳闸',
                    state: 'caution',
                    color: '#48aded'
                }, {
                    desc: '二段计量柜3ZK故障',
                    state: 'caution',
                    color: '#48aded'
                }, {
                    desc: '弹簧未储能',
                    state: 'danger',
                    color: '#2bc267'
                }, {
                    desc: '二段压变3ZK故障',
                    state: 'normal',
                    color: '#f0444e'
                }, {
                    desc: '自切跳闸',
                    state: 'caution',
                    color: '#48aded'
                }
            ],
            branchDevice: [  // 当前支线下所有设备
                {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "3号变压器",
                    deviceType: "变压器",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }, {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "3号进线开关",
                    deviceType: "开关",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }, {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "4号电容电容器",
                    deviceType: "电容器",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }, {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "4号电容电容器",
                    deviceType: "电容器",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }, {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "3号进线开关",
                    deviceType: "开关",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }, {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "3号变压器",
                    deviceType: "变压器",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }, {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "3号进线开关",
                    deviceType: "开关",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }, {
                    did: 'id800891',
                    customerName: "世博轴",
                    branchName: '3:10千伏一段压变',
                    deviceName: "4号电容电容器",
                    deviceType: "电容器",
                    deviceModel: 'S7-315/10',
                    supplier: '江苏华鹏',
                    lastTestDate: '2016.7.8',
                    status: '在岗'
                }
            ]
        };

        $scope.rowCollection = [];

        $scope.demo = function () {
            $scope.rowCollection = $scope.show.branchDevice;
        };
        $scope.demo();

    }

})();
