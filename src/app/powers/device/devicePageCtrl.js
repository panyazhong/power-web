/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.device')
        .controller('devicePageCtrl', devicePageCtrl)
        .controller('addDeviceCtrl', addDeviceCtrl);

    /** @ngInject */
    function devicePageCtrl($scope, PageTopCache, $state, Log, $timeout, ModalUtils, HttpToast, Keyword, KeywordCache,
                            Sidebar, SidebarCache, Device, ToastUtils) {

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
            sidebarArr: [],    //变电站数组
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
            PageTopCache.cache.state = $state.$current;

            if (KeywordCache.isEmpty()) {
                Keyword.query({},
                    function (data) {
                        if (data.data) {
                            KeywordCache.create(data.data);

                            $scope.show.deviceoperationstatusArr = KeywordCache.getDevice_operationstatus();
                            $scope.show.devicetypeArr = KeywordCache.getDevice_type();
                        }
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            }
            if (SidebarCache.isEmpty()) {
                Sidebar.query({},
                    function (data) {
                        if (data.data) {
                            SidebarCache.create(data.data);
                            $scope.show.sidebarArr = data.data.sidebar;
                        }
                    }, function (err) {
                        HttpToast.toast(err);
                    });
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
                function (data) {
                    console.log("成功了");

                    $scope.show.isLoading = false;
                    if (data.data) {
                        var obj = data.data;
                        $scope.show.branchEqp = obj;
                        tableState.pagination.numberOfPages = obj.total_page;
                        $scope.show.displayedPages = Math.ceil(parseFloat(obj.total_count) / parseInt(obj.total_page));
                        $scope.show.branchEqp.tableState = tableState;
                    }
                }, function (err) {
                    console.log("失败了");

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

        $scope.addDevice = function () {
            ModalUtils.open('app/powers/device/widgets/createDeviceModal.html', 'lg',
                addDeviceCtrl, 'deviceDiv', {},
                function (info) {
                    // 传值走这里
                    Log.i('接收到传递的值：' + info);
                    if (info) {
                        $scope.searchDevice();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        $scope.exportExcel = function () {
            alert('exportExcel...');
        };

        $scope.setItem = function (did) {

            alert("设置：" + did);

        };

        $scope.delItem = function (did) {

            Device.delete({
                did: did
            }, function (data) {
                if (data.data) {
                    ToastUtils.openToast('success', data.data);
                    $scope.searchDevice();
                } else {
                    ToastUtils.openToast('info', '很抱歉，无法从服务器获取数据。');
                }
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

    function addDeviceCtrl($scope, KeywordCache, Log, SidebarCache, ToastUtils, Device, $cookies, HttpToast, DeviceHelper) {

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

            devicetypeArr: KeywordCache.getDevice_type(),
            deviceoperationstatusArr: KeywordCache.getDevice_operationstatus(),
            devicephasenumArr: KeywordCache.getDevice_phasenum(),
            deviceinsulationclassArr: KeywordCache.getDevice_insulationclass(),
            deviceuseconditionArr: KeywordCache.getDevice_usecondition(),
            clientName: '',  //变电站
            incominglineName: '',    //总线
            branchName: '',    //支线
            sidebarArr: SidebarCache.data().sidebar,    //变电站数组
            incominglingArr: [],  //总线数组
            branchArr: []    //支线数组,

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
            console.log("sidebar :" + JSON.stringify(SidebarCache.data().sidebar));
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

        $scope.testValue = function () {
            $scope.$close("123");   //关闭时传值
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

            Device.create(params, function (data) {
                if (data.data) {
                    ToastUtils.openToast('success', data.data);
                    $scope.$close(data.data);
                } else {
                    ToastUtils.openToast('info', '很抱歉，无法从服务器获取数据。');
                }
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
