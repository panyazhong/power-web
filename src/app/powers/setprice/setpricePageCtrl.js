/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.setprice')
    .controller('setpricePageCtrl', setpricePageCtrl)
    //});
  /** @ngInject */
    function setpricePageCtrl($scope, $timeout, baConfig,$http,ModalUtils,ToastUtils,HttpToast,
                              userCache,DianjiaSave,DianjiaList
                            ) {
      //是否可编辑
      $scope.flag = false;

      //$scope.time = ["00:00-01:00","01:00-02:00","02:00-03:00","03:00-04:00","04:00-05:00","05:00-06:00","06:00-07:00","07:00-08:00",
      //    "08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00","16:00-17:00",
      //    "17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00","22:00-23:00","23:00-00:00"]
      //$scope.price = [
      //    {
      //        "time": "00:00-01:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },
      //    {
      //        "time": "01:00-02:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },
      //    {
      //        "time": "02:00-03:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },
      //    {
      //        "time": "03:00-04:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },
      //    {
      //        "time": "04:00-05:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },
      //    {
      //        "time": "05:00-06:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },
      //    {
      //        "time": "06:00-07:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "07:00-08:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "08:00-09:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "09:00-10:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "10:00-11:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "11:00-12:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "12:00-13:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "13:00-14:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "14:00-15:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "15:00-16:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"}
      //    ,{
      //        "time": "16:00-17:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "17:00-18:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "18:00-19:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "19:00-20:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "20:00-21:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "21:00-22:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "22:00-23:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"
      //    },{
      //        "time": "23:00-00:00",
      //        "beforePrice": "0.64",
      //        "discount": "0.9",
      //        "afterPrice": "0.58"}
      //]
      $scope.summer = '';
      $scope.nonSummer = '';
      $scope.show = {
          userType: userCache.getUserType(),
      }
      $scope.form = {
          clientId:'1',
          uid:'1',
          id:'1',
          status:'1'
      }
      $scope.formatForm = function () {
          var params = {};
          for (var Key in $scope.form) {
              if ($scope.form[Key]) {
                  params[Key] = $scope.form[Key];
              }
          }
          return params;
      };
      //电价列表
      $scope.query = function(){
          var params =$scope.formatForm();
          DianjiaList.query(params,function(data){
              $scope.summer=data.data.summer;
              $scope.nonSummer=data.data.nonSummer;
              $scope.form.clientId =data.data.clientId;
              $scope.form.id =data.data.id;
          })
      };

      $scope.init = function(){
          $scope.query();
          if ($scope.show.userType == 4) {
              $scope.noEdit = true
          }
      }
      $scope.init()


      //编辑
      $scope.edit = function(){
          $scope.flag = !$scope.flag;
      };


      $scope.close = function(){
          $scope.flag = !$scope.flag
      };
      //计算夏季折后电价
      $scope.countSummer = function(x,y,index){
          if(isNaN(x)||isNaN(y)){
              return ToastUtils.openToast('warning', '请输入正确数字');
          }
          $scope.summer[index].afterPrice=(x*y).toFixed(2);
      };

      //计算夏季折后电价
      $scope.countNonSummer = function(x,y,index){
          if(isNaN(x)||isNaN(y)){
              return ToastUtils.openToast('warning', '请输入正确数字');
          }
          $scope.nonSummer[index].afterPrice=(x*y).toFixed(2);
      }

      //保存
      $scope.save = function(){
          var data = $scope.formatForm();
          if(data.status=='1'){
              data['data']=$scope.summer;
          }
          if(data.status=='2') {
              data['data']=$scope.nonSummer;
          }
          $scope.flag = !$scope.flag;
          DianjiaSave.create(data,function(obj){
              ToastUtils.openToast('success', obj.message);
          },function(err){
              HttpToast.toast(err);
          })
      };


  }

})();