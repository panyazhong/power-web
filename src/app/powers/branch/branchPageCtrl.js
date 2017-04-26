(function () {
    'use strict';

    angular.module('BlurAdmin.power.branch')
        .controller('branchPageCtrl', branchPageCtrl)
        .controller('editDeviceCtrl', editDeviceCtrl)
        .controller('modalDelDeviceCtrl', modalDelDeviceCtrl);

    /** @ngInject */
    function branchPageCtrl($scope, $stateParams, Branch, HttpToast, Device, ToastUtils, BranchimgHelper,
                            PageTopCache, ModalUtils, locals) {

        PageTopCache.cache.state = 'monitoring';

        $scope.show = {
            bid: '',
            branchAlarm: [
                {
                    desc: '过流一段跳闸',
                    state: 'normal',
                    color: '#666666'
                },
                {
                    desc: '二段压变3ZK故障',
                    state: 'normal',
                    color: '#666666'
                },
                {
                    desc: '过流二段跳闸',
                    state: 'danger',
                    color: '#666666'
                },
                {
                    desc: '2QF在运行位置分闸',
                    state: 'normal',
                    color: '#666666'
                },
                {
                    desc: '零流跳闸',
                    state: 'normal',
                    color: '#666666'
                }, {
                    desc: '1ZK、3ZK小开关故障',
                    state: 'danger',
                    color: '#29945b'
                }, {
                    desc: '弹簧未储能',
                    state: 'danger',
                    color: '#29945b'
                }, {
                    desc: '零流二段跳闸',
                    state: 'caution',
                    color: '#ef5c62'
                }, {
                    desc: '二段计量柜3ZK故障',
                    state: 'caution',
                    color: '#ef5c62'
                }, {
                    desc: '自切跳闸',
                    state: 'caution',
                    color: '#ef5c62'
                }, {
                    desc: '3QF电压正常',
                    state: 'caution',
                    color: '#ef5c62'
                },
            ],
            branchData: {},      // 支线基本信息
            branchEqp: [],   // 支线 设备列表
        };
        $scope.rowCollection = [];

        $scope.queryList = function () {
            Branch.queryList({
                    bid: $scope.show.bid,
                    device: 'device'
                },
                function (data) {
                    $scope.show.branchEqp = data;
                    $scope.rowCollection = data;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.init = function () {
            $scope.show.bid = $stateParams.bid || locals.get('bid', '');

            if (!$scope.show.bid) {
                ToastUtils.openToast('warning', '请先选择一个支线！');
                return;
            }

            Branch.query({
                    bid: $scope.show.bid
                },
                function (data) {
                    $scope.show.branchData = BranchimgHelper.query(data);
                    PageTopCache.currentState.state = locals.get('cName', '') + " / " + data.name;
                }, function (err) {
                    HttpToast.toast(err);
                });

            $scope.queryList();
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
        $scope.setItem = function (did) {

            ModalUtils.open('app/powers/device/widgets/editDeviceModal.html', 'lg',
                editDeviceCtrl, {did: did},
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

    }

    // 编辑设备ctrl，若修改在在台账修改
    function editDeviceCtrl($scope, KeywordCache, SidebarCache, ToastUtils, Device, locals, HttpToast,
                            DeviceHelper, Log, Sidebar, Keyword, params, DeviceEdit, ModalUtils) {

        $scope.did = params.did;
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
                    $scope.show.comminssioningdate = new Date(data.comminssioningdate);
                    $scope.show.lastet_date = new Date(data.lastet_date);
                    $scope.show.lastrepair_date = new Date(data.lastrepair_date);
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

            comminssioningdate: '', //投运日期
            lastet_date: '',    //上次电试日期
            lastrepair_date: '',    //上次维修日期
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
                        $scope.queryDeviceDetail()
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
                $scope.queryDeviceDetail()
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

            // change格式
            $scope.form.base.comminssioningdate = '';
            $scope.form.base.lastet_date = '';
            $scope.form.base.lastrepair_date = '';
            if ($scope.show.comminssioningdate) {
                $scope.form.base.comminssioningdate = moment($scope.show.comminssioningdate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.lastet_date) {
                $scope.form.base.lastet_date = moment($scope.show.lastet_date).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.lastrepair_date) {
                $scope.form.base.lastrepair_date = moment($scope.show.lastrepair_date).format('YYYY-MM-DD HH:mm:ss');
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

            params.did = $scope.did;    // 修改比新建多了did参数
            if ($scope.show.deviceType == '变压器') {
                params = DeviceHelper.setDetail(params, $scope.form.detail);
            }

            ModalUtils.openMsg('app/powers/modal/infoEditDevice.html', '',
                modalDelDeviceCtrl, {},
                function (info) {
                    // 传值走这里
                    if (info) {
                        DeviceEdit.update(params,
                            function (data) {
                                ToastUtils.openToast('success', data.message);
                                $scope.$close(data);
                            }, function (err) {
                                HttpToast.toast(err);
                            });

                    }
                }, function (empty) {
                    // 不传值关闭走这里
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

    function modalDelDeviceCtrl($scope) {

        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };

    }

})();
