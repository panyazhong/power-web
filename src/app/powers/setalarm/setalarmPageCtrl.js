(function () {
    'use strict';

    angular.module('BlurAdmin.power.setalarm')
        .controller('setalarmPageCtrl', setalarmPageCtrl)
        .controller('setICtrl', setICtrl)
        .controller('setUCtrl', setUCtrl)
        .controller('setIaCtrl', setIaCtrl)
        .controller('setTCtrl', setTCtrl)
        .controller('setPCtrl', setPCtrl);

    /** @ngInject */
    function setalarmPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, Log, locals, AlertSet, setalarmHelper,
                              HttpToast, ModalUtils, $rootScope, treeCache) {
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

        $scope.initFilterInfo = function () {

            var cid = locals.get('cid', '') || $scope.show.sidebarArr[0].clientId;
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

            var pm = treeCache.getTree();
            pm.then(function (data) {
                $scope.show.sidebarArr = treeCache.createClientArr(data);
                $scope.initFilterInfo();
            });

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
            if (item.prop == "Tet" || item.prop == "Tsc") {
                d.data.showStatus = d.data.status == '1';
                d.data.showMsgFlag = d.data.msgFlag == '1';
            }
            else if (item.prop == "PSum") {
                d.data.showStatus = d.data.status == '1';
                d.data.showMsgFlag = d.data.msgFlag == '1';
            }
            else {
                d.data.map(function (subItem) {
                    subItem.showStatus = subItem.status == '1';
                    subItem.showMsgFlag = subItem.msgFlag == '1';
                });
            }

            var path = '';
            var ctrl = '';
            switch (item.prop) {
                case 'Ia':  //电流
                case 'Ib':
                case 'Ic':
                case 'Iavg':   //电流平均值最大值
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
                case 'Tet': //距离电试周期时间
                case 'Tsc': //距离检修周期时间
                    path = 'app/powers/setalarm/widgets/setTModal.html';
                    ctrl = setTCtrl;
                    d.cid = $scope.form.client_id;  // diff
                    $scope.openModal(path, ctrl, d);
                    break;
                case 'PSum': //当前用电需量占比
                    path = 'app/powers/setalarm/widgets/setPModal.html';
                    ctrl = setPCtrl;
                    d.cid = $scope.form.client_id;  // diff
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
            var data = [];

            params.data.map(function (item) {
                // 全部传
                var obj = {};
                obj['prop_id'] = item.prop_id;
                obj['warning'] = item.warning || '';
                obj['error'] = item.error || '';
                obj['status'] = item.showStatus ? '1' : '0';
                obj['msgFlag'] = item.showMsgFlag ? '1' : '0';
                data.push(obj);
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
            var data = [];

            params.data.map(function (item) {
                // 全部传
                var obj = {};
                obj['prop_id'] = item.prop_id;
                obj['warning'] = item.warning || '';
                obj['error'] = item.error || '';
                obj['status'] = item.showStatus ? '1' : '0';
                obj['msgFlag'] = item.showMsgFlag ? '1' : '0';
                // diff
                obj['refVal'] = item.refVal || '';
                data.push(obj);
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
            var data = [];

            params.data.map(function (item) {
                // 全部传
                var obj = {};
                obj['prop_id'] = item.prop_id;
                obj['status'] = item.showStatus ? '1' : '0';
                obj['msgFlag'] = item.showMsgFlag ? '1' : '0';
                data.push(obj);
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

    function setTCtrl($scope, params, Log, AlertSetting, HttpToast, ToastUtils) {
        $scope.show = params;

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
        };

        $scope.init = function () {
            // title
            $scope.show.title = $scope.show.prop == 'Tet' ? '电试日期' : '检修时间';

            // date
            $scope.show.data.showDate = new Date($scope.show.data.date);
            $scope.show.data.upDate = moment($scope.show.data.date).format('YYYY-MM-DD');

        };
        $scope.init();

        $scope.formatForm = function () {
            var data = {};

            data['status'] = $scope.show.data.showStatus ? '1' : '0';
            data['msgFlag'] = $scope.show.data.showMsgFlag ? '1' : '0';
            data['advancePeriod'] = $scope.show.data.advancePeriod || '';
            data['date'] = $scope.show.data.upDate || '';
            data['client_id'] = $scope.show.cid;
            data['prop'] = $scope.show.prop;

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSetting.edit(params,
                function (data) {
                    ToastUtils.openToast('info', data.message);
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

            Log.i('请求的参数是：' + JSON.stringify(params));

        };

        $scope.changeUpDate = function () {
            if ($scope.show.data.showDate) {
                $scope.show.data.upDate = moment($scope.show.data.showDate).format('YYYY-MM-DD');
            } else {
                $scope.show.data.upDate = ""
            }
        };

        // date picker
        $scope.togglePicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };

    }

    function setPCtrl($scope, params, Log, AlertSetting, HttpToast, ToastUtils) {
        $scope.show = params;

        $scope.formatForm = function () {
            var data = {};

            data['status'] = $scope.show.data.showStatus ? '1' : '0';
            data['msgFlag'] = $scope.show.data.showMsgFlag ? '1' : '0';
            data['warning'] = $scope.show.data.warning || '';
            data['error'] = $scope.show.data.error || '';
            data['client_id'] = $scope.show.cid;
            data['prop'] = $scope.show.prop;

            return data;
        };

        $scope.submit = function () {

            var params = $scope.formatForm();
            AlertSetting.edit(params,
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
