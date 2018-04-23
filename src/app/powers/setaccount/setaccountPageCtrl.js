/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.setaccount')
    .controller('setaccountPageCtrl', setaccountPageCtrl)
    //});
  /** @ngInject */
    function setaccountPageCtrl($scope, $timeout, baConfig,$http,ModalUtils,ToastUtils,HttpToast,locals,
                                UserEdit,UpImg) {
        $scope.flag1=true;
        $scope.flag2=true;
        $scope.flag3=true;
        $scope.flag4=true;
        $scope.flag5=true;
        $scope.flag6=true;
        $scope.down = function(n){
            switch(n)
            {
                case 1:
                    $("#div1").slideToggle("slow");
                    $scope.flag1=!$scope.flag1;
                    break;
                case 2:
                    $("#div2").slideToggle("slow");
                    $scope.flag2=!$scope.flag2;
                    break;
                case 3:
                    $("#div3").slideToggle("slow");
                    $scope.flag3=!$scope.flag3;
                    break;
                case 4:
                    $("#div4").slideToggle("slow");
                    $scope.flag4=!$scope.flag4;
                    break;
                case 5:
                    $("#div5").slideToggle("slow");
                    $scope.flag5=!$scope.flag5;
                    break;
                case 6:
                    $("#div6").slideToggle("slow");
                    $scope.flag6=!$scope.flag6;
                    break;
                default:
            }
        }
        var user = JSON.parse(locals.get('eUser',''));
        $scope.form  ={
            id:user.id,
            username:user.username,
            name:user.name,
            password:'false',
            phone:user.phone,
            email:user.email,
            headImg:user.headImg
        }
      $scope.formatForm =function(){
          var params ={}
          for (var Key in $scope.form){
              if ($scope.form[Key]) {
                  params[Key] = $scope.form[Key];
              }
          }
          return params
      };

      $scope.save =function(){
          var data = $scope.formatForm();
          if (data.username||data.password){
              data.password=$scope.form.password
          }
          UserEdit.create(data,function(obj){
              ToastUtils.openToast('success', obj.message);
          },function(err){
              HttpToast.toast(err);
          })
      };
      $scope.upSave =function(){
          //var formData=new FormData();
          //var formObj=document.getElementById("file").files[0];
          //formData.append('headImg', formObj)
          //UpImg.create(formData,function(obj){
          //    console.log(obj)
          //    ToastUtils.openToast('success', obj.message);
          //},function(err){
          //    HttpToast.toast(err);
          //})
              var formData = new FormData();
              var xmlhttp;
              if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                  xmlhttp = new XMLHttpRequest();
              }else {// code for IE6, IE5
                  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
              }
              xmlhttp.open("POST","http://yunwei.shanghaihenghui.com/energy/user/headImg",true);
              xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
              formData.append("headImg",document.getElementById("file").files[0]);
              xmlhttp.send(formData);
              xmlhttp.onreadystatechange=function() {
                  if (xmlhttp.readyState==4) {
                      if (xmlhttp.status==200) {
                          var res = JSON.parse(xmlhttp.responseText);
                          if(res.code == 200) {
                              var data = $scope.formatForm();
                              data['headImg'] = res.data.realName;
                              console.log(data)
                              UserEdit.create(data,function(obj){
                                  ToastUtils.openToast('success', obj.message);
                              },function(err){
                                  HttpToast.toast(err);
                              })
                              locals.put('headImg',res.data.realName);
                          } else {
                              ToastUtils.openToast('warning', res.message);
                          }
                      }else {
                          ToastUtils.openToast('error', "连接失败");

                      }
                  }
              }
      }
  }

})();