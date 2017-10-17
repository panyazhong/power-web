(function () {
    'use strict';

    angular.module('BlurAdmin.power.branch')
        .controller('branchPageCtrl', branchPageCtrl)
        .controller('editDeviceCtrl', editDeviceCtrl)
        .controller('modalDelDeviceCtrl', modalDelDeviceCtrl);

    /** @ngInject */
    function branchPageCtrl($scope, $stateParams, Branch, HttpToast, Device, ToastUtils, BranchimgHelper,
                            PageTopCache, ModalUtils, locals, $rootScope, EventsCache, clientCache, Log, Line,
                            treeCache) {

        PageTopCache.cache.state = 'monitoring';

        $scope.show = {
            bid: '',
            branchAlarm: [],    // line 报警信息
            branchEqp: []       // line 设备列表
        };
        $scope.rowCollection = [];
        // line 基本信息
        $scope.line = {
            id: '',
            name: '',
            Ia: '',
            Ib: '',
            Ic: '',
            Ua: '',
            Ub: '',
            Uc: '',
            P: '',
            Q: '',
            PF: '',
            Pt1: ''
        };   //选中的popov数据
        $scope.filterKey = ['id', 'name'];

        $scope.queryList = function () {

            var p = {
                id: $scope.show.bid,
                device: 'device'
            };
            Line.query(p,
                function (data) {
                    $scope.show.branchEqp = data;
                    $scope.rowCollection = data;
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.setLineInfo = function (clientId) {

            locals.put('cid', clientId);    //update cid

            EventsCache.subscribeClient(clientId);  //订阅变电站信息

            var pm = treeCache.getTree();
            pm.then(function (data) {           //PageTop name显示

                data.map(function (t) {
                    if (t.id == clientId) {
                        var clientName = t.name;
                        var lineName = $scope.iterator(t.lines, $scope.show.bid).name;
                        PageTopCache.currentState.state = clientName + " / " + lineName; // contentTop 变电站name+支线name

                        $scope.line.name = lineName;

                        Log.i('line：\n' + JSON.stringify($scope.line));
                    }
                })

            });
        };

        $scope.init = function () {
            $scope.show.bid = $stateParams.bid || locals.get('bid', '');

            if (!$scope.show.bid) {
                ToastUtils.openToast('warning', '请先选择一个支线！');
                return;
            }

            $scope.queryList(); //获取当前line设备列表

            /**
             *
             * a.获取当前line的clientId
             * b.订阅clientId事件
             * c.获取当前line事件数据
             *
             */
            var pm = treeCache.getTree();
            pm.then(function (data) {
                var treeObj = treeCache.getTreeObj(data);

                for (var Key in treeObj) {
                    if (treeObj[Key]) {
                        if (treeObj[Key].indexOf($scope.show.bid) != -1) {

                            $scope.setLineInfo(Key);
                        }
                    }
                }
            });

        };
        $scope.init();

        $scope.formatDate = function (date) {
            if (date) {
                return moment(date).format('YYYY-MM-DD');
            }
        };

        /**
         * 编辑设备
         * @param did
         */
        $scope.setItem = function (did, state) {

            ModalUtils.open('app/powers/device/widgets/editDeviceModal.html', 'lg',
                editDeviceCtrl,
                {
                    did: did,
                    state: state
                },
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.queryList();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });

        };

        /**
         * 删除设备
         * @param did
         */
        $scope.delItem = function (did) {

            ModalUtils.openMsg('app/powers/modal/dangerDelDevice.html', '',
                modalDelDeviceCtrl, {},
                function (info) {
                    // 传值走这里
                    if (info) {
                        Device.delete({
                                did: did
                            },
                            function (data) {
                                ToastUtils.openToast('success', data.message);
                                $scope.queryList();
                            }, function (err) {
                                HttpToast.toast(err);
                            });
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });

        };

        $scope.iterator = function (treeNodes, choiceId) {
            if (!treeNodes || !treeNodes.length) return;

            var stack = [];

            for (var i = 0; i < treeNodes.length; i++) {
                stack.push(treeNodes[i]);
            }

            var item;

            while (stack.length) {
                item = stack.shift();

                if (item.id == choiceId) {

                    return item;
                }

                if (item.lines && item.lines.length) {
                    stack = item.lines.concat(stack);
                }
            }
        };

        /**
         * socket
         */
        var monitorListener = $rootScope.$on('monitor', function (event, data) {
            if (!data) return;
            if (!$scope.show.bid) return;
            var cid = locals.get('cid', '');
            if (cid != data.id) return;

            Log.i('rec-monitor : \n' + JSON.stringify(data));

            // line基本信息
            var lineInfo = $scope.iterator(data.lines, $scope.show.bid);
            if ($scope.show.bid != lineInfo.id) return;

            for (var Key in $scope.line) {
                if ($scope.filterKey.indexOf(Key) == -1) {
                    $scope.line[Key] = lineInfo[Key] || '';
                }
            }

            // line报警信息
            $scope.show.branchAlarm = lineInfo.alerts;

            // line异常图片
            $scope.lineSvg = {
                Iavg: lineInfo.Iavg,
                P: lineInfo.P,
                Q: lineInfo.Q,
                name: $scope.line.name
            };

            $scope.$digest();
        });

        $scope.$on('$destroy', function () {
            monitorListener();
            monitorListener = null;
        });
    }

    // 编辑设备ctrl，若修改在在台账修改
    function editDeviceCtrl($scope, Device, DeviceAdd, deviceTypeCache, deviceAttrHelper, treeCache,
                            HttpToast, ToastUtils, Log, params, ModalUtils) {

        $scope.did = params.did;
        $scope.flag = params.state;
        $scope.filterKey = ['id', 'resources', 'usingDate', 'electricTestDate', 'repairDate', 'attr'];

        $scope.queryAndSetAttr = function (id, attr) {
            if (!id) return;
            if (id == $scope.show.choiceAttrId) return;
            $scope.show.choiceAttrId = id;

            var p = {
                type: 'type',
                type_id: id,
                attr: 'attr'
            };
            Device.queryAttr(p,
                function (data) {
                    if (Array.isArray(data)) {
                        $scope.show.deviceAttrList = deviceAttrHelper.create(data);
                        Log.e('属性列表：\n' + JSON.stringify($scope.show.deviceAttrList));

                        if (attr) {
                            $scope.show.deviceAttrList.map(function (t) {
                                t.val = attr[t.id];
                            });
                        }
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.queryDeviceDetail = function () {
            var p = {
                did: $scope.did
            };
            Device.query(p,
                function (data) {
                    Log.e(JSON.stringify(data));

                    // 1.基本
                    for (var Key in data) {
                        if ($scope.filterKey.indexOf(Key) == -1) {
                            //说明不需要过滤
                            $scope.form.base[Key] = data[Key];
                        }
                    }

                    // 设备状态
                    for (var i = 0; i < $scope.show.deviceoperationstatusArr.length; i++) {
                        var obj = $scope.show.deviceoperationstatusArr[i];
                        if (obj.id == data.status) {
                            $scope.show.status = obj.name;
                        }
                    }
                    // 设备类型
                    for (var i = 0; i < $scope.show.devicetypeArr.length; i++) {
                        var subObj = $scope.show.devicetypeArr[i];
                        if (subObj.id == data.type_id) {
                            $scope.show.deviceType = subObj.name;
                        }
                    }
                    // 变电站，节点
                    $scope.show.clientName = data.resources[0].name;
                    var choiceLine = data.resources[data.resources.length - 1];
                    $scope.show.choiceLine.push(choiceLine);
                    var treeNodes = [];
                    choiceLine['lines'] = [];
                    treeNodes.push(choiceLine);
                    $scope.show.lineNodeList.push(treeNodes);
                    // 日期
                    $scope.show.usingDate = new Date(data.usingDate);
                    $scope.show.electricTestDate = new Date(data.electricTestDate);
                    $scope.show.repairDate = new Date(data.repairDate);


                    // 2.详细，需要先获取设备属性，获取到后绑定数据
                    $scope.queryAndSetAttr(data.type_id, data.attr);

                },
                function (err) {
                    HttpToast.toast(err);
                })
        };

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
            lastet: {
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
            lastrepair: {
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

        $scope.show = {
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
            pageTabState: 'base',   // 默认state
            deviceType: '',          // 设备类型-name

            devicetypeArr: [],
            deviceoperationstatusArr: [],
            clientName: '',  //变电站
            sidebarArr: [],    //变电站数组

            status: '',   //运行状态name

            usingDate: '', //投运日期
            electricTestDate: '',    //上次电试日期
            repairDate: '',    //上次维修日期

            choiceAttrId: '',       //选中的设备属性id
            deviceAttrList: [],     //设备属性列表
            lineNodeList: [],    //节点集合完整数据
            choiceLine: []   //选择的节点的数据
        };
        $scope.form = {
            base: {
                name: '',   //名称
                type_id: '',   //设备类型
                category: '',//category
                code: '',   //设备代码
                model: '',  //设备型号
                position: '',   //安装位置

                serialNum: '',   //出厂编号
                manufacturer: '',   //生产厂家
                manufacturerContact: '',    //厂家联系人
                manufacturerTel: '',   //厂家联系电话
                usingDate: '', //投运日期
                electricTestDate: '',    //上次电试日期
                repairDate: '',    //上次维修日期

                voltage: '',  //额定电压
                current: '',  //额定电流
                frequency: '',    //额定频率
                capacity: '', //额定电容
                status: '', //运行状态：1-运行，2-停役

                line_id: '', //所属节点
            },
        };

        $scope.formatForm = function () {
            // 基本信息
            var params = $scope.form.base;

            // 详细信息
            params["attr"] = {};
            for (var i = 0; i < $scope.show.deviceAttrList.length; i++) {
                var item = $scope.show.deviceAttrList[i];
                if (item.val) {
                    params["attr"][item.id] = item.val;
                }
            }

            return params;
        };

        $scope.checkForm = function () {

            // a.日期
            $scope.form.base.usingDate = '';
            $scope.form.base.electricTestDate = '';
            $scope.form.base.repairDate = '';
            if ($scope.show.usingDate) {
                $scope.form.base.usingDate = moment($scope.show.usingDate).unix();
            }
            if ($scope.show.electricTestDate) {
                $scope.form.base.electricTestDate = moment($scope.show.electricTestDate).unix();
            }
            if ($scope.show.repairDate) {
                $scope.form.base.repairDate = moment($scope.show.repairDate).unix();
            }

            // b.节点
            var choiceLineId = '';
            for (var i = 0; i < $scope.show.choiceLine.length; i++) {
                var obj = $scope.show.choiceLine[i];
                if (obj.id) {
                    // 有选中的节点，只需要最后一个节点
                    choiceLineId = obj.id;
                }
            }
            if (!choiceLineId) {
                // 说明没有选中的节点id
                ToastUtils.openToast('warning', '请选择设备所属支线！');
                return false;
            }
            $scope.form.base.line_id = choiceLineId;

            // 基本信息
            for (var Key in $scope.form.base) {
                if (!$scope.form.base[Key]) {
                    ToastUtils.openToast('warning', '请完善基本信息！');
                    return false;
                }
            }

            // 详细信息
            for (var i = 0; i < $scope.show.deviceAttrList.length; i++) {
                var item = $scope.show.deviceAttrList[i];
                if (!item.val) {
                    // 说明有val为空
                    ToastUtils.openToast('warning', '请完善详细信息！');
                    return false;
                }
            }

            return true;
        };

        $scope.confirm = function () {
            if (!$scope.checkForm()) return;

            var params = $scope.formatForm();
            Log.i('query params : \n' + JSON.stringify(params));
            // dif，state等于0时说明是修改设备，需要id，state等于1时说明是复制，不需要id
            if ($scope.flag == 0) {
                params["id"] = $scope.did;
            }

            ModalUtils.openMsg('app/powers/modal/infoEditDevice.html', '',
                modalDelDeviceCtrl, {},
                function (info) {
                    // 传值走这里
                    if (info) {
                        DeviceAdd.update(params,
                            function (data) {
                                ToastUtils.openToast('success', data.message);
                                $scope.$close(data);
                            },
                            function (err) {
                                HttpToast.toast(err);
                            });
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        $scope.init = function () {

            // 设备状态
            $scope.show.deviceoperationstatusArr = [
                {
                    id: 1,
                    name: '运行'
                },
                {
                    id: 2,
                    name: '停役'
                }
            ];
            // 设备类型
            var pmDt = deviceTypeCache.getDeviceType();
            pmDt.then(function (data) {
                $scope.show.devicetypeArr = data;
            });

            var pm = treeCache.getTree();
            pm.then(function (data) {
                $scope.show.sidebarArr = treeCache.createClientArr(data);
                // dif
                $scope.queryDeviceDetail();
            });

        };
        $scope.init();

        /**
         * 页面状态相关
         */
        $scope.activePageState = function (state) {
            $scope.show.pageTabState = state;
        };

        $scope.checkPageState = function (state) {
            if (state == 'base') return true;   //base显示

            if ($scope.show.deviceAttrList.length > 0) return true;     //设备属性列表长度大于0 按钮显示才有意义

            return false;
        };

        /**
         * 判断是否有依赖
         */
        $scope.checkDepend = function (item) {
            if (!item.dependID) return true;

            if (item.dependID) {
                // 说明有依赖
                for (var i = 0; i < $scope.show.deviceAttrList.length; i++) {
                    var obj = $scope.show.deviceAttrList[i];
                    if (item.dependID == obj.id) {
                        if (item.dependOption.indexOf(obj.val) == -1) {
                            //不包含
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            }
        };

        /**
         * 节点相关
         */
        $scope.setTreeNodes = function (treeNodes) {
            if (!treeNodes || !treeNodes.length) return;

            // 设置节点完整数据 和 选择的节点数据
            $scope.show.lineNodeList.push(treeNodes);
            $scope.show.choiceLine.push({
                id: '',
                name: ''
            });
        };

        $scope.changeNode = function (pos, item) {
            if (item.id == $scope.show.choiceLine[pos].id) return;

            // a.设置当前点击的form数据
            $scope.show.choiceLine[pos].id = item.id;
            $scope.show.choiceLine[pos].name = item.name;

            // b.pos小于数组长度时，删除pos以后的数据
            if (pos < $scope.show.lineNodeList.length - 1) {

                for (var i = $scope.show.lineNodeList.length - 1; i >= 0; i--) {
                    if (i > pos) {
                        $scope.show.lineNodeList.splice(i, 1);
                        $scope.show.choiceLine.splice(i, 1);
                    }
                }
            }

            // c.设置子树
            $scope.setTreeNodes(item.lines);
        };

        // dropdown set
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) return;
            $scope.show.clientName = obj.clientName;

            // clear
            $scope.form.base.line_id = '';
            $scope.show.lineNodeList = [];
            $scope.show.choiceLine = [];

            // set
            var pm = treeCache.getTree();
            pm.then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.id == obj.clientId) {

                        $scope.setTreeNodes(item.lines);

                        return
                    }
                }
            });

        };

        /**
         * 获取设备属性列表
         */
        $scope.queryAttr = function (id) {
            if (!id) return;
            if (id == $scope.show.choiceAttrId) return;
            $scope.show.choiceAttrId = id;

            var p = {
                type: 'type',
                type_id: id,
                attr: 'attr'
            };
            Device.queryAttr(p,
                function (data) {
                    if (Array.isArray(data)) {
                        $scope.show.deviceAttrList = deviceAttrHelper.create(data);
                        Log.e('属性列表：\n' + JSON.stringify($scope.show.deviceAttrList));
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.setDeviceType = function (obj) {
            $scope.show.deviceType = obj.name;
            $scope.form.base.type_id = obj.id;
            //query
            $scope.queryAttr(obj.id);
        };

        $scope.setStatus = function (obj) {
            $scope.show.status = obj.name;
            $scope.form.base.status = obj.id;
        };

        // date
        $scope.toggleDatepicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };
        $scope.togglelastetDatepicker = function () {
            $scope.data.lastet.isOpen = !$scope.data.lastet.isOpen;
        };
        $scope.togglelastrepairDatepicker = function () {
            $scope.data.lastrepair.isOpen = !$scope.data.lastrepair.isOpen;
        };

    }

    function modalDelDeviceCtrl($scope) {

        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };

    }

})();