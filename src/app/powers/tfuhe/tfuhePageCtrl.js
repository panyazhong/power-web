(function () {
    'use strict';

    angular.module('BlurAdmin.power.tfuhe')
        .controller('tfuhePageCtrl', tfuhePageCtrl);
        // .controller('PieChartCtrl', PieChartCtrl);

    /** @ngInject */
    function tfuhePageCtrl($scope, $state, PageTopCache, HttpToast, Log, ToastUtils, $rootScope, $timeout, treeCache,$stateParams,
                           Fuhe,dayHelper,monthHelper) {
        //tab切换
        $scope.focusIndex=1;
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
            // clientName: '',  //变电站
            // incominglineName: '',    //总线
            // branchName: '',    //支线
            // sidebarArr: [],    //变电站数组，默认从缓存里拿
            // incominglingArr: [],  //总线数组
            // branchArr: [],    //支线数组,
            clientName: '良友木业',  //变电站 ？？？？？
            sidebarArr: [],    //变电站数组
            lineNodeList: [[],[]],    //节点集合完整数据    这个所有节点信息是一个二维数组  里面决定了所有的下拉框信息  有几个元素就有几个下拉框
            choiceLine: [{name: '企口4#线电源控制柜'},{name : '企口4#'}],  //选择的节点的数据 然后这个地方的元素  决定了 每个下来默认选中的是哪个
            beginDate1: new Date(),  //开始时间
            beginDate2: new Date(),  //开始时间
            beginDate3: new Date(),  //开始时间
            loadLineData: {},
            loadMonthData:{},
            loadYearData:{}
        };

        $scope.form = {
            // client_id: $stateParams.cid ? $stateParams.cid : '',  //变电站cid，有可能是从地图界面传过来的参
            // incomingline_id: "",    //总进线inid
            // branch_id: "",  //所处支线bid
            beginDate1: '',   //开始时间
            beginDate2: '',   //开始时间
            beginDate3: '',   //开始时间
            line_id: '', //所属节点
            interval: 15,
            time:'',
        };
        $scope.initData = function () {

            // init line chart
            $scope.show.loadLineData ={
                title: "",
                unit: "负荷 kW",
                lineTitle: [
                    "日负荷"
                ],
                timeData: [],
                yesdayData: [],
                todayData: [],

            };
            $scope.show.loadMonthData ={
                title: "",
                unit: "负荷 kW",
                lineTitle: [
                    "最大负荷","最小负荷","平均负荷"
                ],
                timeData: [],
                maxdata: [],
                mindata: [],
                avgdata: [],

            };
            $scope.show.loadYearData ={
                title: "",
                unit: "负荷 kW",
                lineTitle: [
                    "最大负荷","最小负荷","平均负荷"
                ],
                timeData: [],
                maxdata: [],
                mindata: [],
                avgdata: [],

            };
        };
        // $scope.initData()
        $scope.testclick1 = function(paramsDefault) {
            $scope.initData()
            // $timeout(function () {
            //     // 模拟请求，5秒后改变数据
            //
            //     var lineData = {"title":"","unit":"","lineTitle":[],"timeData":["00:00","00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00","03:15","03:30","03:45","04:00","04:15","04:30","04:45","05:00","05:15","05:30","05:45","06:00","06:15","06:30","06:45","07:00","07:15","07:30","07:45","08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30","21:45","22:00","22:15","22:30","22:45","23:00","23:15","23:30","23:45"],"yesdayData":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49.47,74.54,116.31,119.65,90.22,112.56,88.72,111.14,107.06,61.78,82.26,111,108.15,48.88,49.05,49.3,48.61,0,0,0,0,50.38,50.88,47.33,37.03,48.75,12.06,0,0,11.43,12.88,11.68,13.8,23.16,0.36,0.49,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"todayData":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32.32,108.03,114.83,94.26,106.9,110.29,116.98,109.95,68.94,112.6,112.95,63.6,80.5,75.08,0,74.04,108.02,53.81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
            //     $scope.show.loadLineData = lineData;
            // },5000)
            // var pageload = {
            //     name: '日负荷',
            //     datapoints: []
            // };
            Fuhe.query(paramsDefault,
                function(data) {
                    $scope.show.loadLineData = dayHelper.create(data.data) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好
                    // console.log('fuhe : \n'+JSON.stringify(data.data))//这个是返回的数据
                    $scope.max = data.data.ext.max;
                    $scope.maxtime = data.data.ext.max_time;
                    $scope.min = data.data.ext.min;
                    $scope.mintime = data.data.ext.min_time;
                    $scope.avg= data.data.ext.avg;
                    $scope.fenggucha = data.data.ext.diff;
                    $scope.fengguchalv = data.data.ext.avg_rate;
                    $scope.fuhelv = data.data.ext.pv_rate;
                },
                function(err) {
                    HttpToast.toast(err);
                })
        }
        var paramsDefault1 ={
            line_id:'101',
            time:moment($scope.show.beginDate1).format('YYYY-MM-DD'),
            interval: 15,
            type:1
        }
        $scope.testclick1(paramsDefault1);

        $scope.testclick2 = function(paramsDefault) {
            $scope.initData();
            Fuhe.query(paramsDefault,
                function(data) {
                    // console.log(data)//这个是返回的数据
                    $scope.show.loadMonthData = monthHelper.create(data.data) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好

                    //	处理成功
                    $scope.daydata = data.data.list;
                    $scope.daymax=data.data.ext.max;
                    $scope.daymaxtime=data.data.ext.max_time;
                    $scope.daymin=data.data.ext.min;
                    $scope.daymintime=data.data.ext.min_time;
                    $scope.dayavg=data.data.ext.avg;
                    $scope.dayfenggucha=data.data.ext.diff;
                    $scope.dayfengguchalv=data.data.ext.pv_rate;
                    $scope.dayfuhelv = data.data.ext.avg_rate;
                },
                function(err) {
                    HttpToast.toast(err);
                })
        }
        var paramsDefault2 ={
            line_id:'101',
            time:moment($scope.show.beginDate2).format('YYYY-MM'),
            type:2
        }
        $scope.testclick2(paramsDefault2);

        $scope.testclick3 = function(paramsDefault) {
            $scope.initData();
            Fuhe.query(paramsDefault,
                function(data) {
                    // console.log(data)//这个是返回的数据
                    $scope.show.loadYearData = monthHelper.create(data.data) //把要转换的数据，传进去，讲道理返回是data一层，没有code一层，不然isArray等判断要自己写，不好

                    //	处理成功
                    $scope.monthdata = data.data.list;
                    $scope.monthmax = data.data.ext.max;
                    $scope.monthmaxtime = data.data.ext.max_time;
                    $scope.monthmin = data.data.ext.min;
                    $scope.monthmintime = data.data.ext.min_time;
                    $scope.monthavg = data.data.ext.avg;
                    $scope.monthfenggucha = data.data.ext.diff;
                    $scope.monthfengguchalv = data.data.ext.avg_rate;
                    $scope.monthfuhelv = data.data.ext.pv_rate;
                },
                function(err) {
                    HttpToast.toast(err);
                })
        }
        var paramsDefault3 ={
            line_id:'101',
            time:moment($scope.show.beginDate3).format('YYYY'),
            type:3
        }
        $scope.testclick3(paramsDefault3);



        $scope.init = function () {
            var pm = treeCache.getTree();
            pm.then(function (data) {
                $scope.show.sidebarArr = treeCache.createClientArr(data);

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
            // if (!$scope.form.cid) {
            //      return 0
            //  }
            //
            //  if (!$scope.form.time) {
            //    return 0
            // }
            //
            // if (!$scope.form.to_time) {
            //      return 0
            // }
            //
            // if (moment($scope.form.to_time).isBefore($scope.form.from_time)) {
            //     return 1
            // }

            return 2;
        };
//         $scope.setData = function (sucData) {
//             $scope.show.searchData = {
// //              bid: sucData.bid,
//                 data: sucData.data
//             };
//         };
        $scope.search = function () {
            var state = $scope.checkForm();
            var params = $scope.formatForm();
            // console.log(params);
            switch (state) {
                // case 0:
                //     ToastUtils.openToast('warning', '请选择时间！');
                //     break;
                // case 1:
                //     ToastUtils.openToast('warning', '起始不能小于结束时间！');
                //     break;
                case 2:
                    switch ($scope.focusIndex){
                        case 1:
                            params.type = 1;
                            if ($scope.show.beginDate1) {
                                params.time = moment($scope.show.beginDate1).format('YYYY-MM-DD');
                            }
                            $scope.testclick1(params);
                            break;
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
            // if ($scope.show.clientName == obj.clientName) return;
            $scope.show.clientName = obj.clientName;
            // $scope.show.clientName.title
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
                        // console.log($scope.show.lineNodeList)
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