(function () {
    'use strict';

    angular.module('BlurAdmin.power.tfenshi')
        .controller('tfenshiPageCtrl', tfenshiPageCtrl)
        // .controller('PieChartCtrl', PieChartCtrl);

    /** @ngInject */
    function tfenshiPageCtrl($scope, $state, PageTopCache, HttpToast, Log, ToastUtils, $rootScope, $timeout, treeCache,$stateParams,
                           Fenshi,pieHelper1,stackHelper,locals) {
        //tab切换
        $scope.focusIndex=2;
        $scope.focus=function(index){
            $scope.focusIndex=index;
        }
        PageTopCache.cache.state = 'history';
        // PageTopCache.cache.state = $state.$current;
        $scope.GetDateStr = function () {
            var dd = new Date();
            dd.setHours(0);
            dd.setMinutes(0);
            dd.setSeconds(0);
            return dd;
        };
        $scope.data = {
            beginDate1: {
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
            beginDate2: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                    datepickerMode:'month',
                    minMode:'month',
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM'],
                format: 'yyyy-MM',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            },
            beginDate3: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                    datepickerMode:'year',
                    minMode:'year',
                },
                isOpen: false,
                altInputFormats: ['yyyy'],
                format: 'yyyy',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            }
        };
        $scope.show = {
            clientName: '良友木业',  //变电站
            sidebarArr: [],    //变电站数组
            lineNodeList: '',    //节点集合完整数据    这个所有节点信息是一个二维数组  里面决定了所有的下拉框信息  有几个元素就有几个下拉框
            choiceLine: '',  //选择的节点的数据 然后这个地方的元素  决定了 每个下来默认选中的是哪个
            beginDate1: new Date(),  //开始时间
            beginDate2: new Date(),  //开始时间
            beginDate3: new Date(),  //开始时间
            loadLineData: {},
            loadMonthData:{},
            loadYearData:{},
            loadPieData:{},
            piemjianData:{},
            piemfengData:{},
            piempingData:{},
            piemguData:{},
            pieyjianData:{},
            pieyfengData:{},
            pieypingData:{},
            pieyguData:{},
        };

        $scope.form = {
            beginDate1: '',   //开始时间
            beginDate2: '',   //开始时间
            beginDate3: '',   //开始时间
            line_id: '', //所属节点
            interval: 15,
            time:'',
        };
        $scope.initData = function () {

            // init line chart
            $scope.show.loadMonthData ={
                xAxisData: [],   // x轴data
                data:[]

            };
            $scope.show.loadYearData ={
                xAxisData: [],   // x轴data
                data:[]

            };
        };
        $scope.testclick2 = function(paramsDefault) {
            $scope.initData()
            Fenshi.query(paramsDefault,
                function(data) {
                    // console.log(data)//这个是返回的数据
                    $scope.show.loadMonthData = stackHelper.create(data.data) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好

                    $scope.show.piemjianData = pieHelper1.create(data.data.ext.jian) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.show.piemfengData = pieHelper1.create(data.data.ext.feng) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.show.piempingData = pieHelper1.create(data.data.ext.ping) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.show.piemguData = pieHelper1.create(data.data.ext.gu) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.zong=data.data.ext.total;
                    $scope.jian=data.data.ext.jian[0].value;
                    $scope.feng=data.data.ext.feng[0].value;
                    $scope.ping=data.data.ext.ping[0].value;
                    $scope.gu=data.data.ext.gu[0].value;
                    $scope.datalist=data.data.under;
                    //	处理成功
                    // console.log('map h，堆积图：\n' + JSON.stringify($scope.show.loadMonthData));

                },
                function(err) {
                    HttpToast.toast(err);
                })
        }
        var paramsDefault2 ={
            line_id:locals.get('cid', ''),
            time:moment($scope.show.beginDate2).format('YYYY-MM'),
            type:2
        }
        $scope.testclick2(paramsDefault2);

        $scope.testclick3 = function(paramsDefault) {
            $scope.initData()
            Fenshi.query(paramsDefault,
                function(data) {
                    // console.log(data)//这个是返回的数据
                    $scope.show.loadYearData = stackHelper.create(data.data) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好

                    $scope.show.pieyjianData = pieHelper1.create(data.data.ext.jian) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.show.pieyfengData = pieHelper1.create(data.data.ext.feng) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.show.pieypingData = pieHelper1.create(data.data.ext.ping) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.show.pieyguData = pieHelper1.create(data.data.ext.gu) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    $scope.mzong=data.data.ext.total;
                    $scope.mjian=data.data.ext.jian[0].value;
                    $scope.mfeng=data.data.ext.feng[0].value;
                    $scope.mping=data.data.ext.ping[0].value;
                    $scope.mgu=data.data.ext.gu[0].value;
                    $scope.mdatalist=data.data.under;
                    //
                },
                function(err) {
                    HttpToast.toast(err);
                })
        }

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

        $scope.formatForm = function () {
            $scope.form.time = '';

            var params = {};
            for (var Key in $scope.form) {
                if ($scope.form[Key]) {
                    params[Key] = $scope.form[Key];
                }
            }
            return params;
        };
        $scope.checkForm = function () {
            var choiceLineId = '';
            for (var i = 0; i < $scope.show.choiceLine.length; i++) {
                var obj = $scope.show.choiceLine[i];
                if (obj.id) {
                    // 有选中的节点，只需要最后一个节点
                    choiceLineId = obj.id;
                    $scope.show.loadLineData.title=obj.name;
                }
            }
            if (!choiceLineId) {
                // 说明没有选中的节点id
                ToastUtils.openToast('warning', '请选择设备所属支线！');
                return false;
            }
            $scope.form.line_id = choiceLineId;
            return 2;
        };
        $scope.search = function () {
            var state = $scope.checkForm();
            var params = $scope.formatForm();
            switch (state) {
                case 2:
                    switch ($scope.focusIndex){
                        case 2:
                            params.type = 2;
                            if ($scope.show.beginDate2) {
                                params.time = moment($scope.show.beginDate2).format('YYYY-MM');
                            }
                            $scope.testclick2(params);
                            break;
                        case 3:
                            params.type = 3;
                            if ($scope.show.beginDate3) {
                                params.time = moment($scope.show.beginDate3).format('YYYY');
                            }
                            $scope.testclick3(params);
                            break;
                        default:
                            break;
                    }
                    break;
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
            $scope.form.line_id = '';
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

        //date
        $scope.toggleDatepicker1 = function () {
            $scope.data.beginDate1.isOpen = !$scope.data.beginDate1.isOpen;
        };
        $scope.toggleDatepicker2 = function () {
            $scope.data.beginDate2.isOpen = !$scope.data.beginDate2.isOpen;
        };
        $scope.toggleDatepicker3 = function () {
            $scope.data.beginDate3.isOpen = !$scope.data.beginDate3.isOpen;
        };


        /**
         * test
         * 3. 设置数据，有可能后台返回的数据不能直接用，需要前端转换一下。可以写个factory
         * 4. 可以设置默认数据，有可能接口还没返回数据，chart页要展示。或  切换 变电站 获取数据，也要init数据
         */


    }

})();