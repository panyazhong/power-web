(function () {
    'use strict';

    angular.module('BlurAdmin.power.setuser')
        .controller('setuserPageCtrl', setuserPageCtrl)
        .controller('addUserCtrl', addUserCtrl)
        .controller('editUserCtrl', editUserCtrl);

    /** @ngInject */
    function setuserPageCtrl($scope, PageTopCache, User, UserHelper, ToastUtils, HttpToast, ExportPrefix,
                             ModalUtils, userCache) {
        PageTopCache.cache.state = 'settings';

        $scope.show = {
            userList: []   // 用户列表
        };
        $scope.rowCollection = [];

        $scope.init = function () {
            User.query({},
                function (data) {
                    $scope.show.userList = UserHelper.query(data);
                    $scope.rowCollection = UserHelper.query(data);
                },
                function (err) {
                    HttpToast.toast(err);
                })
        };
        $scope.init();

        $scope.add = function () {
            ModalUtils.open('app/powers/setuser/widgets/createUserModal.html', 'lg',
                addUserCtrl, {},
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.init();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        $scope.edit = function (id) {
            if (id == userCache.getUserId()) {
                ToastUtils.openToast('warning', '您不能操作自己！');
                return;
            }

            ModalUtils.open('app/powers/setuser/widgets/editUserModal.html', 'lg',
                editUserCtrl, {id: id},
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.init();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        $scope.export = function () {
            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            var URL = ExportPrefix.userPrefix;
            window.open(URL, "_blank", strWindowFeatures);
        };

        $scope.print = function () {
            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            var URL = ExportPrefix.userPrefixPrint;
            window.open(URL, "_blank", strWindowFeatures);
        };

    }

    function addUserCtrl($scope, treeCache, kCache, User, UserHelper, HttpToast, ToastUtils) {

        $scope.show = {
            userContracttyptArr: [],//合同类型
            userEducationArr: [],  //教育程度
            userAuthorityArr: [],  //权限
            userStatusArr: [],  //状态
            sidebarArr: [], //变电站数组

            contractType: '',   //合同类型
            education: '',   //教育程度
            authority: '',   //权限
            status: '',   //状态
            clientName: '', //所属变电站
            msgLevel: false, //是否接收短信
            isMustArr: ['code', 'position', 'tipLine', 'contractType', 'education']   // 选填的数组
        };

        $scope.form = {
            name: '',   //姓名
            code: '',   //工号
            position: '',   //岗位
            client_ids: [],    //所辖变电站
            tipLine: '',    //内线
            authority: '',  //权限
            status: '',     //状态

            contractType: '',   //合同类型
            education: '',      //教育程度
            phone1: '',         //手机1
            phone2: '',         //手机2 非必填
            msgLevel: '',   //是否接收短信

            account: '',        //平台账号
            psw: ''             //密码
        };

        $scope.init = function () {

            var pm = treeCache.getTree();
            pm.then(function (data) {
                $scope.show.sidebarArr = treeCache.createClientArr(data);
            });

            var pmKey = kCache.getKey();
            pmKey.then(function (data) {
                $scope.show.userContracttyptArr = kCache.getUser_contracttypt(data);
                $scope.show.userEducationArr = kCache.getUser_education(data);
                $scope.show.userAuthorityArr = kCache.getUser_authority(data);
                $scope.show.userStatusArr = kCache.getUser_status();
            });

        };
        $scope.init();

        $scope.submit = function () {
            $scope.show.msgLevel ? $scope.form.msgLevel = '1' : $scope.form.msgLevel = '0';

            var p = UserHelper.add($scope.show.isMustArr, $scope.form);


            if (p) {
                User.create(p,
                    function (data) {
                        ToastUtils.openToast('success', data.message);
                        $scope.$close(data);
                    },
                    function (err) {
                        HttpToast.toast(err);
                    })
            }
        };

        // dropdown set
        $scope.setContracttype = function (obj) {
            $scope.show.contractType = obj.name;
            $scope.form.contractType = obj.id;
        };
        $scope.setEducation = function (obj) {
            $scope.show.education = obj.name;
            $scope.form.education = obj.id;
        };
        $scope.setAuthority = function (obj) {
            $scope.show.authority = obj.name;
            $scope.form.authority = obj.id;
        };
        $scope.setStatus = function (obj) {
            $scope.show.status = obj.name;
            $scope.form.status = obj.id;
        };
        $scope.changeClent = function (obj) {
            obj.state = !obj.state;

            /**
             * 遍历变电站数组，看那个是选中的
             */
            $scope.show.clientName = '';
            $scope.form.client_ids = [];
            $scope.show.sidebarArr.map(function (item) {
                if (item.state) {
                    $scope.show.clientName += item.clientName + "，";
                    $scope.form.client_ids.push(item.clientId);
                }
            });
            if ($scope.show.clientName.length > 0) {
                $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
            }

        }
    }

    function editUserCtrl($scope, treeCache, kCache, User, UserHelper, HttpToast, ToastUtils, params, arrUtil) {

        $scope.id = params.id;
        $scope.setDefChoiceState = function (arr) {
            if (!arr || !arr.length) return;

            $scope.show.sidebarArr.map(function (item) {
                arr.indexOf(item.clientId) == -1 ? item.state = false : item.state = true;
            });

        };
        $scope.queryUserDetail = function () {
            var p = {
                uid: $scope.id
            };
            User.queryDetail(p,
                function (data) {

                    // a. 赋值
                    $scope.form.name = data.name;
                    $scope.form.code = data.code;
                    $scope.form.position = data.position;
                    $scope.form.tipLine = data.tipLine;

                    // b. 赋值keyword
                    $scope.form.authority = data.authority;
                    $scope.show.authority = arrUtil.getValById($scope.show.userAuthorityArr, data.authority);

                    $scope.form.status = data.status;
                    $scope.show.status = arrUtil.getValById($scope.show.userStatusArr, data.status);

                    $scope.form.contractType = data.contractType;
                    $scope.show.contractType = arrUtil.getValById($scope.show.userContracttyptArr, data.contractType);

                    $scope.form.education = data.education;
                    $scope.show.education = arrUtil.getValById($scope.show.userEducationArr, data.education);

                    // c. 赋值 账号相关
                    $scope.form.phone1 = data.phone1;
                    $scope.form.phone2 = data.phone2;
                    $scope.form.msgLevel = data.msgLevel;
                    $scope.show.msgLevel = data.msgLevel == '1';
                    $scope.form.account = data.account;
                    // pwd不需要

                    // d. 变电站状态
                    $scope.show.clientName = '';
                    $scope.form.client_ids = [];
                    data.clients.map(function (item) {
                        $scope.show.clientName += item.name + "，";
                        $scope.form.client_ids.push(item.id);
                    });
                    if ($scope.show.clientName.length > 0) {
                        $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
                    }

                    $scope.setDefChoiceState($scope.form.client_ids);    // 设置默认选中的状态

                    // e. 提交，不允许修改账号
                    $scope.show.isAllowEdit = true;

                },
                function (err) {
                    HttpToast.toast(err);
                })
        };

        //↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ 编辑与新建不同之处

        $scope.show = {
            userContracttyptArr: [],//合同类型
            userEducationArr: [],  //教育程度
            userAuthorityArr: [],  //权限
            userStatusArr: [],  //状态
            sidebarArr: [], //变电站数组

            contractType: '',   //合同类型
            education: '',   //教育程度
            authority: '',   //权限
            status: '',   //状态
            clientName: '', //所属变电站
            msgLevel: false, //是否接收短信
            isMustArr: ['code', 'position', 'tipLine', 'contractType', 'education']   // 选填的数组
        };

        $scope.form = {
            name: '',   //姓名
            code: '',   //工号
            position: '',   //岗位
            client_ids: [],    //所辖变电站
            tipLine: '',    //内线
            authority: '',  //权限
            status: '',     //状态

            contractType: '',   //合同类型
            education: '',      //教育程度
            phone1: '',         //手机1
            phone2: '',         //手机2 非必填
            msgLevel: '',   //是否接收短信

            account: '',        //平台账号
            psw: ''             //密码
        };

        $scope.init = function () {

            var pm = treeCache.getTree();
            pm.then(function (data) {
                $scope.show.sidebarArr = treeCache.createClientArr(data);
            });

            var pmKey = kCache.getKey();
            pmKey.then(function (data) {
                $scope.show.userContracttyptArr = kCache.getUser_contracttypt(data);
                $scope.show.userEducationArr = kCache.getUser_education(data);
                $scope.show.userAuthorityArr = kCache.getUser_authority(data);
                $scope.show.userStatusArr = kCache.getUser_status();

                $scope.queryUserDetail();
            });

        };
        $scope.init();

        $scope.submit = function () {
            $scope.form.id = $scope.id;   // 编辑与新建不同之处
            $scope.show.msgLevel ? $scope.form.msgLevel = '1' : $scope.form.msgLevel = '0';

            var p = UserHelper.add($scope.show.isMustArr, $scope.form);


            if (p) {
                User.edit(p,    // 编辑与新建不同之处，这里是PUT请求
                    function (data) {
                        ToastUtils.openToast('success', data.message);
                        $scope.$close(data);
                    },
                    function (err) {
                        HttpToast.toast(err);
                    })
            }
        };

        // dropdown set
        $scope.setContracttype = function (obj) {
            $scope.show.contractType = obj.name;
            $scope.form.contractType = obj.id;
        };
        $scope.setEducation = function (obj) {
            $scope.show.education = obj.name;
            $scope.form.education = obj.id;
        };
        $scope.setAuthority = function (obj) {
            $scope.show.authority = obj.name;
            $scope.form.authority = obj.id;
        };
        $scope.setStatus = function (obj) {
            $scope.show.status = obj.name;
            $scope.form.status = obj.id;
        };
        $scope.changeClent = function (obj) {
            obj.state = !obj.state;

            /**
             * 遍历变电站数组，看那个是选中的
             */
            $scope.show.clientName = '';
            $scope.form.client_ids = [];
            $scope.show.sidebarArr.map(function (item) {
                if (item.state) {
                    $scope.show.clientName += item.clientName + "，";
                    $scope.form.client_ids.push(item.clientId);
                }
            });
            if ($scope.show.clientName.length > 0) {
                $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
            }

        }
    }

})();
