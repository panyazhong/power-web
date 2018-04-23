/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.setuser')
    .controller('setuserPageCtrl', setuserPageCtrl)
    .controller('addUserCtrl', addUserCtrl)
    .controller('editUserCtrl', editUserCtrl)
    .controller('modalDelUserCtrl', modalDelUserCtrl);

  /** @ngInject */
    function setuserPageCtrl($scope, $timeout, baConfig,$http,ModalUtils,ToastUtils,
                             UserList,UserDel) {
      $scope.form = {
          name:'',
      }
      $scope.setUserList =function(){
          UserList.query(
              function(data) {
                  $scope.userList = data.data
              },
              function(err) {
                  HttpToast.toast(err);
              })
      };
      $scope.searchUser = function(){
          var p = {name:$scope.form.name}
          UserList.query({name:$scope.form.name},
              function(data) {
                  $scope.userList = data.data
              },
              function(err) {
                  HttpToast.toast(err);
              })
      }
      $scope.init = function(){
          $scope.setUserList()
      }
      $scope.init()
      $scope.addUser = function () {
          ModalUtils.open('app/powers/setuser/widgets/createUserModal.html', 'lg',
              addUserCtrl, {},
              function (info) {
                  // 传值走这里
                  if (info) {
                      //$scope.init();
                      $scope.setUserList()
                  }
              }, function (empty) {
                  // 不传值关闭走这里
              }
           );
      };
      $scope.editItem = function (id) {
          ModalUtils.openMsg('app/powers/setuser/widgets/editUserModal.html', 'lg',
              editUserCtrl, {id: id},
              function (info) {
                  // 传值走这里
                  if (info) {
                      $scope.setUserList()
                  }
              }, function (empty) {
                  // 不传值关闭走这里
              });
      };
      $scope.delItem = function (id) {
          ModalUtils.openMsg('app/powers/modal/dangerDel.html', '',
              modalDelUserCtrl, {},
              function (info) {
                  // 传值走这里
                  if (info) {
                      UserDel.query({
                              id: id
                          },
                          function (data) {
                              ToastUtils.openToast('success', data.message);
                              //$scope.clearForm();
                              $scope.setUserList();
                          }, function (err) {
                              HttpToast.toast(err);
                          });
                  }
              }, function (empty) {
                  // 不传值关闭走这里
              });
      };
    }
    //添加
    function addUserCtrl($scope,ToastUtils,HttpToast,userCache,
                         UserAdd) {
        $scope.show = {
            gender:'',
            owner:'否',
            status:'启用',
            level:'初级',
            auth:'客户',
            sendEmail:'不发送',
            genderArr:[{id:'1',name:'男'},{id:'2',name:'女'}],
            sendemailArr:[{id:'1',name:'发送'},{id:'0',name:'不发送'}],
            ownerArr:[{id:'1',name:'是'},{id:'0',name:'否'}],
            statusArr:[{id:'1',name:'启用'},{id:'0',name:'禁用'}],
            levelArr:[{id:'1',name:'初级'},{id:'2',name:'中级'},{id:'3',name:'高级'}],
            authArr:[{id:'8',name:'管理员'},{id:'4',name:'运维管理'},{id:'2',name:'运维普通'},{id:'1',name:'客户'}],
            clientName:'',
            clientArr:userCache.getclientIds()
        }
        $scope.form={
            username:'',//用户名
            password:'',//密码
            name:'',//姓名
            phone:'',//电话
            email:'',//邮箱
            sendEmail:'0',//邮件通知
            description:'',//描述
            gender:'',//性别
            isOwner:'0',//业主
            status:'1',//状态
            level:'1',//级别
            auth:'1',//权限
            clientIds:''
        };
        //赋值
        $scope.setGender = function (obj) {
            $scope.show.gender = obj.name;
            $scope.form.gender = obj.id;
        };
        $scope.setsendEmail = function (obj) {
            $scope.show.sendEmail = obj.name;
            $scope.form.sendEmail = obj.id;
        };
        $scope.setOwner = function (obj) {
            $scope.show.owner = obj.name;
            $scope.form.isOwner = obj.id;
        };
        $scope.setStatus = function (obj) {
            $scope.show.status = obj.name;
            $scope.form.status = obj.id;
        };
        $scope.setLevel = function (obj) {
            $scope.show.level = obj.name;
            $scope.form.level = obj.id;
        };
        $scope.setAuth = function (obj) {
            $scope.show.auth = obj.name;
            $scope.form.auth = obj.id;
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

        $scope.add = function(){
            var data =$scope.formatForm();
            //console.log(data)
            if (!($scope.form.username && $scope.form.password && $scope.form.name && $scope.form.phone)){
                ToastUtils.openToast('warning', '请完善所有必选信息！');
            }
            else{
                UserAdd.create(data,function(obj){
                    ToastUtils.openToast('success', obj.message);
                    $scope.$close(obj);
                },function(err){
                    HttpToast.toast(err);
                })
            }

        }
        $scope.changeClent = function (obj) {
            obj.state = !obj.state;

            /**
             * 遍历变电站数组，看那个是选中的
             */
            $scope.show.clientName = '';
            $scope.form.clientIds = '';
            $scope.show.clientArr.map(function (item) {
                if (item.state) {
                    $scope.show.clientName += item.name + "，";
                    $scope.form.clientIds += item.id+",";
                    //$scope.form.clientIds.push(item.id);
                }
            });
            if ($scope.show.clientName.length > 0) {
                $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
            }

        }
    }
    //修改
    function editUserCtrl($scope,HttpToast,arrUtil,params,ToastUtils,UserAttr,UserEdit,userCache) {
        //获取用户信息 赋值
        $scope.setuserAttr = function(){
            var p = {id:params.id};
            UserAttr.query(p,
                function(data) {
                    $scope.form.username = data.data.username;
                    //$scope.form.password = data.data.password;
                    $scope.form.name = data.data.name;
                    $scope.form.phone = data.data.phone;
                    $scope.form.email = data.data.email;
                    $scope.form.description = data.data.description;

                    $scope.form.gender = data.data.gender;
                    $scope.show.gender = arrUtil.getValById($scope.show.genderArr, data.data.gender);

                    $scope.form.isOwner = data.data.isOwner;
                    $scope.show.owner = arrUtil.getValById($scope.show.ownerArr, data.data.isOwner);

                    $scope.form.sendEmail = data.data.sendEmail;
                    $scope.show.sendEmail = arrUtil.getValById($scope.show.sendemailArr, data.data.sendEmail);

                    $scope.form.level = data.data.level;
                    $scope.show.level = arrUtil.getValById($scope.show.levelArr, data.data.level);

                    $scope.form.status = data.data.status;
                    $scope.show.status = arrUtil.getValById($scope.show.statusArr, data.data.status);

                    $scope.form.auth = data.data.auth;
                    $scope.show.auth = arrUtil.getValById($scope.show.authArr, data.data.auth);

                },
                function(err) {
                    HttpToast.toast(err);
                })

        }
        $scope.show={
            gender:'',
            owner:'',
            status:'',
            level:'',
            auth:'',
            sendEmail:'',
            genderArr:[{id:'1',name:'男'},{id:'2',name:'女'}],
            sendemailArr:[{id:'1',name:'发送'},{id:'0',name:'不发送'}],
            ownerArr:[{id:'1',name:'是'},{id:'0',name:'否'}],
            statusArr:[{id:'1',name:'启用'},{id:'0',name:'禁用'}],
            levelArr:[{id:'1',name:'初级'},{id:'2',name:'中级'},{id:'3',name:'高级'}],
            authArr:[{id:'8',name:'管理员'},{id:'4',name:'运维管理'},{id:'2',name:'运维普通'},{id:'1',name:'客户'}],
            isMustArr: ['username', 'password', 'name', 'phone'],
            clientArr:userCache.getclientIds(),
            clientName:''

        }
        $scope.form={
            username:'',//用户名
            password:'',//密码
            name:'',//姓名
            phone:'',//电话
            email:'',//邮箱
            sendEmail:'',//邮件通知
            description:'',//描述
            gender:'',//性别
            isOwner:'',//业主
            status:'',//状态
            level:'',//级别
            auth:'',//权限
            clientIds:''
        };
        $scope.init = function(){
            $scope.setuserAttr()
        }
        $scope.init();
        $scope.setGender = function (obj) {
            $scope.show.gender = obj.name;
            $scope.form.gender = obj.id;
        };
        $scope.setsendEmail = function (obj) {
            $scope.show.sendEmail = obj.name;
            $scope.form.sendEmail = obj.id;
        };
        $scope.setOwner = function (obj) {
            $scope.show.owner = obj.name;
            $scope.form.isOwner = obj.id;
        };
        $scope.setStatus = function (obj) {
            $scope.show.status = obj.name;
            $scope.form.status = obj.id;
        };
        $scope.setLevel = function (obj) {
            $scope.show.level = obj.name;
            $scope.form.level = obj.id;
        };
        $scope.setAuth = function (obj) {
            $scope.show.auth = obj.name;
            $scope.form.auth = obj.id;
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
        $scope.edit = function(){
            var data =$scope.formatForm();
            data.id = params.id;
            UserEdit.create(data,function(obj){
                ToastUtils.openToast('success', obj.message);
                $scope.$close(obj);
            },function(err){
                HttpToast.toast(err);
            })
        }
        $scope.changeClent = function (obj) {
            obj.state = !obj.state;

            /**
             * 遍历变电站数组，看那个是选中的
             */
            $scope.show.clientName = '';
            $scope.form.clientIds = '';
            $scope.show.clientArr.map(function (item) {
                if (item.state) {
                    $scope.show.clientName += item.name + "，";
                    $scope.form.clientIds += item.id+",";
                    //$scope.form.clientIds.push(item.id);
                }
            });
            if ($scope.show.clientName.length > 0) {
                $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
            }

        }
    }

    //删除
    function modalDelUserCtrl($scope) {
        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };
    }
})();