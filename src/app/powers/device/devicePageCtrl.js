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

    function addDeviceCtrl($scope, KeywordCache, SidebarCache, ToastUtils, Device, locals, HttpToast,
                           DeviceHelper, Log, Sidebar, Keyword, deviceTypeCache, treeCache) {

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
            // devicephasenumArr: [],
            // deviceinsulationclassArr: [],
            // deviceuseconditionArr: [],
            clientName: '',  //变电站
            // incominglineName: '',    //总线
            // branchName: '',    //支线
            sidebarArr: [],    //变电站数组
            // incominglingArr: [],  //总线数组
            // branchArr: [],    //支线数组,

            status: '',   //运行状态name
            // phasenum: '',    //相数name
            // usecondition: '',    //使用条件KEY
            // insulationclass: '',    //绝缘耐热等级KEY

            usingDate: '', //投运日期
            electricTestDate: '',    //上次电试日期
            repairDate: '',    //上次维修日期

            choiceAttrId: '',       //选中的设备属性id
            deviceAttrList: [],     //设备属性列表
            lineNodeList: []    //节点集合完整数据
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
                status: '' //运行状态：1-运行，2-停役
            },
            detail: {
                phasenum: '',   //相数KEY
                product_code: '',   //产品代号
                standard_code: '',  //标准代号
                insulationlevel: '',    //绝缘水平
                usecondition: '',   //使用条件KEY
                insulationclass: '',    //绝缘耐热等级KEY

                tempriselimit: '',  //温升限值
                totalweight: '',    //总重kg(double)
                connectionsymbol: '',   //联结组标号
                coolingmode: '',    //冷却方式
                current_noload: '', //空载电流%(double)
                loss_noload: '',    //空载损耗kW(double)

                shortcircuit_impedance: '', //短路阻抗%(double)
                tapgear: '' //所在分接档位
            }
        };

        $scope.confirm = function () {

            // change格式
            $scope.form.base.usingDate = '';
            $scope.form.base.electricTestDate = '';
            $scope.form.base.repairDate = '';
            if ($scope.show.usingDate) {
                $scope.form.base.usingDate = moment($scope.show.usingDate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.electricTestDate) {
                $scope.form.base.electricTestDate = moment($scope.show.electricTestDate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.repairDate) {
                $scope.form.base.repairDate = moment($scope.show.repairDate).format('YYYY-MM-DD HH:mm:ss');
            }

            // 基本信息
            for (var Key in $scope.form.base) {
                // Log.i($scope.form.base[Key]);
                if (!$scope.form.base[Key]) {
                    ToastUtils.openToast('warning', '请完善所有基本信息！');
                    return;
                }
            }

            // 变电站信息
            if ($scope.show.deviceType == '变压器') {
                for (var Key in $scope.form.detail) {
                    // Log.i($scope.form.detail[Key]);
                    if (!$scope.form.detail[Key]) {
                        ToastUtils.openToast('warning', '请完善所有详细信息！');
                        return;
                    }
                }
            }

            var params = $scope.form.base;
            params.uid = locals.getObject('user').uid;
            if ($scope.show.deviceType == '变压器') {
                params = DeviceHelper.setDetail(params, $scope.form.detail);
            }

            Device.create(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.$close(data);
                }, function (err) {
                    HttpToast.toast(err);
                });

        };

        $scope.init = function () {

            /*
            if (KeywordCache.isEmpty()) {
                Keyword.query({},
                    function (data) {
                        KeywordCache.create(data);
                        $scope.show.devicetypeArr = KeywordCache.getDevice_type();
                        $scope.show.deviceoperationstatusArr = KeywordCache.getDevice_operationstatus();
                        $scope.show.devicephasenumArr = KeywordCache.getDevice_phasenum();
                        $scope.show.deviceinsulationclassArr = KeywordCache.getDevice_insulationclass();
                        $scope.show.deviceuseconditionArr = KeywordCache.getDevice_usecondition();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.show.devicetypeArr = KeywordCache.getDevice_type();
                $scope.show.deviceoperationstatusArr = KeywordCache.getDevice_operationstatus();
                $scope.show.devicephasenumArr = KeywordCache.getDevice_phasenum();
                $scope.show.deviceinsulationclassArr = KeywordCache.getDevice_insulationclass();
                $scope.show.deviceuseconditionArr = KeywordCache.getDevice_usecondition();
            }

            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.show.sidebarArr = data.sidebar;
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
            }
            */

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

        // dropdown set
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) return;

            // set
            $scope.show.clientName = obj.clientName;
            /*
            $scope.show.incominglingArr = obj.incominglineData;
            $scope.form.base.branch_id = '';
            */

            // clear
            /*
            $scope.show.incominglineName = '';
            $scope.show.branchName = '';
            $scope.show.branchArr = [];
            */

            // clear
            $scope.show.lineNodeList = [];

            // set
            var pm = treeCache.getTree();
            pm.then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.id == obj.clientId) {
                        $scope.show.lineNodeList = item.lines;
                        Log.e(JSON.stringify($scope.show.lineNodeList));
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
                        $scope.show.deviceAttrList = data;
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

    function editDeviceCtrl($scope, params) {

        $scope.did = params.did;

    }

    function modalDelDeviceCtrl($scope) {

        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };

    }

})();
