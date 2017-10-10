(function () {
    'use strict';

    angular.module('BlurAdmin.power.device')
        .controller('devicePageCtrl', devicePageCtrl)
        .controller('addDeviceCtrl', addDeviceCtrl)
        .controller('editDeviceCtrl', editDeviceCtrl)
        .controller('modalDelDeviceCtrl', modalDelDeviceCtrl);

    /** @ngInject */
    function devicePageCtrl($scope, PageTopCache, $state, ModalUtils, HttpToast, Keyword, KeywordCache,
                            Sidebar, SidebarCache, Device, ToastUtils, Log, ExportPrefix, $rootScope, $timeout, locals,
                            deviceTypeCache, treeCache) {

        PageTopCache.cache.state = $state.$current; // active

        $scope.show = {
            isLoading: true,
            maxSize: 15,    // 每页显示的数量
            displayedPages: 0,
            branchEqp: {},

            clientName: '变电站',  //变电站
            incominglineName: '总进线',    //总线
            branchName: '所处支线',    //支线
            deviceoperationstatusName: '运行状态',  //
            deviceType: '设备类型',  // 设备类型
            sidebarArr: [],    //变电站数组，默认从缓存里拿
            incominglingArr: [],  //总线数组
            branchArr: [],    //支线数组,
            deviceoperationstatusArr: [],   //设备运行状态
            devicetypeArr: [],   //设备类型
        };

        $scope.form = {
            name: '',   //设备名称
            type: '',   //设备类型key
            model: '',  //设备型号
            manufacturer: '',   //生产厂家
            client_id: "",  //变电站cid
            incomingline_id: "",    //总进线inid
            branch_id: "",  //所处支线bid
            operationstatus: ""   //运行状态key
        };

        $scope.clearForm = function () {
            // 1 初始化显示
            $scope.show.clientName = '变电站';
            $scope.show.incominglineName = '总进线';
            $scope.show.branchName = '所处支线';
            $scope.show.deviceoperationstatusName = '运行状态';
            $scope.show.deviceType = '设备类型';

            // 2.初始化form
            $scope.form = {
                name: '',   //设备名称
                type: '',   //设备类型key
                model: '',  //设备型号
                manufacturer: '',   //生产厂家
                client_id: "",  //变电站cid
                incomingline_id: "",    //总进线inid
                branch_id: "",  //所处支线bid
                operationstatus: ""   //运行状态key
            };

            // 3.初始化dropdown数据
            $scope.show.incominglingArr = [];
            $scope.show.branchArr = [];
        };

        $scope.formatDate = function (date) {
            if (date) {
                return moment(date).format('YYYY-MM-DD');
            }
        };

        // dropdown set 1
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            $scope.form.incomingline_id = '';   //和新增设备不同，需清空子集
            $scope.form.branch_id = '';
            // set
            $scope.show.clientName = obj.clientName;
            $scope.show.incominglingArr = obj.incominglineData;

            // clear
            $scope.show.incominglineName = '总进线';
            $scope.show.branchName = '所处支线';
            $scope.show.branchArr = [];
        };

        $scope.changeIncomingling = function (obj) {
            if ($scope.show.incominglineName == obj.incominglineName) {
                return;
            }

            $scope.form.incomingline_id = obj.incominglingId;
            $scope.form.branch_id = '';   //和新增设备不同，需清空子集
            // set
            $scope.show.incominglineName = obj.incominglineName;
            $scope.show.branchArr = obj.branchData;

            // clear
            $scope.show.branchName = '所处支线';
        };

        $scope.initFilterInfo = function () {

            var cid = locals.get('cid', '');
            if (cid) {
                for (var i = 0; i < $scope.show.sidebarArr.length; i++) {
                    var item = $scope.show.sidebarArr[i];
                    if (item.clientId == cid) {
                        $scope.changeClent(item);
                    }

                }
            }

            var inid = locals.get('inid', '');
            if (inid) {
                for (var j = 0; j < $scope.show.incominglingArr.length; j++) {
                    var inItem = $scope.show.incominglingArr[j];
                    if (inItem.incominglingId == inid) {
                        $scope.changeIncomingling(inItem);
                    }

                }
            }

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
                $scope.initFilterInfo();
            });

        };
        $scope.init();

        // smart table
        $scope.getData = function (tableState) {

            $scope.show.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || $scope.show.maxSize;  // Number of entries showed per page.

            var params = {
                start: start,
                number: number,
            };

            if ($scope.form.name) {
                params.name = $scope.form.name;
            }
            if ($scope.form.type) {
                params.type_id = $scope.form.type;
            }
            if ($scope.form.model) {
                params.model = $scope.form.model;
            }
            if ($scope.form.manufacturer) {
                params.manufacturer = $scope.form.manufacturer;
            }
            if ($scope.form.client_id) {
                params.client_id = $scope.form.client_id;
            }
            if ($scope.form.operationstatus) {
                params.status = $scope.form.operationstatus;
            }

            Device.query(params,
                function (obj) {
                    $scope.show.isLoading = false;
                    $scope.show.branchEqp = obj;
                    tableState.pagination.numberOfPages = obj.totalPage;
                    $scope.show.displayedPages = Math.ceil(parseFloat(obj.totalCount) / parseInt(obj.totalPage));
                    $scope.show.branchEqp.tableState = tableState;
                }, function (err) {
                    $scope.show.isLoading = false;
                    HttpToast.toast(err);
                });
        };

        $scope.refreshTable = function () {
            if (parseInt($scope.show.branchEqp.totalPage) <= 1 && $scope.show.branchEqp.tableState) {
                $scope.getData($scope.show.branchEqp.tableState);
            } else {
                angular
                    .element('#powerTablePagination')
                    .isolateScope()
                    .selectPage(1);
            }
        };

        $scope.searchDevice = function () {
            $scope.refreshTable();
        };

        // 新建设备
        $scope.addDevice = function () {
            ModalUtils.open('app/powers/device/widgets/createDeviceModal.html', 'lg',
                addDeviceCtrl, {},
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.clearForm(); // 新建，删除需要初始化表单状态
                        $scope.searchDevice();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        // 导出excel
        $scope.exportExcel = function () {
            var p = $scope.allPrpos();

            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            var URL = ExportPrefix.prefix + p;
            window.open(URL, "_blank", strWindowFeatures);
        };

        $scope.allPrpos = function () {
            var params = {};

            if ($scope.form.name) {
                params.name = $scope.form.name;
            }
            if ($scope.form.type) {
                params.type_id = $scope.form.type;
            }
            if ($scope.form.model) {
                params.model = $scope.form.model;
            }
            if ($scope.form.manufacturer) {
                params.manufacturer = $scope.form.manufacturer;
            }
            if ($scope.form.client_id) {
                params.client_id = $scope.form.client_id;
            }
            if ($scope.form.operationstatus) {
                params.status = $scope.form.operationstatus;
            }

            var names = "";
            for (var Key in params) {
                names += Key + "=" + params[Key] + "&";
            }

            return names ? '?' + names.substring(0, names.length - 1) : "";
        };

        // 修改设备
        $scope.setItem = function (did) {
            ModalUtils.open('app/powers/device/widgets/editDeviceModal.html', 'lg',
                editDeviceCtrl, {did: did},
                function (info) {
                    // 传值走这里
                    if (info) {
                        $scope.clearForm(); // 新建，删除需要初始化表单状态
                        $scope.searchDevice();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        // 删除设备
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

        // 打印
        $scope.print = function () {
            var p = $scope.allPrpos();

            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            var URL = ExportPrefix.prefixPrint + p;
            window.open(URL, "_blank", strWindowFeatures);
        };

        // dropdown set 2
        $scope.setBranch = function (obj) {
            $scope.show.branchName = obj.branchName;
            $scope.form.branch_id = obj.branchId;
        };

        $scope.setStatus = function (obj) {
            $scope.show.deviceoperationstatusName = obj.name;
            $scope.form.operationstatus = obj.id;
        };

        $scope.setDeviceType = function (obj) {
            $scope.show.deviceType = obj.name;
            $scope.form.type = obj.id;
        }

        $rootScope.$on('filterInfo', function (event, data) {
            if (!data) {
                return
            }
            if ($state.$current != 'device') {
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
            if (data.inid) {
                for (var j = 0; j < $scope.show.incominglingArr.length; j++) {
                    var inItem = $scope.show.incominglingArr[j];
                    if (inItem.incominglingId == data.inid) {
                        $scope.changeIncomingling(inItem);
                    }

                }
            }

            $timeout(function () {
                $scope.searchDevice();
            }, 500);

        });

    }

    function addDeviceCtrl($scope, Device, DeviceAdd, deviceTypeCache, deviceAttrHelper, treeCache,
                           HttpToast, ToastUtils, Log) {

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

            DeviceAdd.create(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.$close(data);
                },
                function (err) {
                    HttpToast.toast(err);
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

    function editDeviceCtrl($scope, Device, DeviceAdd, deviceTypeCache, deviceAttrHelper, treeCache,
                            HttpToast, ToastUtils, Log) {

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

            DeviceAdd.create(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.$close(data);
                },
                function (err) {
                    HttpToast.toast(err);
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
