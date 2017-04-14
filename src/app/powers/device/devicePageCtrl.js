/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.device')
        .controller('devicePageCtrl', devicePageCtrl)
        .controller('addDeviceCtrl', addDeviceCtrl)
        .controller('editDeviceCtrl', editDeviceCtrl);

    /** @ngInject */
    function devicePageCtrl($scope, PageTopCache, $state, ModalUtils, HttpToast, Keyword, KeywordCache,
                            Sidebar, SidebarCache, Device, ToastUtils, Log, ExportPrefix) {

        PageTopCache.cache.state = $state.$current; // active

        $scope.show = {
            isLoading: true,
            maxSize: 10,    // 每页显示的数量
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

        $scope.init = function () {

            if (KeywordCache.isEmpty()) {
                Keyword.query({},
                    function (data) {
                        KeywordCache.create(data);
                        $scope.show.deviceoperationstatusArr = KeywordCache.getDevice_operationstatus();
                        $scope.show.devicetypeArr = KeywordCache.getDevice_type();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
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

        };
        $scope.init();

        $scope.getData = function (tableState) {

            $scope.show.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || $scope.show.maxSize;  // Number of entries showed per page.

            var params = {
                start: start,
                number: number,
            };

            if (!$.isEmptyObject($scope.form.name)) {
                params.name = $scope.form.name;
            }
            if (!$.isEmptyObject($scope.form.type)) {
                params.type = $scope.form.type;
            }
            if (!$.isEmptyObject($scope.form.model)) {
                params.model = $scope.form.model;
            }
            if (!$.isEmptyObject($scope.form.manufacturer)) {
                params.manufacturer = $scope.form.manufacturer;
            }
            if (!$.isEmptyObject($scope.form.client_id)) {
                params.client_id = $scope.form.client_id;
            }
            if (!$.isEmptyObject($scope.form.incomingline_id)) {
                params.incomingline_id = $scope.form.incomingline_id;
            }
            if (!$.isEmptyObject($scope.form.branch_id)) {
                params.branch_id = $scope.form.branch_id;
            }
            if (!$.isEmptyObject($scope.form.operationstatus)) {
                params.operationstatus = $scope.form.operationstatus;
            }

            Device.query(params,
                function (obj) {
                    $scope.show.isLoading = false;
                    $scope.show.branchEqp = obj;
                    tableState.pagination.numberOfPages = obj.total_page;
                    $scope.show.displayedPages = Math.ceil(parseFloat(obj.total_count) / parseInt(obj.total_page));
                    $scope.show.branchEqp.tableState = tableState;
                }, function (err) {
                    $scope.show.isLoading = false;
                    HttpToast.toast(err);
                });
        };

        $scope.refreshTable = function () {
            if (parseInt($scope.show.branchEqp.total_page) <= 1 && $scope.show.branchEqp.tableState) {
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

            var params = {};

            if (!$.isEmptyObject($scope.form.name)) {
                params.name = $scope.form.name;
            }
            if (!$.isEmptyObject($scope.form.type)) {
                params.type = $scope.form.type;
            }
            if (!$.isEmptyObject($scope.form.model)) {
                params.model = $scope.form.model;
            }
            if (!$.isEmptyObject($scope.form.manufacturer)) {
                params.manufacturer = $scope.form.manufacturer;
            }
            if (!$.isEmptyObject($scope.form.client_id)) {
                params.client_id = $scope.form.client_id;
            }
            if (!$.isEmptyObject($scope.form.incomingline_id)) {
                params.incomingline_id = $scope.form.incomingline_id;
            }
            if (!$.isEmptyObject($scope.form.branch_id)) {
                params.branch_id = $scope.form.branch_id;
            }
            if (!$.isEmptyObject($scope.form.operationstatus)) {
                params.operationstatus = $scope.form.operationstatus;
            }

            var p = $scope.allPrpos(params);

            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            var URL = ExportPrefix.prefix + p;
            window.open(URL, "_blank", strWindowFeatures);
        };

        $scope.allPrpos = function (obj) {
            var names = "";
            for (var name in obj) {
                names += name + "=" + obj[name] + "&";
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
        };

        // dropdown set
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            // set
            $scope.show.clientName = obj.clientName;
            $scope.show.incominglingArr = obj.incominglineData;

            // clear
            $scope.show.incominglineName = '';
            $scope.show.branchName = '';
            $scope.show.branchArr = [];
        };

        $scope.changeIncomingling = function (obj) {
            if ($scope.show.incominglineName == obj.incominglineName) {
                return;
            }

            $scope.form.incomingline_id = obj.incominglingId;
            // set
            $scope.show.incominglineName = obj.incominglineName;
            $scope.show.branchArr = obj.branchData;

            // clear
            $scope.show.branchName = '';
        };

        $scope.setBranch = function (obj) {

            $scope.form.branch_id = obj.branchId;

            $scope.show.branchName = obj.branchName;
        };

        $scope.setStatus = function (obj) {
            $scope.show.deviceoperationstatusName = obj.name;
            $scope.form.operationstatus = obj.id;
        }

        $scope.setDeviceType = function (obj) {
            $scope.show.deviceType = obj.name;
            $scope.form.type = obj.id;
        }

    }

    function addDeviceCtrl($scope, KeywordCache, SidebarCache, ToastUtils, Device, $cookies, HttpToast,
                           DeviceHelper, Log, Sidebar, Keyword) {

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
            deviceType: '',          // 默认是否显示详细信息

            devicetypeArr: [],
            deviceoperationstatusArr: [],
            devicephasenumArr: [],
            deviceinsulationclassArr: [],
            deviceuseconditionArr: [],
            clientName: '',  //变电站
            incominglineName: '',    //总线
            branchName: '',    //支线
            sidebarArr: [],    //变电站数组
            incominglingArr: [],  //总线数组
            branchArr: [],    //支线数组,

            deviceoperationstatus: '',   //运行状态name
            phasenum: '',    //相数name
            usecondition: '',    //使用条件KEY
            insulationclass: '',    //绝缘耐热等级KEY

        };
        $scope.form = {
            base: {
                name: '',   //名称
                type: '',   //设备类型
                category: '',//category
                code: '',   //设备代码
                model: '',  //设备型号
                branch_id: '',//支线id
                position: '',   //安装位置
                manufacturer: '',   //生产厂家
                comminssioningdate: '', //投运日期
                lastet_date: '',    //上次电试日期
                lastrepair_date: '',    //上次维修日期
                manufacturercontact: '',    //厂家联系人
                manufacturer_tel: '',   //厂家联系电话
                rated_voltage: '',  //额定电压
                rated_current: '',  //额定电流
                rated_frequency: '',    //额定频率
                rated_capacity: '', //额定电容
                operationstatus: '' //运行状态(0,1)
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

        $scope.init = function () {

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

        };
        $scope.init();

        $scope.changeState = function (state) {
            $scope.show.pageTabState = state;
        };

        $scope.checkState = function (state) {
            if (state == 'detail') {
                if ($scope.show.deviceType == '变压器') {
                    return true;
                }
            } else {
                return true
            }
        };

        $scope.confirm = function () {

            // 基本信息
            for (var Key in $scope.form.base) {
                // console.log($scope.form.base[Key]);
                if ($scope.form.base[Key] == '') {
                    ToastUtils.openToast('warning', '请完善所有基本信息！');
                    return;
                }
            }

            // 变电站信息
            if ($scope.show.deviceType == '变压器') {
                for (var Key in $scope.form.detail) {
                    // console.log($scope.form.detail[Key]);
                    if ($scope.form.detail[Key] == '') {
                        ToastUtils.openToast('warning', '请完善所有详细信息！');
                        return;
                    }
                }
            }

            // change格式
            if ($scope.form.base.comminssioningdate) {
                $scope.form.base.comminssioningdate = moment($scope.form.base.comminssioningdate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.form.base.lastet_date) {
                $scope.form.base.lastet_date = moment($scope.form.base.lastet_date).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.form.base.lastrepair_date) {
                $scope.form.base.lastrepair_date = moment($scope.form.base.lastrepair_date).format('YYYY-MM-DD HH:mm:ss');
            }

            var params = $scope.form.base;
            params.uid = $cookies.getObject('uScope').uid;
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

        // dropdown set
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            // set
            $scope.show.clientName = obj.clientName;
            $scope.show.incominglingArr = obj.incominglineData;
            $scope.form.base.branch_id = '';

            // clear
            $scope.show.incominglineName = '';
            $scope.show.branchName = '';
            $scope.show.branchArr = [];
        };

        $scope.changeIncomingling = function (obj) {
            if ($scope.show.incominglineName == obj.incominglineName) {
                return;
            }

            // set
            $scope.show.incominglineName = obj.incominglineName;
            $scope.show.branchArr = obj.branchData;
            $scope.form.base.branch_id = '';

            // clear
            $scope.show.branchName = '';
        };

        $scope.setBranch = function (obj) {
            $scope.show.branchName = obj.branchName;
            $scope.form.base.branch_id = obj.branchId;
        };

        $scope.setDeviceType = function (obj) {
            $scope.show.deviceType = obj.name;
            $scope.form.base.type = obj.id;
        };

        $scope.setStatus = function (obj) {
            $scope.show.deviceoperationstatus = obj.name;
            $scope.form.base.operationstatus = obj.id;
        };

        $scope.setDevicephasenum = function (obj) {
            $scope.show.phasenum = obj.name;
            $scope.form.detail.phasenum = obj.id;
        };

        $scope.setUsecondition = function (obj) {
            $scope.show.usecondition = obj.name;
            $scope.form.detail.usecondition = obj.id;
        };

        $scope.setInsulationclass = function (obj) {
            $scope.show.insulationclass = obj.name;
            $scope.form.detail.insulationclass = obj.id;
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

    function editDeviceCtrl($scope, KeywordCache, SidebarCache, ToastUtils, Device, $cookies,
                            HttpToast, DeviceHelper, params, DeviceEdit, Log, Sidebar, Keyword) {

        $scope.did = params.did;

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
            deviceType: '',          // 默认是否显示详细信息

            devicetypeArr: [],
            deviceoperationstatusArr: [],
            devicephasenumArr: [],
            deviceinsulationclassArr: [],
            deviceuseconditionArr: [],
            clientName: '',  //变电站
            incominglineName: '',    //总线
            branchName: '',    //支线
            sidebarArr: [],    //变电站数组
            incominglingArr: [],  //总线数组
            branchArr: [],    //支线数组,

            deviceoperationstatus: '',   //运行状态name
            phasenum: '',    //相数name
            usecondition: '',    //使用条件KEY
            insulationclass: '',    //绝缘耐热等级KEY

        };
        $scope.form = {
            base: {
                name: '',   //名称
                type: '',   //设备类型
                category: '',//category
                code: '',   //设备代码
                model: '',  //设备型号
                branch_id: '',//支线id
                position: '',   //安装位置
                manufacturer: '',   //生产厂家
                comminssioningdate: '', //投运日期
                lastet_date: '',    //上次电试日期
                lastrepair_date: '',    //上次维修日期
                manufacturercontact: '',    //厂家联系人
                manufacturer_tel: '',   //厂家联系电话
                rated_voltage: '',  //额定电压
                rated_current: '',  //额定电流
                rated_frequency: '',    //额定频率
                rated_capacity: '', //额定电容
                operationstatus: '' //运行状态(0,1)
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

        $scope.queryDeviceDetail = function () {
            Device.query({
                    did: $scope.did
                },
                function (data) {

                    // 1.赋值
                    $scope.form.base.name = data.name;
                    $scope.form.base.type = data.type.id;
                    $scope.show.deviceType = data.type.name;
                    $scope.form.base.category = data.category;
                    $scope.form.base.code = data.code;
                    $scope.form.base.model = data.model;
                    $scope.form.base.branch_id = data.branch.bid;
                    $scope.show.branchName = data.branch.name;
                    // 变压器
                    $scope.show.clientName = data.client.name;
                    $scope.show.incominglineName = data.incomingline.name;
                    // 设置总进线，支线数据
                    SidebarCache.getData().sidebar.map(function (item) {

                        if (item.clientId == data.client.cid) {
                            $scope.show.incominglingArr = item.incominglineData;
                        }

                    });
                    $scope.show.incominglingArr.map(function (item) {

                        if (item.incominglingId == data.incomingline.inid) {
                            $scope.show.branchArr = item.branchData;
                        }

                    });

                    $scope.form.base.position = data.position;
                    $scope.form.base.manufacturer = data.manufacturer;
                    $scope.form.base.comminssioningdate = new Date(data.comminssioningdate);
                    $scope.form.base.lastet_date = new Date(data.lastet_date);
                    $scope.form.base.lastrepair_date = new Date(data.lastrepair_date);
                    $scope.form.base.manufacturercontact = data.manufacturercontact;

                    $scope.form.base.manufacturer_tel = data.manufacturer_tel;
                    $scope.form.base.rated_voltage = data.rated_voltage;
                    $scope.form.base.rated_current = data.rated_current;
                    $scope.form.base.rated_frequency = data.rated_frequency;
                    $scope.form.base.rated_capacity = data.rated_capacity;
                    $scope.form.base.operationstatus = data.operationstatus.id;
                    $scope.show.deviceoperationstatus = data.operationstatus.name;

                    // 2.判断类型   - 详细信息
                    if (data.product_code) {
                        $scope.show.deviceType = '变压器';

                        $scope.form.detail.phasenum = data.phasenum.id;
                        $scope.show.phasenum = data.phasenum.name;
                        $scope.form.detail.product_code = data.product_code;
                        $scope.form.detail.standard_code = data.standard_code;
                        $scope.form.detail.insulationlevel = data.insulationlevel;
                        $scope.form.detail.usecondition = data.usecondition.id;
                        $scope.show.usecondition = data.usecondition.name;
                        $scope.form.detail.insulationclass = data.insulationclass.id;
                        $scope.show.insulationclass = data.insulationclass.name;

                        $scope.form.detail.tempriselimit = data.tempriselimit;
                        $scope.form.detail.totalweight = parseFloat(data.totalweight);
                        $scope.form.detail.connectionsymbol = data.connectionsymbol;
                        $scope.form.detail.coolingmode = data.coolingmode;
                        $scope.form.detail.current_noload = parseFloat(data.current_noload);
                        $scope.form.detail.loss_noload = parseFloat(data.loss_noload);

                        $scope.form.detail.shortcircuit_impedance = parseFloat(data.shortcircuit_impedance);
                        $scope.form.detail.tapgear = data.tapgear;
                    }

                    // 3.提交

                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.init = function () {

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

                        $scope.queryDeviceDetail()
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
                $scope.queryDeviceDetail();
            }

        };
        $scope.init();

        $scope.changeState = function (state) {
            $scope.show.pageTabState = state;
        };

        $scope.checkState = function (state) {
            if (state == 'detail') {
                if ($scope.show.deviceType == '变压器') {
                    return true;
                }
            } else {
                return true
            }
        };

        $scope.confirm = function () {

            // 基本信息
            for (var Key in $scope.form.base) {
                // console.log($scope.form.base[Key]);
                if ($scope.form.base[Key] == '') {
                    ToastUtils.openToast('warning', '请完善所有基本信息！');
                    return;
                }
            }

            // 变电站信息
            if ($scope.show.deviceType == '变压器') {
                for (var Key in $scope.form.detail) {
                    // console.log($scope.form.detail[Key]);
                    if ($scope.form.detail[Key] == '') {
                        ToastUtils.openToast('warning', '请完善所有详细信息！');
                        return;
                    }
                }
            }

            // change格式
            if ($scope.form.base.comminssioningdate) {
                $scope.form.base.comminssioningdate = moment($scope.form.base.comminssioningdate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.form.base.lastet_date) {
                $scope.form.base.lastet_date = moment($scope.form.base.lastet_date).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.form.base.lastrepair_date) {
                $scope.form.base.lastrepair_date = moment($scope.form.base.lastrepair_date).format('YYYY-MM-DD HH:mm:ss');
            }

            var params = $scope.form.base;
            params.uid = $cookies.getObject('uScope').uid;

            params.did = $scope.did;    // 修改比新建多了did参数

            if ($scope.show.deviceType == '变压器') {
                params = DeviceHelper.setDetail(params, $scope.form.detail);
            }

            DeviceEdit.update(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.$close(data);
                }, function (err) {
                    console.log("err: " + JSON.stringify(err));

                    HttpToast.toast(err);
                });

        };

        // dropdown set
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            // set
            $scope.show.clientName = obj.clientName;
            $scope.show.incominglingArr = obj.incominglineData;
            $scope.form.base.branch_id = '';

            // clear
            $scope.show.incominglineName = '';
            $scope.show.branchName = '';
            $scope.show.branchArr = [];
        };

        $scope.changeIncomingling = function (obj) {
            if ($scope.show.incominglineName == obj.incominglineName) {
                return;
            }

            // set
            $scope.show.incominglineName = obj.incominglineName;
            $scope.show.branchArr = obj.branchData;
            $scope.form.base.branch_id = '';

            // clear
            $scope.show.branchName = '';
        };

        $scope.setBranch = function (obj) {
            $scope.show.branchName = obj.branchName;
            $scope.form.base.branch_id = obj.branchId;
        };

        $scope.setDeviceType = function (obj) {
            $scope.show.deviceType = obj.name;
            $scope.form.base.type = obj.id;
        };

        $scope.setStatus = function (obj) {
            $scope.show.deviceoperationstatus = obj.name;
            $scope.form.base.operationstatus = obj.id;
        };

        $scope.setDevicephasenum = function (obj) {
            $scope.show.phasenum = obj.name;
            $scope.form.detail.phasenum = obj.id;
        };

        $scope.setUsecondition = function (obj) {
            $scope.show.usecondition = obj.name;
            $scope.form.detail.usecondition = obj.id;
        };

        $scope.setInsulationclass = function (obj) {
            $scope.show.insulationclass = obj.name;
            $scope.form.detail.insulationclass = obj.id;
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

})();
