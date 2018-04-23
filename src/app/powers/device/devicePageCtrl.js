/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.device')
    .controller('devicePageCtrl', devicePageCtrl)
    .controller('modalDelDeviceCtrl', modalDelDeviceCtrl);

  /** @ngInject */
    function devicePageCtrl($scope, $timeout, baConfig,$http,ModalUtils,ToastUtils,
                            DevicetypeList,Device,DeviceDel,DeviceAttr,DeviceEdit) {
      $scope.show= {
          deviceStatus:'',//状态
          deviceStatusArr:[{status:'1',name:'运行'},{status:'0',name:'停役'}],
          deviceType:'',//类型
          deviceTypeArr:[],
          currentState: 'main',
          pageTabData: [
              {
                  title: '基本信息',
                  state: 'base'
              },
              {
                  title: '详细信息',
                  state: 'detail'
              }
          ],
          pageTabState: 'base'   // 默认state

      };
      $scope.form = {
          name: '',   //设备名称
          type: '0',   //设备类型key
          status:-1   //设备状态
      };
      $scope.editform = {
          devName: '',   //设备名称
          devTypeId: '',   //设备类型
          devEsn:'', //设备SN
          devVersion:'' ,  //设备版本
      };
      //状态
      $scope.setStatus = function (obj) {
          $scope.show.deviceStatus = obj.name;
          $scope.form.status = obj.status;
      };
      //类型
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
      //类型列表
      $scope.setTypeList =function(){
          DevicetypeList.query(
              function(data) {
                  $scope.show.deviceTypeArr = data.data
              },
              function(err) {
                  HttpToast.toast(err);
          })
      };
      //搜索设备
      $scope.setDevice=function(){
          var params = $scope.formatForm();
          Device.query(params,
              function(data) {
                $scope.deviceList = data.data
              },
              function(err) {
                HttpToast.toast(err);
          })
      };

      $scope.init = function(){
          $scope.setTypeList()
          $scope.setDevice()
      };
      $scope.init();
      //搜索
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
      //删除
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
      //获取设备信息
      $scope.searchEdit = function(id){
          DeviceAttr.query({
                  id: id
              },
              function (data) {
                  //console.log(data)
                  $scope.stationName = data.data.stationName;
                  $scope.editform.id=data.data.id;   //设备名称
                  $scope.editform.devName=data.data.devName;   //设备名称
                  $scope.editform.devEsn=data.data.devEsn;//设备SN
                  $scope.editform.devVersion=data.data.devVersion;//版本
                  //设备类型
                  for (var i = 0; i < $scope.show.deviceTypeArr.length; i++) {
                      var subObj = $scope.show.deviceTypeArr[i];
                      if (subObj.type == data.data.devTypeId) {
                          $scope.editform.deviceType = subObj.name;
                          $scope.editform.devTypeId = subObj.type;
                      }
                  }
              }, function (err) {
                  HttpToast.toast(err);
              });
      }
      //切换修改页面
      $scope.editItem =function(id){
          $scope.show.currentState ='edit';
          $scope.searchEdit(id);
      }
      //类型下拉--修改页面
      $scope.editSetType = function (obj) {
          $scope.editform.deviceType = obj.name;
          $scope.editform.devTypeId = obj.type;
      };
      $scope.editformatForm = function () {
          var params = {};
          for (var Key in $scope.editform) {
              if ($scope.editform[Key]) {
                  params[Key] = $scope.editform[Key];
              }
          }
          return params;
      };
      //修改设备
      $scope.editDevice = function(){
          var data =$scope.editformatForm()
          DeviceEdit.create(data,function(obj){
              ToastUtils.openToast('success', obj.message);
              $scope.setDevice()
          },function(err){
              HttpToast.toast(err);
          })
      }
      $scope.back =function(){
          $scope.show.currentState ='main';
      }
    }

  //删除
    function modalDelDeviceCtrl($scope) {
        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };
    }
})();