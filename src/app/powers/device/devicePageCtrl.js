/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.device')
        .controller('devicePageCtrl', devicePageCtrl)
        .controller('addDeviceCtrl', addDeviceCtrl);

    /** @ngInject */
    function devicePageCtrl($scope, Log, $timeout, ModalUtils, HttpToast, Device) {

        $scope.show = {
            isLoading: true,
            maxSize: 10,    // 每页显示的数量
            branchEqp: []
        };

        $scope.form = {
            name: '',
            type: '',
            model: '',
            manufacturer: '',
            client_name: '',
            incomingline: '',
            banch_name: '',
            operationstatus: ''
        };

        $scope.clearForm = function () {
            $scope.form = {
                name: '',
                type: '',
                model: '',
                manufacturer: '',
                incomingline: '',
                client_name: '',
                banch_name: '',
                operationstatus: ''
            };
        };

        $scope.formatDate = function (date) {
            if (date) {
                return moment(date).format('YYYY-MM-DD');
            }
        };

        $scope.getData = function (tableState) {

            $scope.show.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || $scope.show.maxSize;  // Number of entries showed per page.

            // 测试用
            $timeout(function () {

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
                        "id": "523",
                        "name": "变压器3",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线5",
                        "client_name": "时代金融",
                        "lastet_date": "2017-04-07 17:17:46",
                        "operationstatus": "1"
                    },
                    {
                        "id": "113",
                        "name": "变压器1",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线1",
                        "client_name": "时代金融",
                        "lastet_date": "2017-04-09 17:17:46",
                        "operationstatus": "1"
                    },
                    {
                        "id": "12",
                        "name": "变压器3",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线5",
                        "client_name": "时代金融",
                        "lastet_date": "2017-01-07 17:17:46",
                        "operationstatus": "1"
                    },
                    {
                        "id": "209",
                        "name": "变压器3",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线5",
                        "client_name": "时代金融",
                        "lastet_date": "2017-01-01 17:17:46",
                        "operationstatus": "1"
                    },
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
                        "id": "523",
                        "name": "变压器3",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线5",
                        "client_name": "时代金融",
                        "lastet_date": "2017-04-07 17:17:46",
                        "operationstatus": "1"
                    },
                    {
                        "id": "113",
                        "name": "变压器1",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线1",
                        "client_name": "时代金融",
                        "lastet_date": "2017-04-09 17:17:46",
                        "operationstatus": "1"
                    },
                    {
                        "id": "12",
                        "name": "变压器3",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线5",
                        "client_name": "时代金融",
                        "lastet_date": "2017-01-07 17:17:46",
                        "operationstatus": "1"
                    },
                    {
                        "id": "209",
                        "name": "变压器3",
                        "type": "变压器",
                        "model": "test",
                        "manufacturer": "test",
                        "banch_name": "支线5",
                        "client_name": "时代金融",
                        "lastet_date": "2017-01-01 17:17:46",
                        "operationstatus": "1"
                    },
                ];

                // tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                tableState.pagination.numberOfPages = 10;//set the number of pages so the pagination can update
                $scope.show.isLoading = false;

            }, 2000);
        };


        $scope.addDevice = function () {
            ModalUtils.open('app/powers/device/widgets/createDeviceModal.html', 'lg',
                addDeviceCtrl, 'deviceDiv', {},
                function (info) {
                    // 传值走这里
                    Log.i('接收到传递的值：' + info);
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        $scope.exportExcel = function () {
            alert('exportExcel...');
        };

        $scope.setItem = function (did) {

            alert("设置：" + did);

        };

        $scope.delItem = function (did) {

            // Device.delete({
            //     did: did
            // }, function (data) {
            //     HttpToast.toastSucMsg(data, getData);
            // }, function (err) {
            //     HttpToast.toast(err);
            // });

        };

    }

    function addDeviceCtrl($scope) {

        $scope.testValue = function () {
            $scope.$close("123");   //关闭时传值
        };

    }

})();
