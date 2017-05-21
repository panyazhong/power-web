(function () {
    'use strict';

    angular.module('BlurAdmin.power.setuser')
        .controller('setuserPageCtrl', setuserPageCtrl)
        .controller('addUserCtrl', addUserCtrl)
        .controller('editUserCtrl', editUserCtrl);

    /** @ngInject */
    function setuserPageCtrl($scope, PageTopCache, Log, User, UserHelper, HttpToast, ExportPrefix,
                             ModalUtils, locals, ToastUtils) {
        PageTopCache.cache.state = 'settings';

        $scope.show = {
            userList: [],   // 用户列表
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
            if (id == locals.getObject('user').uid) {
                ToastUtils.openToast('warning', '您不能操作自己！');
                return;
            }

            ModalUtils.open('app/powers/setuser/widgets/editUserModal.html', 'lg',
                editUserCtrl, {uid: id},
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

    function addUserCtrl($scope, Keyword, KeywordCache, HttpToast, Sidebar, SidebarCache, locals,
                         ToastUtils, UserHelper, EditUser) {

        $scope.show = {
            userContracttyptArr: [],//合同类型
            userEducationArr: [],  //教育程度
            userAuthorityArr: [],  //权限
            userStatusArr: [],  //状态
            sidebarArr: [], //变电站数组

            contracttype: '',   //合同类型
            education: '',   //教育程度
            authority: '',   //权限
            status: '',   //状态
            clientName: '', //所属变电站
            isReceiveMsg: false, //是否接收短信
            isMustArr: ['code', 'position', 'tipline', 'contracttype', 'education']   // 选填的数组
        };

        $scope.form = {
            name: '',   //姓名
            code: '',   //工号
            position: '',   //岗位
            auth_id: '',    //所辖变电站
            tipline: '',    //内线
            authority: '',  //权限
            status: '',     //状态

            contracttype: '',   //合同类型
            education: '',      //教育程度
            phone1: '',         //手机1
            phone2: '',         //手机2 非必填
            isReceiveMsg: '',   //是否接收短信

            account: '',        //平台账号
            psw: ''             //密码
        };

        $scope.init = function () {
            if (KeywordCache.isEmpty()) {
                Keyword.query({},
                    function (data) {
                        KeywordCache.create(data);
                        $scope.show.userContracttyptArr = KeywordCache.getUser_contracttypt();
                        $scope.show.userEducationArr = KeywordCache.getUser_education();
                        $scope.show.userAuthorityArr = KeywordCache.getUser_authority();
                        $scope.show.userStatusArr = KeywordCache.getUser_status();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.show.userContracttyptArr = KeywordCache.getUser_contracttypt();
                $scope.show.userEducationArr = KeywordCache.getUser_education();
                $scope.show.userAuthorityArr = KeywordCache.getUser_authority();
                $scope.show.userStatusArr = KeywordCache.getUser_status();
            }

            if (SidebarCache.isEmpty()) {
                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        locals.putObject('sidebar', data.sidebar);

                        $scope.show.sidebarArr = data.sidebar;
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.show.sidebarArr = locals.getObject('sidebar');
            }

        };
        $scope.init();

        $scope.submit = function () {
            $scope.show.isReceiveMsg ? $scope.form.isReceiveMsg = '1' : $scope.form.isReceiveMsg = '0';

            var p = UserHelper.add($scope.show.isMustArr, $scope.form);


            if (p) {
                EditUser.create(p,
                    function (data) {
                        ToastUtils.openToast('success', data.message);
                        $scope.$close(data);
                    }, function (err) {
                        HttpToast.toast(err);
                    })
            }
        };

        // dropdown set
        $scope.setContracttype = function (obj) {
            $scope.show.contracttype = obj.name;
            $scope.form.contracttype = obj.id;
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
            $scope.form.auth_id = '';
            $scope.show.sidebarArr.map(function (item) {
                if (item.state) {
                    $scope.show.clientName += item.clientName + ",";
                    $scope.form.auth_id += item.clientId + ",";
                }
            });
            if ($scope.show.clientName.length > 0) {
                $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
            }
            if ($scope.form.auth_id.length > 0) {
                $scope.form.auth_id = $scope.form.auth_id.substring(0, $scope.form.auth_id.length - 1);
            }

        }
    }

    function editUserCtrl($scope, Keyword, KeywordCache, HttpToast, Sidebar, SidebarCache, locals,
                          ToastUtils, UserHelper, EditUser, params, User) {

        $scope.uid = params.uid;
        $scope.setDefChoiceState = function (arr) {

            if (arr.length == 0) {
                return;
            }

            $scope.show.sidebarArr.map(function (item) {
                arr.indexOf(item.clientId) == -1 ? item.state = false : item.state = true;
            });

        };

        $scope.queryUserDetail = function () {
            User.queryDetail({
                    uid: $scope.uid
                },
                function (data) {

                    // 1.赋值
                    $scope.form.name = data.name;
                    $scope.form.code = data.code;
                    $scope.form.position = data.position;
                    // auth_id: '',    //所辖变电站
                    $scope.form.tipline = data.tipline;
                    $scope.form.authority = data.authority.id;
                    $scope.show.authority = data.authority.name;
                    $scope.form.status = data.status.id;
                    $scope.show.status = data.status.name;

                    $scope.form.contracttype = data.contracttype.id;
                    $scope.show.contracttype = data.contracttype.name;
                    $scope.form.education = data.education.id;
                    $scope.show.education = data.education.name;
                    $scope.form.phone1 = data.phone1;
                    $scope.form.phone2 = data.phone2;
                    $scope.form.isReceiveMsg = data.isReceiveMsg;
                    $scope.show.isReceiveMsg = data.isReceiveMsg == '1';
                    $scope.form.account = data.account;
                    // 密码不需要
                    // 2.判断类型

                    var clientName = '';
                    var auth_id = '';
                    var choiceArr = [];
                    data.auth_id.map(function (item) {
                        clientName += item.name + ",";
                        auth_id += item.cid + ",";
                        choiceArr.push(item.cid);
                    });

                    $scope.setDefChoiceState(choiceArr);    // 设置默认选中的状态

                    if (clientName.length > 0) {
                        $scope.show.clientName = clientName.substring(0, clientName.length - 1);
                    }
                    if (auth_id.length > 0) {
                        $scope.form.auth_id = auth_id.substring(0, auth_id.length - 1);
                    }

                    // 3.提交

                    $scope.show.isAllowEdit = true; // 不允许修改账号
                },
                function () {

                })
        };
        // create

        $scope.show = {
            userContracttyptArr: [],//合同类型
            userEducationArr: [],  //教育程度
            userAuthorityArr: [],  //权限
            userStatusArr: [],  //状态
            sidebarArr: [], //变电站数组

            contracttype: '',   //合同类型
            education: '',   //教育程度
            authority: '',   //权限
            status: '',   //状态
            clientName: '', //所属变电站
            isReceiveMsg: false, //是否接收短信
            isMustArr: ['code', 'position', 'tipline', 'contracttype', 'education', 'psw']   // 选填的数组，与新建不同
        };

        $scope.form = {
            name: '',   //姓名
            code: '',   //工号
            position: '',   //岗位
            auth_id: '',    //所辖变电站
            tipline: '',    //内线
            authority: '',  //权限
            status: '',     //状态

            contracttype: '',   //合同类型
            education: '',      //教育程度
            phone1: '',         //手机1
            phone2: '',         //手机2 非必填
            isReceiveMsg: '',   //是否接收短信

            account: '',        //平台账号
            psw: ''             //密码
        };

        $scope.init = function () {
            if (KeywordCache.isEmpty()) {
                Keyword.query({},
                    function (data) {
                        KeywordCache.create(data);
                        $scope.show.userContracttyptArr = KeywordCache.getUser_contracttypt();
                        $scope.show.userEducationArr = KeywordCache.getUser_education();
                        $scope.show.userAuthorityArr = KeywordCache.getUser_authority();
                        $scope.show.userStatusArr = KeywordCache.getUser_status();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.show.userContracttyptArr = KeywordCache.getUser_contracttypt();
                $scope.show.userEducationArr = KeywordCache.getUser_education();
                $scope.show.userAuthorityArr = KeywordCache.getUser_authority();
                $scope.show.userStatusArr = KeywordCache.getUser_status();
            }

            if (SidebarCache.isEmpty()) {
                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        locals.putObject('sidebar', data.sidebar);

                        $scope.show.sidebarArr = data.sidebar;

                        $scope.queryUserDetail();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.show.sidebarArr = locals.getObject('sidebar');

                $scope.queryUserDetail();
            }

        };
        $scope.init();

        $scope.submit = function () {

            $scope.form.uid = $scope.uid;   // 编辑与新建不同之处

            // create
            $scope.show.isReceiveMsg ? $scope.form.isReceiveMsg = '1' : $scope.form.isReceiveMsg = '0';

            var p = UserHelper.add($scope.show.isMustArr, $scope.form);

            if (p) {
                EditUser.create(p,
                    function (data) {
                        ToastUtils.openToast('success', data.message);
                        $scope.$close(data);
                    }, function (err) {
                        HttpToast.toast(err);
                    })
            }
        };

        // dropdown set
        $scope.setContracttype = function (obj) {
            $scope.show.contracttype = obj.name;
            $scope.form.contracttype = obj.id;
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
            $scope.form.auth_id = '';
            $scope.show.sidebarArr.map(function (item) {
                if (item.state) {
                    $scope.show.clientName += item.clientName + ",";
                    $scope.form.auth_id += item.clientId + ",";
                }
            });
            if ($scope.show.clientName.length > 0) {
                $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
            }
            if ($scope.form.auth_id.length > 0) {
                $scope.form.auth_id = $scope.form.auth_id.substring(0, $scope.form.auth_id.length - 1);
            }

        }
    }

})();
