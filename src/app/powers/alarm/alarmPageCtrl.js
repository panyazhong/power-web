/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.alarm')
    .controller('alarmPageCtrl', alarmPageCtrl);

  /** @ngInject */
    function alarmPageCtrl($scope, $timeout, baConfig,$http,ModalUtils,Device,DeviceDel) {
      $scope.data = {
          beginDate: {
              options: {
                  formatYear: 'yyyy',
                  startingDay: 1,
                  showWeeks: false,
                  language: 'zh-CN',
              },
              isOpen: false,
              altInputFormats: ['yyyy-MM-dd'],
              format: 'yyyy-MM-dd',
              modelOptions: {
                  timezone: 'Asia/beijing'
              }
          },
          endDate: {
              options: {
                  formatYear: 'yyyy',
                  startingDay: 1,
                  showWeeks: false,
                  language: 'zh-CN',
              },
              isOpen: false,
              altInputFormats: ['yyyy-MM-dd'],
              format: 'yyyy-MM-dd',
              modelOptions: {
                  timezone: 'Asia/beijing'
              }
          },
      };
      $scope.show= {
          deviceStatus:'',
          deviceStatusArr:[{status:1,name:'运行'},{status:0,name:'停役'}],
          deviceType:'',
          deviceTypeArr:[{type:37,name:'通讯机'},{type:1,name:'逆变器'}],
      };
      $scope.form = {
          name: '0',   //设备名称
          type: '0',   //设备类型key
          status:-1   //设备状态
      };
      $scope.setStatus = function (obj) {
          $scope.show.deviceStatus = obj.name;
          $scope.form.status = obj.status;
      };
      $scope.setType = function (obj) {
          $scope.show.deviceType = obj.name;
          $scope.form.type = obj.type;
      };

      $scope.formatForm = function () {
          var params = {};
          for (var Key in $scope.form) {
              if ($scope.form[Key]) {
                  params[Key] = $scope.form[Key];
              }
          }
          return params;
      };
      $scope.setDevice=function(){
          var params = $scope.formatForm();
          Device.query(params,
              function(data) {
                $scope.deviceList = data.data
              },
              function(err) {
                HttpToast.toast(err);
          })
      }
      $scope.init = function(){
          $scope.setDevice()
          //var params = $scope.formatForm();
          //console.log(params)
      };
      $scope.init();
      $scope.searchDevice = function(){
          $scope.setDevice()
      }
      $scope.clearForm = function () {
          $scope.show.deviceStatus='';
          $scope.show.deviceType='';
          $scope.form = {
              name: '0',   //设备名称
              type: '0',   //设备类型key
              status:-1   //设备状态
          };
      };

      $scope.delItem = function (id) {
          ModalUtils.openMsg('app/powers/modal/dangerDelDevice.html', '',
              modalDelDeviceCtrl, {},
              function (info) {
                  // 传值走这里
                  if (info) {
                      DeviceDel.query({
                              id: id
                          },
                          function (data) {
                              ToastUtils.openToast('success', data.message);
                              $scope.clearForm(); // 新建，删除需要初始化表单状态
                              $scope.searchDevice();
                          }, function (err) {
                              HttpToast.toast(err);
                          });
                  }
              }, function (empty) {
                  // 不传值关闭走这里
          });
      };
      $scope.toggleDatepicker = function () {
          $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
      };

      $scope.toggleEndDatepicker = function () {
          $scope.data.endDate.isOpen = !$scope.data.endDate.isOpen;
      };
  }

})();