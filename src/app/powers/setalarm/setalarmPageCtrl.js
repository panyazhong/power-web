(function () {
    'use strict';

    angular.module('BlurAdmin.power.setalarm')
        .controller('setalarmPageCtrl', setalarmPageCtrl)
        .controller('setICtrl', setICtrl)
        .controller('setUCtrl', setUCtrl)
        .controller('setIaCtrl', setIaCtrl);

    /** @ngInject */
    function setalarmPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, Log, locals, AlertSet, setalarmHelper,
                              HttpToast, ModalUtils, $rootScope) {
        PageTopCache.cache.state = 'settings';

        $scope.show = {
            setList: [],
            clientName: '',  //变电站
            sidebarArr: []   //变电站数组
        };
        $scope.rowCollection = [];

        $scope.form = {
            client_id: ''  //变电站cid
        };

        // dropdown set 1
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            $scope.show.clientName = obj.clientName;

            // 更换变电站更新列表
            $scope.queryList($scope.form.client_id);
        };

        $scope.queryList = function (cid) {
            AlertSet.query({
                    client: 'client',
                    cid: cid
                },
                function (data) {
                    $scope.show.setList = setalarmHelper.query(data);
                    $scope.rowCollection = setalarmHelper.query(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

        };

        $scope.initFilterInfo = function () {

            var cid = locals.get('cid', '') ? locals.get('cid', '') : SidebarCache.getData().sidebar[0].clientId;
            if (cid) {
                for (var i = 0; i < $scope.show.sidebarArr.length; i++) {
                    var item = $scope.show.sidebarArr[i];
                    if (item.clientId == cid) {
                        $scope.changeClent(item);
                    }
                }
            }

        };

        $scope.init = function () {

            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.show.sidebarArr = data.sidebar;
                        $scope.initFilterInfo();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
                $scope.initFilterInfo();
            }

        };
        $scope.init();

        $scope.openModal = function (path, ctrl, data) {
            ModalUtils.open(path, 'lg',
                ctrl, data,
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.queryList($scope.form.client_id);
                    }
                },
                function (empty) {
                    // 不传值关闭走这里
                });

        };

        $scope.edit = function (item) {
            var d = _.cloneDeep(item);
            // 开关flag
            d.data.map(function (subItem) {
                subItem.showStatus = subItem.status == '1';
                subItem.showMsgFlag = subItem.msgFlag == '1';
            });

            var path = '';
            var ctrl = '';
            switch (item.prop) {
                case 'Ia':  //电流
                case 'Ib':
                case 'Ic':
                case 'PF':  //功率因数
                case 'P':   //有功
                case 'Q':   //无功
                    path = 'app/powers/setalarm/widgets/setIModal.html';
                    ctrl = setICtrl;
                    $scope.openModal(path, ctrl, d);
                    break;
                case 'Ua':  //电压
                case 'Ub':
                case 'Uc':
                    path = 'app/powers/setalarm/widgets/setUModal.html';
                    ctrl = setUCtrl;
                    $scope.openModal(path, ctrl, d);
                    break;
                case 'IaOC':    //继电报警
                case 'IbOC':
                case 'IcOC':
                    path = 'app/powers/setalarm/widgets/setIaModal.html';
                    ctrl = setIaCtrl;
                    $scope.openModal(path, ctrl, d);
                    break;
            }
        };

        $rootScope.$on('filterInfo', function (event, data) {
            if (!data) {
                return
            }
            if ($state.$current != 'setalarm') {
                return
            }

            if (data.cid) {
                for (var i = 0; i < $scope.show.sidebarArr.length; i++) {
                    var item = $scope.show.sidebarArr[i];
                    if (item.clientId == data.cid) {
                        $scope.changeClent(item);
                    }

                }
            }

        });

    }

    function setICtrl($scope, params, Log, AlertSet, HttpToast, ToastUtils) {

        $scope.show = {
            data: params,
            setList: params.data
        };
        $scope.rowCollection = params.data;

        $scope.formatForm = function () {
            var data = {
                props: {}
            };

            params.data.map(function (item) {
                // 全部传
                data.props[item.prop_id] = {};
                data.props[item.prop_id]['warning'] = item.warning;
                data.props[item.prop_id]['error'] = item.error;
                data.props[item.prop_id]['status'] = item.showStatus ? '1' : '0';
                data.props[item.prop_id]['msgFlag'] = item.showMsgFlag ? '1' : '0';
            });

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSet.edit(params,
                function (data) {
                    ToastUtils.openToast('info', data.message);
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            Log.i('请求的参数是：' + JSON.stringify(params));

        };

    }

    function setUCtrl($scope, params, Log, AlertSet, HttpToast, ToastUtils) {

        $scope.show = {
            data: params,
            setList: params.data
        };
        $scope.rowCollection = params.data;

        $scope.formatForm = function () {
            var data = {
                props: {}
            };

            params.data.map(function (item) {
                // 全部传
                data.props[item.prop_id] = {};
                data.props[item.prop_id]['warning'] = item.warning;
                data.props[item.prop_id]['error'] = item.error;
                data.props[item.prop_id]['status'] = item.showStatus ? '1' : '0';
                data.props[item.prop_id]['msgFlag'] = item.showMsgFlag ? '1' : '0';
                // diff
                data.props[item.prop_id]['refVal'] = item.refVal;
            });

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSet.edit(params,
                function (data) {
                    ToastUtils.openToast('info', data.message);
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            Log.i('请求的参数是：' + JSON.stringify(params));

        };

    }

    function setIaCtrl($scope, params, Log, AlertSet, HttpToast, ToastUtils) {

        $scope.show = {
            data: params,
            setList: params.data
        };
        $scope.rowCollection = params.data;

        $scope.formatForm = function () {
            var data = {
                props: {}
            };

            params.data.map(function (item) {
                // 全部传
                data.props[item.prop_id] = {};
                data.props[item.prop_id]['status'] = item.showStatus ? '1' : '0';
                data.props[item.prop_id]['msgFlag'] = item.showMsgFlag ? '1' : '0';
            });

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSet.edit(params,
                function (data) {
                    ToastUtils.openToast('info', data.message);
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            Log.i('请求的参数是：' + JSON.stringify(params));

        };

    }

})();
